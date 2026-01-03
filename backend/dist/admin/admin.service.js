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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async getDashboard() {
        const recentOrders = await this.prisma.order.findMany({
            include: { member: true, chef: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const pendingApplications = await this.prisma.membershipApplication.count({
            where: { status: 'PENDING' }
        });
        const activeEvents = await this.prisma.event.count({
            where: { active: true }
        });
        const pendingReferrals = await this.prisma.referral.count({
            where: { status: 'PENDING' }
        });
        const pendingApplicationsList = await this.prisma.membershipApplication.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        return {
            recentOrders,
            pending_applications: pendingApplicationsList,
            stats: {
                live_orders: recentOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length,
                active_chefs: await this.prisma.user.count({ where: { role: 'CHEF' } }),
                review_queue: pendingApplications,
                aov: (await this.prisma.order.aggregate({ _avg: { price: true } }))._avg.price || 0,
            }
        };
    }
    async getMenus() {
        return this.prisma.menu.findMany();
    }
    async getUsers() {
        return this.prisma.user.findMany({
            include: { chefProfile: true }
        });
    }
    async approveApplication(applicationId) {
        const application = await this.prisma.membershipApplication.findUnique({
            where: { id: applicationId }
        });
        if (!application)
            throw new Error('Application not found');
        const memberId = `CX-${application.id.toString().padStart(4, '0')}`;
        const user = await this.prisma.user.update({
            where: { email: application.email },
            data: {
                role: client_1.Role.MEMBER,
                membershipTier: application.membershipTier,
                memberId: memberId,
            }
        });
        await this.prisma.membershipApplication.update({
            where: { id: applicationId },
            data: { status: client_1.ApplicationStatus.APPROVED, userId: user.id }
        });
        return { success: true, memberId };
    }
    async rejectApplication(applicationId) {
        return this.prisma.membershipApplication.update({
            where: { id: applicationId },
            data: { status: client_1.ApplicationStatus.REJECTED }
        });
    }
    async createChef(data) {
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password || 'ChangeMe123!',
                role: client_1.Role.CHEF,
                chefProfile: {
                    create: {
                        specialty: data.specialty || 'General Culinary',
                        phoneNumber: data.phone_number || 'N/A',
                        bio: data.bio || '',
                    }
                }
            }
        });
        return user;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], AdminService);
//# sourceMappingURL=admin.service.js.map