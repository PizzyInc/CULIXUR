import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    cancelSubscription(req: any): Promise<{
        message: string;
    }>;
    handleWebhook(signature: string, req: any): Promise<{
        received: boolean;
    }>;
    createPaymentIntent(req: any, body: {
        amount: number;
        currency?: string;
    }): Promise<{
        clientSecret: string;
    }>;
    createSubscription(req: any, body: {
        priceId?: string;
    }): Promise<{
        subscriptionId: string;
        clientSecret: any;
    }>;
}
