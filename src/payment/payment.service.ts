import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentStatus } from './enum/payment.enum';
import { PaymentRepository } from './repositories/payment.repository';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';
import { MsPurchaseRepository } from 'src/ms-purchase/repositories/ms-purchase.repository';
import { PurchaseStatus } from 'src/ms-purchase/enum/ms-purchase.enum';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { StripeService } from './stripe/stripe.service';
import { PayPalService } from './paypal/paypal.service';
import { PaginationOptions } from 'src/types/common.types';

@Injectable()
export class PaymentService {
  constructor(
    private readonly msPurchaseRepo: MsPurchaseRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly userRepo: UserRepository,
    private readonly accountRepo: AccountRepository,
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
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

    if (gateway === PaymentGateway.STRIPE) {
      const membershipPurchase = await this.msPurchaseRepo.findOne({
        where: { id: membershipPurchaseId },
      });

      if (!membershipPurchase) {
        throw new BadRequestException('Membership purchase not found');
      }

      const returnUrl =
        this.configService.get<string>('BASE_URL') +
        '/v1/payment/stripe-payment-callback';

      const session = await this.stripeService.createCheckoutSession({
        membershipPurchase,
        returnUrl,
        currency,
      });

      const payment = this.paymentRepo.create({
        user: membershipPurchase.user,
        currency,
        gateway,
        servicePurchaseId: membershipPurchase.id,
        paymentStatus: PaymentStatus.PENDING,
        amount: membershipPurchase.amount,
        discount: membershipPurchase.discount,
        payable: membershipPurchase.payable,
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

    if (gateway === PaymentGateway.PAYPAL) {
      const membershipPurchase = await this.msPurchaseRepo.findOne({
        where: { id: membershipPurchaseId },
      });

      if (!membershipPurchase) {
        throw new BadRequestException('Membership purchase not found');
      }

      const returnUrl =
        this.configService.get<string>('BASE_URL') +
        '/v1/payment/paypal-payment-callback';
      const cancelUrl =
        this.configService.get<string>('BASE_URL') + '/payment/cancel';

      const payableAmount = Number(membershipPurchase.payable);

      const order = await this.paypalService.createOrder(
        payableAmount,
        currency,
        returnUrl,
        cancelUrl,
      );

      const approvalUrl = order.links.find(
        (link) => link.rel === 'approve',
      )?.href;

      // Save payment as pending
      const payment = this.paymentRepo.create({
        user: membershipPurchase.user,
        currency,
        gateway,
        servicePurchaseId: membershipPurchase.id,
        paymentStatus: PaymentStatus.PENDING,
        amount: membershipPurchase.amount,
        discount: membershipPurchase.discount,
        payable: membershipPurchase.payable,
        transactionId: order.id,
        storeAmount: null,
      });

      await this.paymentRepo.save(payment);

      return {
        approvalUrl,
        transactionId: order.id,
        paymentStatus: 'pending',
      };
    }
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
  async stripePaymentCallback(sessionId: string) {
    const session = await this.stripeService.retrieveSession(sessionId);

    if (!session) {
      throw new BadRequestException('Invalid session ID');
    }

    const paymentIntent = await this.stripeService.retrievePaymentIntent(
      session.payment_intent as string,
    );

    const updatedStatus =
      paymentIntent.status === 'succeeded'
        ? PaymentStatus.PAID
        : PaymentStatus.FAILED;

    const updatedPayment =
      await this.paymentRepo.findOneByTransactionId(sessionId);

    if (!updatedPayment) {
      throw new NotFoundException('Payment record not found');
    }

    updatedPayment.paymentStatus = updatedStatus;
    await this.paymentRepo.save(updatedPayment);

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

      const fetchedUser = await this.userRepo.findByIdWithoutPassword(
        purchase.user,
      );

      if (fetchedUser) {
        fetchedUser.purchasedMembership = purchase.id;
        await this.accountRepo.save(fetchedUser);
      }
    }

    return {
      url:
        this.configService.get<string>('CLIENT_BASE_URL') +
        `/payment?transactionId=${sessionId}&status=${paymentIntent.status}`,
    };
  }

  /**
   * Handles the PayPal payment callback by capturing the order,
   * updating the payment and purchase records, and returning the redirect URL.
   *
   * @param orderId - The PayPal order ID returned after user approval.
   * @returns An object containing the redirect URL with transaction status for the frontend.
   * @throws NotFoundException if the corresponding payment record is not found.
   */
  async paypalPaymentCallback(orderId: string) {
    // Capture the PayPal order using the PayPal service
    const order = await this.paypalService.captureOrder(orderId);

    // Determine payment status based on PayPal order status
    const status =
      order.status === 'COMPLETED' ? PaymentStatus.PAID : PaymentStatus.FAILED;

    // Find the payment record by transaction ID
    const payment = await this.paymentRepo.findOneByTransactionId(orderId);
    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Update the payment status
    payment.paymentStatus = status;
    await this.paymentRepo.save(payment);

    // Find the related membership purchase record
    const purchase = await this.msPurchaseRepo.findOne({
      where: { id: payment.servicePurchaseId },
    });

    if (purchase) {
      // Update the purchase status based on payment status
      purchase.paymentStatus = status;
      purchase.status =
        status === PaymentStatus.PAID
          ? PurchaseStatus.SUCCEEDED
          : PurchaseStatus.FAILED;

      await this.msPurchaseRepo.save(purchase);

      // If the user exists, associate the purchased membership with their account
      const fetchedUser = await this.userRepo.findByIdWithoutPassword(
        purchase.user,
      );
      if (fetchedUser) {
        fetchedUser.purchasedMembership = purchase.id;
        await this.accountRepo.save(fetchedUser);
      }
    }

    // Return the frontend redirect URL with transaction ID and status
    return {
      url:
        this.configService.get<string>('CLIENT_BASE_URL') +
        `/payment?transactionId=${orderId}&status=${status.toLowerCase()}`,
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
    user: string,
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
