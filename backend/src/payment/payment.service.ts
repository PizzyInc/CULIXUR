import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2024-10-28.acacia' as any, // Using latest or compatible version
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'ngn') {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }

    async verifyPaymentIntent(paymentIntentId: string): Promise<boolean> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status === 'succeeded';
        } catch (error) {
            console.error('Error verifying payment intent:', error);
            return false;
        }
    }

    async createSubscription(userId: number, priceId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        let customerId = user.stripeCustomerId;

        if (!customerId) {
            const customer = await this.stripe.customers.create({
                email: user.email,
                name: user.name || user.email,
            });
            customerId = customer.id;

            await this.prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customerId }
            });
        }

        const subscription = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        return {
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any).payment_intent?.client_secret,
        };
    }

    async createEliteSubscription(userId: number) {
        // Use env variable or fallback for development
        const ELITE_PRICE_ID = process.env.STRIPE_ELITE_PRICE_ID || 'price_1Q...';

        if (!process.env.STRIPE_ELITE_PRICE_ID) {
            console.warn("STRIPE_ELITE_PRICE_ID is not set. Using placeholder.");
        }

        try {
            return await this.createSubscription(userId, ELITE_PRICE_ID);
        } catch (error) {
            console.error('Stripe Subscription Error:', error);
            // If the Price ID is invalid (since it's a placeholder), we might want to 
            // fallback to a generic payment intent for demonstration or throw.
            throw new Error('Elite subscription initialization failed. Please ensure Stripe Price ID is configured.');
        }
    }

    async cancelSubscription(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        // Always ensure DB state is updated if they are currently ELITE
        const performDbDowngrade = async () => {
            await this.prisma.user.update({
                where: { id: userId },
                data: { membershipTier: 'CULIXUR' }
            });
        };

        if (!user.stripeCustomerId) {
            await performDbDowngrade();
            return { message: 'Membership downgraded (No payment history found).' };
        }

        // Find active or trialing subscriptions for this customer
        const subscriptions = await this.stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'active',
            limit: 5,
        });

        const trialing = await this.stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'trialing',
            limit: 5,
        });

        const allSubs = [...subscriptions.data, ...trialing.data];

        if (allSubs.length > 0) {
            for (const sub of allSubs) {
                await this.stripe.subscriptions.cancel(sub.id);
            }
        }

        await performDbDowngrade();

        return { message: 'Subscription cancelled and membership downgraded.' };
    }

    async handleWebhook(payload: any, signature: string) {
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || ''
            );
        } catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;

            if (invoice.billing_reason === 'subscription_create') {
                const subscriptionId = (invoice as any).subscription as string;
                const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

                await this.prisma.user.update({
                    where: { stripeCustomerId: customerId },
                    data: { membershipTier: 'ELITE' }
                });
            }
        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            await this.prisma.user.update({
                where: { stripeCustomerId: customerId },
                data: { membershipTier: 'CULIXUR' }
            });
        }

        return { received: true };
    }
}
