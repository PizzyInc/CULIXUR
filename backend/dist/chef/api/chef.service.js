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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../backend/src/prisma/prisma.service");
const notification_service_1 = require("../../backend/src/notification/notification.service");
let ChefService = class ChefService {
    constructor(prisma, notificationService, configService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.configService = configService;
        this.backendUrl = this.configService.get('BACKEND_URL') || 'http://127.0.0.1:3001';
    }
    async getDashboard(userId) {
        const orders = await this.prisma.order.findMany({
            where: {
                OR: [
                    { chefId: userId },
                    { status: 'PENDING' }
                ]
            },
            include: { member: true },
            orderBy: { datetime: 'asc' },
        });
        const chef = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { chefProfile: true }
        });
        const menus = await this.prisma.menu.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const formattedMenus = menus.map(m => ({
            ...m,
            image: m.image ? (m.image.startsWith('http') ? m.image : `${this.backendUrl}${m.image}`) : null
        }));
        if (chef?.chefProfile) {
            chef.chefProfile.image = chef.chefProfile.image ? (chef.chefProfile.image.startsWith('http') ? chef.chefProfile.image : `${this.backendUrl}${chef.chefProfile.image}`) : null;
        }
        return {
            pending: orders.filter(o => o.status === 'PENDING'),
            active: orders.filter(o => o.status === 'ASSIGNED' || o.status === 'ACCEPTED' || o.status === 'EN_ROUTE'),
            completed: orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED'),
            chefProfile: chef?.chefProfile || null,
            menus: formattedMenus
        };
    }
    async updateMenu(id, data) {
        return this.prisma.menu.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                fixedPrice: data.price ? parseFloat(data.price) : undefined,
                ...(data.image ? { image: data.image } : {})
            }
        });
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { member: true }
        });
        if (order) {
            await this.notificationService.notifyAdmins(order);
            await this.notificationService.notifyMember(order);
        }
        return order;
    }
    async updateAvailability(userId, data) {
        return this.prisma.chefProfile.updateMany({
            where: { userId },
            data: {
                isAvailable: data.isAvailable,
                unavailableDates: data.unavailableDates.map(d => new Date(d))
            }
        });
    }
    async setupProfile(userId, data) {
        return this.prisma.chefProfile.upsert({
            where: { userId },
            create: {
                userId,
                bio: data.bio,
                categories: data.categories,
                image: data.image,
                isComplete: true,
                specialty: data.specialty || data.categories[0] || 'Executive Chef',
                phoneNumber: 'N/A'
            },
            update: {
                bio: data.bio,
                categories: data.categories,
                specialty: data.specialty || data.categories[0],
                ...(data.image ? { image: data.image } : {}),
                isComplete: true
            }
        });
    }
    async verifyMember(memberId) {
        const user = await this.prisma.user.findUnique({
            where: { memberId },
            include: {
                ordersAsMember: {
                    where: {
                        status: {
                            notIn: ['COMPLETED', 'CANCELLED']
                        }
                    },
                    orderBy: { datetime: 'desc' },
                    take: 1
                }
            }
        });
        if (!user) {
            return { status: 'error', message: 'Member not found' };
        }
        const activeOrder = user.ordersAsMember && user.ordersAsMember.length > 0 ? user.ordersAsMember[0] : null;
        return {
            status: 'success',
            member: {
                name: user.name,
                member_id: user.memberId,
                membership_tier: user.membershipTier,
                image: user.image ? (user.image.startsWith('http') ? user.image : `${this.backendUrl}${user.image}`) : null
            },
            active_order: activeOrder ? {
                id: activeOrder.id,
                menu: activeOrder.menu,
                guests: activeOrder.guestCount,
                datetime: activeOrder.datetime,
                address: activeOrder.address
            } : null
        };
    }
};
exports.ChefService = ChefService;
exports.ChefService = ChefService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService, typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], ChefService);
//# sourceMappingURL=chef.service.js.map