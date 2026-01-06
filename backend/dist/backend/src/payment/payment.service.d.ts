import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentService {
    private prisma;
    private stripe;
    constructor(prisma: PrismaService);
    createPaymentIntent(amount: number, currency?: string): Promise<{
        clientSecret: string;
    }>;
    verifyPaymentIntent(paymentIntentId: string): Promise<boolean>;
    createSubscription(userId: number, priceId: string): Promise<{
        subscriptionId: string;
        clientSecret: any;
    }>;
    createEliteSubscription(userId: number): Promise<{
        subscriptionId: string;
        clientSecret: any;
    }>;
    cancelSubscription(userId: number): Promise<{
        message: string;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
}
