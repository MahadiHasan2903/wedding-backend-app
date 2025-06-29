import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentStatus } from './enum/payment.enum';
import { PaymentRepository } from './repositories/payment.repository';
import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';
import { MsPurchaseRepository } from 'src/ms-purchase/repositories/ms-purchase.repository';
import { PaginationOptions } from 'src/types/common.types';
import { PurchaseStatus } from 'src/ms-purchase/enum/ms-purchase.enum';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly msPurchaseRepo: MsPurchaseRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly userRepo: UserRepository,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a Stripe Checkout Session payment for a membership purchase.
   *
   * @param dto - DTO containing membershipPurchaseId, gateway, and currency
   * @returns Object containing Stripe checkout sessionId, transactionId, and paymentStatus
   * @throws BadRequestException if gateway is unsupported or purchase not found
   */
  async createMembershipPayment(dto: CreateMembershipPaymentDto) {
    const { membershipPurchaseId, gateway, currency } = dto;

    if (gateway !== PaymentGateway.STRIPE) {
      throw new BadRequestException('Only Stripe is supported for now');
    }

    const membershipPurchase = await this.msPurchaseRepo.findOne({
      where: { id: membershipPurchaseId },
    });

    if (!membershipPurchase) {
      throw new BadRequestException('Membership purchase not found');
    }

    const { user, amount, discount, payable, id } = membershipPurchase;

    // Build the return/callback URL for Stripe to redirect after payment
    const RETURN_URL =
      this.configService.get<string>('BASE_URL') +
      `/v1/payment/stripe/payment-callback`;

    // Create Stripe Checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ui_mode: 'custom',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Membership Package #${membershipPurchase.packageId}`,
            },
            unit_amount: Math.round(payable * 100),
          },
          quantity: 1,
        },
      ],
      return_url: `${RETURN_URL}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        membershipPurchaseId: id.toString(),
        userId: user.toString(),
      },
    });

    // Save a new Payment transaction record with status pending
    const payment = this.paymentRepo.create({
      user,
      currency,
      gateway,
      servicePurchaseId: id,
      paymentStatus: PaymentStatus.PENDING,
      amount,
      discount,
      payable,
      transactionId: session.id,
      storeAmount: null,
    });

    await this.paymentRepo.save(payment);

    return {
      clientSecret: session.client_secret,
      transactionId: session.id,
      paymentStatus: 'pending',
    };
  }

  /**
   * Handles the payment callback from Stripe after user completes checkout.
   *
   * This method performs the following actions:
   *
   * @param sessionId - The Stripe Checkout Session ID received from the callback
   * @returns An object containing the redirect URL with payment status and transaction ID
   *
   * @throws BadRequestException if session retrieval fails
   * @throws NotFoundException if the associated Payment record is not found
   */
  async paymentCallback(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new BadRequestException('Invalid session ID');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      session.payment_intent as string,
    );

    const updatedStatus =
      paymentIntent.status === 'succeeded'
        ? PaymentStatus.PAID
        : PaymentStatus.FAILED;

    // Update Payment record
    const updatedPayment =
      await this.paymentRepo.findOneByTransactionId(sessionId);

    if (!updatedPayment) {
      throw new NotFoundException('Payment record not found');
    }

    updatedPayment.paymentStatus = updatedStatus;
    await this.paymentRepo.save(updatedPayment);

    // Update membership purchase status if needed
    const purchase = await this.msPurchaseRepo.findOne({
      where: { id: updatedPayment.servicePurchaseId },
    });

    if (purchase) {
      purchase.paymentStatus = updatedStatus;
      purchase.status =
        updatedStatus === PaymentStatus.PAID
          ? PurchaseStatus.SUCCEEDED
          : PurchaseStatus.FAILED;

      await this.msPurchaseRepo.save(purchase);
    }

    // Return redirect URL to frontend
    return {
      url:
        this.configService.get<string>('CLIENT_BASE_URL') +
        `/payment?transactionId=${sessionId}&status=${paymentIntent.status}`,
    };
  }

  /**
   * Retrieves payment details by transaction ID along with related membership purchase info.
   *
   * @param transactionId - The transaction ID to look up the payment.
   * @returns An object containing payment data and the related membership purchase.
   * @throws NotFoundException if no payment is found for the given transaction ID.
   */
  async getPaymentByTransactionId(transactionId: string) {
    // Find the payment record matching the given transaction ID
    const payment =
      await this.paymentRepo.findOneByTransactionId(transactionId);

    if (!payment) {
      throw new NotFoundException(
        `Payment with transactionId ${transactionId} not found`,
      );
    }

    // Find the membership purchase associated with this payment
    const membershipPurchase = await this.msPurchaseRepo.findOne({
      where: { id: payment.servicePurchaseId },
    });

    // Fetch the user (excluding password)
    const user = await this.userRepo.findByIdWithoutPassword(payment.user);

    // Return combined data with payment info and related membership purchase details
    return {
      ...payment,
      userId: user,
      servicePurchaseId: membershipPurchase,
    };
  }

  /**
   * Retrieves all payments and enriches each payment
   * with the related membership purchase details.
   *
   * @returns An array of payments, each including its membership purchase info.
   */
  async getAllPayments({ page, pageSize, sort }: PaginationOptions) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.paymentRepo.findAndCount({
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const itemsWithMembership = await Promise.all(
      items.map(async (payment) => {
        const membershipPurchase = await this.msPurchaseRepo.findOne({
          where: { id: payment.servicePurchaseId },
        });

        // Fetch the user (excluding password)
        const user = await this.userRepo.findByIdWithoutPassword(payment.user);

        return {
          ...payment,
          user: user,
          servicePurchaseId: membershipPurchase,
        };
      }),
    );

    return {
      items: itemsWithMembership,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }
  /**
   * Retrieves all payments made by a specific user,
   * and enriches each payment with its associated membership purchase details.
   *
   * @param user - The unique identifier of the user whose payments are being fetched.
   * @returns A list of payment objects, each including the corresponding membership purchase information.
   */
  async getPaymentsByUserId(
    user: number,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.paymentRepo.findAndCount({
      where: { user },
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const itemsWithMembership = await Promise.all(
      items.map(async (payment) => {
        const membershipPurchase = await this.msPurchaseRepo.findOne({
          where: { id: payment.servicePurchaseId },
        });

        return {
          ...payment,
          servicePurchaseId: membershipPurchase,
        };
      }),
    );

    return {
      items: itemsWithMembership,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }
}
