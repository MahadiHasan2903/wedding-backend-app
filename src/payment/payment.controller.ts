import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';

import { Response } from 'express';
import { sanitizeError } from 'src/utils/helpers';
import { PaymentService } from './payment.service';
import { UserRole } from 'src/users/enum/users.enum';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * @route POST /v1/payment/membership-purchase
   * @desc Create a payment intent for a membership purchase
   * @access User, Admin
   * @param {CreateMembershipPaymentDto} dto - Data required to create membership payment
   * @returns {object} clientSecret, transactionId, paymentStatus
   */
  @Public()
  @Post('initiate-payment')
  async purchaseMembership(@Body() dto: CreateMembershipPaymentDto) {
    try {
      const result = await this.paymentService.createMembershipPayment(dto);

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Membership payment intent created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to create membership payment',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Stripe payment callback endpoint.
   *
   * This endpoint is triggered when Stripe redirects the user after completing a payment.
   * @param sessionId - The Stripe Checkout Session ID passed by Stripe as a query param
   * @returns Redirect URL to the client with transaction ID and status
   */
  @Public()
  @Get('stripe-payment-callback')
  @Redirect()
  async stripeCallback(@Query('session_id') sessionId: string) {
    const result = await this.paymentService.stripePaymentCallback(sessionId);
    return {
      statusCode: HttpStatus.PERMANENT_REDIRECT,
      url: result.url,
    };
  }

  /**
   * PayPal payment approval callback endpoint.
   *
   * This route is hit by PayPal after the user approves the payment and is redirected
   * back to the system with a `orderId` (PayPal order ID). This method finalizes the
   * transaction by calling the appropriate service method to capture the payment.
   *
   * @route POST /v1/payment/paypal-payment-callback?orderId={paypal_order_id}
   * @access Public
   * @param orderId PayPal order ID passed as a query parameter
   * @returns Success or failure response with relevant data or error
   */
  @Public()
  @Post('paypal-payment-callback')
  async membershipPaypalPaymentCallback(@Query('orderId') orderId: string) {
    try {
      const response = await this.paymentService.paypalPaymentCallback(orderId);

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'PayPal membership payment completed successfully',
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'PayPal membership payment failed',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Controller endpoint to retrieve all payments in the system.
   * Accessible only by users with ADMIN role.
   * @returns A response object containing all payments with membership purchase details
   *
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllPayments(@Query() query: SearchPaymentDto) {
    try {
      const { page, pageSize, sort, gateway, paymentStatus, dateRange } = query;

      // Call the payment service to fetch all payments along with membership purchase data
      const payments = await this.paymentService.getAllPayments(
        page,
        pageSize,
        sort,
        {
          gateway,
          paymentStatus,
          dateRange,
        },
      );

      // Return a successful HTTP response with the payments data
      return {
        status: 200,
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
      };
    } catch (error) {
      // On error, throw an HTTP exception with BAD_REQUEST status and sanitized error message
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve payments',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Controller endpoint to retrieve the payment history of the currently authenticated user.
   * Accessible by users with USER or ADMIN roles.
   *
   * @param user - The currently authenticated user object injected by @CurrentUser decorator,
   * @returns A response object with the user's payment history and status indicators.
   */
  @Get('my-history')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getUserPaymentHistory(
    @Query() query: SearchPaymentDto,
    @CurrentUser() user: { userId: string },
  ) {
    try {
      const { page, pageSize, sort, gateway, paymentStatus, dateRange } = query;

      // Convert userId to a number and fetch payments for that user from the service
      const payments = await this.paymentService.getPaymentsByUserId(
        user.userId,
        page,
        pageSize,
        sort,
        {
          gateway,
          paymentStatus,
          dateRange,
        },
      );

      // Return a successful response with the user's payment history data
      return {
        status: 200,
        success: true,
        message: 'User payment history retrieved successfully',
        data: payments,
      };
    } catch (error) {
      // On error, throw an HTTP exception with BAD_REQUEST status and sanitized error message
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve user payment history',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieves a summarized view of subscription revenue.
   *
   * This endpoint aggregates subscription payments for different time frames
   * (weekly, monthly, quarterly, total) and provides per-month totals for the current year.
   *
   * @access ADMIN only
   * @returns {Object} A standardized response object
   * @throws {HttpException} Throws a BAD_REQUEST error if retrieval fails, with a sanitized error message.
   */
  @Get('subscription-revenue')
  @Roles(UserRole.ADMIN)
  async getSubscriptionRevenueSummary() {
    try {
      const revenueSummary = await this.paymentService.getRevenueSummary();

      // Return the revenue data in a standardized response format
      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Subscription revenue summary retrieved successfully',
        data: revenueSummary,
      };
    } catch (error) {
      // Log and return a sanitized error response
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Unable to retrieve subscription revenue summary',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @route GET /v1/payment/:transactionId
   * @desc Retrieve payment details by transaction ID
   * @access User, Admin
   * @param {string} transactionId - Stripe transaction/checkout session ID
   * @returns {object} payment details if found
   */
  @Get(':transactionId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getPaymentDetails(@Param('transactionId') transactionId: string) {
    try {
      const payment =
        await this.paymentService.getPaymentByTransactionId(transactionId);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Payment details retrieved successfully',
        data: payment,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve payment details',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
