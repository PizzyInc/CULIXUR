"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentService = class PaymentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2024-10-28.acacia',
        });
    }
    async createPaymentIntent(amount, currency = 'ngn') {
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
    async verifyPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status === 'succeeded';
        }
        catch (error) {
            console.error('Error verifying payment intent:', error);
            return false;
        }
    }
    async createSubscription(userId, priceId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
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
            clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
        };
    }
    async createEliteSubscription(userId) {
        const ELITE_PRICE_ID = process.env.STRIPE_ELITE_PRICE_ID || 'price_1Q...';
        if (!process.env.STRIPE_ELITE_PRICE_ID) {
            console.warn("STRIPE_ELITE_PRICE_ID is not set. Using placeholder.");
        }
        try {
            return await this.createSubscription(userId, ELITE_PRICE_ID);
        }
        catch (error) {
            console.error('Stripe Subscription Error:', error);
            throw new Error('Elite subscription initialization failed. Please ensure Stripe Price ID is configured.');
        }
    }
    async cancelSubscription(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
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
    async handleWebhook(payload, signature) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
        }
        catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            if (invoice.billing_reason === 'subscription_create') {
                const subscriptionId = invoice.subscription;
                const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
                await this.prisma.user.update({
                    where: { stripeCustomerId: customerId },
                    data: { membershipTier: 'ELITE' }
                });
            }
        }
        else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            await this.prisma.user.update({
                where: { stripeCustomerId: customerId },
                data: { membershipTier: 'CULIXUR' }
            });
        }
        return { received: true };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map