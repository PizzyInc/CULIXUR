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
exports.ChefService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../notification/notification.service");
let ChefService = class ChefService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getDashboard(userId) {
        const orders = await this.prisma.order.findMany({
            where: { OR: [{ chefId: userId }, { status: 'PENDING' }] },
            include: { member: true },
            orderBy: { datetime: 'asc' },
        });
        const availability = await this.prisma.chefAvailability.findMany({
            where: { chefId: userId, date: { gte: new Date() } },
            orderBy: { date: 'asc' },
        });
        return { orders, availability };
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
    async updateAvailability(userId, slots) {
        await this.prisma.chefAvailability.deleteMany({
            where: { chefId: userId, date: { gte: new Date() } }
        });
        return this.prisma.chefAvailability.createMany({
            data: slots.map(slot => ({
                chefId: userId,
                date: new Date(slot.date),
                startTime: new Date(`${slot.date}T${slot.startTime}:00Z`),
                endTime: new Date(`${slot.date}T${slot.endTime}:00Z`),
                status: client_1.AvailabilityStatus.AVAILABLE
            }))
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
        return {
            status: 'success',
            member: {
                name: user.name,
                member_id: user.memberId,
                membership_tier: user.membershipTier,
            },
            active_order: user.ordersAsMember[0] ? {
                id: user.ordersAsMember[0].id,
                menu: user.ordersAsMember[0].menu,
                guests: user.ordersAsMember[0].guestCount
            } : null
        };
    }
};
exports.ChefService = ChefService;
exports.ChefService = ChefService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ChefService);
//# sourceMappingURL=chef.service.js.map