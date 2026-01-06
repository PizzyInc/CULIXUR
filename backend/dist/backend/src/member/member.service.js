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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const payment_service_1 = require("../payment/payment.service");
const client_1 = require("@prisma/client");
let MemberService = class MemberService {
    constructor(prisma, paymentService, configService) {
        this.prisma = prisma;
        this.paymentService = paymentService;
        this.configService = configService;
        this.backendUrl = this.configService.get('BACKEND_URL') || 'http://127.0.0.1:3001';
    }
    async getDashboard(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                memberId: true,
                membershipTier: true,
                image: true,
            }
        });
        const orders = await this.prisma.order.findMany({
            where: { memberId: userId },
            include: { chef: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const upcomingEvents = await this.prisma.event.findMany({
            where: { active: true, eventAt: { gte: new Date() } },
            orderBy: { eventAt: 'asc' },
            take: 3,
        });
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyOrderCount = await this.prisma.order.count({
            where: {
                memberId: userId,
                createdAt: { gte: startOfMonth },
            }
        });
        if (user && user.image) {
            user.image = user.image.startsWith('http') ? user.image : `${this.backendUrl}${user.image}`;
        }
        return { user, orders, upcomingEvents, monthlyOrderCount };
    }
    async getBookingDetails() {
        try {
            const menus = await this.prisma.menu.findMany({
                orderBy: { createdAt: 'desc' }
            });
            const formattedMenus = menus.map((menu) => ({
                ...menu,
                image: menu.image ? (menu.image.startsWith('http') ? menu.image : `${this.backendUrl}${menu.image}`) : null
            }));
            const chefs = await this.prisma.user.findMany({
                where: {
                    role: 'CHEF',
                    chefProfile: {
                        isAvailable: true
                    }
                },
                include: { chefProfile: true },
            });
            const formattedChefs = chefs.map((chef) => {
                const chefImage = chef.image || chef.chefProfile?.image;
                return {
                    id: chef.id,
                    name: chef.name,
                    specialty: chef.chefProfile?.specialty ?? 'Master Chef',
                    bio: chef.chefProfile?.bio ?? '',
                    categories: chef.chefProfile?.categories ?? [],
                    experienceYears: chef.chefProfile?.experienceYears ?? 0,
                    avatar: chefImage
                        ? (chefImage.startsWith('http') ? chefImage : `${this.backendUrl}${chefImage}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}&background=654321&color=fff`,
                };
            });
            return {
                menus: formattedMenus,
                chefs: formattedChefs,
            };
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            throw new Error('Failed to load experience details. Please try again.');
        }
    }
    async createBooking(userId, data) {
        const menu = await this.prisma.menu.findUnique({ where: { id: data.menu_id } });
        if (!menu)
            throw new Error('Menu not found');
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const orderCount = await this.prisma.order.count({
            where: {
                memberId: userId,
                createdAt: { gte: startOfMonth },
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        let isPaymentRequired = false;
        if (user?.membershipTier === 'ELITE') {
            if (orderCount >= 15) {
                throw new Error('Monthly Elite order limit reached (15 orders). Please contact support for additional orchestration.');
            }
        }
        else {
            isPaymentRequired = true;
        }
        if (isPaymentRequired) {
            if (!data.payment_intent_id) {
                throw new Error('Payment is required to confirm this orchestration.');
            }
            const isVerified = await this.paymentService.verifyPaymentIntent(data.payment_intent_id);
            if (!isVerified) {
                throw new Error('Secure payment verification failed. Please try again.');
            }
        }
        const order = await this.prisma.order.create({
            data: {
                serviceType: data.service_type,
                menu: menu.name,
                price: menu.fixedPrice,
                datetime: new Date(data.datetime),
                address: data.address,
                guestCount: data.guest_count,
                allergies: data.allergies,
                memberId: userId,
                status: 'PENDING',
                selectedChefs: data.selected_chefs,
                paymentIntentId: data.payment_intent_id,
                paymentStatus: data.payment_intent_id ? 'PAID' : 'PENDING'
            },
        });
        const orderId = 'ORD-' + order.id.toString().padStart(4, '0');
        await this.prisma.order.update({
            where: { id: order.id },
            data: { orderId },
        });
        return {
            success: true,
            message: 'Booking created successfully',
            order_id: order.id,
            order_number: orderId,
        };
    }
    async referElite(userId, data) {
        const referrer = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!referrer || referrer.membershipTier !== 'ELITE') {
            throw new Error('Only Elite members can refer new Elite candidates.');
        }
        return this.prisma.referral.create({
            data: {
                referrerId: userId,
                referredName: data.full_name,
                referredEmail: data.email,
                referredPhone: data.phone,
                referredOccupation: data.occupation || 'N/A',
                isElite: true,
            },
        });
    }
    async apply(data) {
        return this.prisma.membershipApplication.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                location: data.location,
                membershipTier: data.membershipTier,
                referralCode: data.referralCode,
                message: data.message || `${data.whyElite || ''} | Achievements: ${data.achievements || ''}`,
                eliteQualifiers: JSON.stringify({
                    category: data.eliteCategory,
                    netWorth: data.netWorthRange,
                    company: data.company,
                    industry: data.industry,
                    position: data.positionTitle
                }),
                userId: data.userId,
                status: client_1.ApplicationStatus.PENDING
            }
        });
    }
    async updateProfile(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.image ? { image: data.image } : {})
            }
        });
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_service_1.PaymentService,
        config_1.ConfigService])
], MemberService);
//# sourceMappingURL=member.service.js.map