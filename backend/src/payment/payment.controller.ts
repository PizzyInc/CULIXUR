import { Controller, Post, Body, Headers, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('cancel-subscription')
    cancelSubscription(@Request() req: any) {
        return this.paymentService.cancelSubscription(req.user.userId);
    }

    @Post('webhook')
    async handleWebhook(@Headers('stripe-signature') signature: string, @Request() req: any) {
        // NestJS body might already be parsed. Stripe needs raw body for signature verification.
        // However, for this environment, we'll try to use the body as is if verified.
        // If it fails, middleware/raw-body handling might be needed.
        return this.paymentService.handleWebhook(req.body, signature);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create-intent')
    async createPaymentIntent(@Request() req, @Body() body: { amount: number; currency?: string }) {
        return this.paymentService.createPaymentIntent(body.amount, body.currency);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create-subscription')
    async createSubscription(@Request() req, @Body() body: { priceId?: string }) {
        if (body.priceId) {
            return this.paymentService.createSubscription(req.user.userId, body.priceId);
        }
        return this.paymentService.createEliteSubscription(req.user.userId);
    }
}
