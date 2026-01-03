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
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MemberService = class MemberService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        return { user, orders, upcomingEvents };
    }
    async getBookingDetails() {
        const menus = await this.prisma.menu.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const chefs = await this.prisma.user.findMany({
            where: { role: 'CHEF' },
            include: { chefProfile: true },
        });
        return {
            menus,
            chefs: chefs.map((chef) => ({
                id: chef.id,
                name: chef.name,
                specialty: chef.chefProfile?.specialty ?? 'Master Chef',
                avatar: chef.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}&background=654321&color=fff`,
            })),
        };
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
        if (orderCount >= 15) {
            throw new Error('Monthly order limit reached for Elite Membership (15 orders).');
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
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemberService);
//# sourceMappingURL=member.service.js.map