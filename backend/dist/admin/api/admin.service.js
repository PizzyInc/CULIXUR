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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../backend/src/prisma/prisma.service");
const notification_service_1 = require("../../backend/src/notification/notification.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(prisma, notificationService, configService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.configService = configService;
        this.backendUrl = this.configService.get('BACKEND_URL') || 'http://127.0.0.1:3001';
        this.defaultPassword = this.configService.get('DEFAULT_USER_PASSWORD') || 'welcome123';
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
            recentOrders: recentOrders.map((o) => ({
                ...o,
                member: o.member ? { ...o.member, image: o.member.image ? (o.member.image.startsWith('http') ? o.member.image : `${this.backendUrl}${o.member.image}`) : null } : null,
                chef: o.chef ? { ...o.chef, image: o.chef.image ? (o.chef.image.startsWith('http') ? o.chef.image : `${this.backendUrl}${o.chef.image}`) : null } : null,
            })),
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
        const menus = await this.prisma.menu.findMany();
        return menus.map(m => ({
            ...m,
            image: m.image ? (m.image.startsWith('http') ? m.image : `${this.backendUrl}${m.image}`) : null
        }));
    }
    async getUsers() {
        const users = await this.prisma.user.findMany({
            include: { chefProfile: true }
        });
        return users.map((u) => ({
            ...u,
            image: u.image ? (u.image.startsWith('http') ? u.image : `${this.backendUrl}${u.image}`) : null,
            chefProfile: u.chefProfile ? {
                ...u.chefProfile,
                image: u.chefProfile.image ? (u.chefProfile.image.startsWith('http') ? u.chefProfile.image : `${this.backendUrl}${u.chefProfile.image}`) : null
            } : null
        }));
    }
    async getBookings() {
        const orders = await this.prisma.order.findMany({
            include: { member: true, chef: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map((o) => ({
            ...o,
            member: o.member ? { ...o.member, image: o.member.image ? (o.member.image.startsWith('http') ? o.member.image : `${this.backendUrl}${o.member.image}`) : null } : null,
            chef: o.chef ? { ...o.chef, image: o.chef.image ? (o.chef.image.startsWith('http') ? o.chef.image : `${this.backendUrl}${o.chef.image}`) : null } : null,
        }));
    }
    async approveApplication(applicationId) {
        const application = await this.prisma.membershipApplication.findUnique({
            where: { id: applicationId }
        });
        if (!application)
            throw new Error('Application not found');
        const memberId = `CX-${application.id.toString().padStart(4, '0')}`;
        const hashedPassword = await bcrypt.hash(this.defaultPassword, 10);
        const user = await this.prisma.user.upsert({
            where: { email: application.email },
            update: {
                role: client_1.Role.MEMBER,
                membershipTier: application.membershipTier,
                memberId: memberId,
            },
            create: {
                email: application.email,
                password: hashedPassword,
                name: `${application.firstName} ${application.lastName}`,
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
        const password = data.password || 'ChangeMe123!';
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
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
    async updateChefProfile(userId, data) {
        console.log(`Updating chef ${userId} with data:`, data);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
            }
        });
        const chefProfileData = {
            bio: data.bio,
            categories: data.categories || [],
        };
        if (data.image) {
            chefProfileData.image = data.image;
        }
        return this.prisma.chefProfile.upsert({
            where: { userId },
            create: {
                userId,
                specialty: data.specialty || 'General',
                phoneNumber: data.phoneNumber || 'N/A',
                ...chefProfileData
            },
            update: chefProfileData
        });
    }
    async createMember(data) {
        const password = data.passphrase || data.password || this.defaultPassword;
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                memberId: data.memberId,
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: client_1.Role.MEMBER,
                membershipTier: client_1.MembershipTier.CULIXUR,
            }
        });
    }
    async updateUser(id, data) {
        const updateData = {
            name: data.name,
            email: data.email,
            membershipTier: data.membershipTier,
        };
        if (data.passphrase && data.passphrase.trim() !== '') {
            updateData.password = await bcrypt.hash(data.passphrase, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({
            where: { id }
        });
    }
    async syncUsers() {
        const users = await this.prisma.user.findMany();
        let updatedCount = 0;
        for (const user of users) {
            let needsUpdate = false;
            const updateData = {};
            if (!user.membershipTier) {
                updateData.membershipTier = client_1.MembershipTier.CULIXUR;
                needsUpdate = true;
            }
            if (user.role === client_1.Role.MEMBER && !user.memberId) {
                updateData.memberId = `CX-${user.id.toString().padStart(4, '0')}`;
                needsUpdate = true;
            }
            if (needsUpdate) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: updateData
                });
                updatedCount++;
            }
        }
        return { message: `Synchronized ${updatedCount} users.`, total: users.length };
    }
    async createMenu(data) {
        try {
            console.log('📝 Creating menu with data:', {
                name: data.name,
                description: data.description,
                price: data.price,
                serviceType: data.serviceType,
                img: data.img
            });
            const menuData = {
                name: data.name,
                description: data.description,
                fixedPrice: data.price,
                image: data.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                serviceType: data.serviceType || 'ATELIER'
            };
            console.log('💾 Attempting to save menu to database...');
            const menu = await this.prisma.menu.create({
                data: menuData
            });
            console.log('✅ Menu created successfully:', {
                id: menu.id,
                name: menu.name,
                serviceType: menu.serviceType
            });
            return menu;
        }
        catch (error) {
            console.error('❌ Menu creation failed:', error);
            throw new Error(`Failed to create menu: ${error.message}`);
        }
    }
    async updateMenu(id, data) {
        try {
            console.log(`📝 Updating menu ${id} with data:`, data);
            const updateData = {
                name: data.name,
                description: data.description,
                fixedPrice: data.price,
                serviceType: data.serviceType || 'ATELIER'
            };
            if (data.img) {
                updateData.image = data.img;
            }
            const menu = await this.prisma.menu.update({
                where: { id },
                data: updateData
            });
            console.log('✅ Menu updated successfully:', menu.id);
            return menu;
        }
        catch (error) {
            console.error('❌ Menu update failed:', error);
            throw new Error(`Failed to update menu: ${error.message}`);
        }
    }
    async deleteMenu(id) {
        try {
            console.log(`🗑️  Deleting menu ${id}`);
            await this.prisma.menu.delete({
                where: { id }
            });
            console.log('✅ Menu deleted successfully');
            return { success: true, message: 'Menu deleted successfully' };
        }
        catch (error) {
            console.error('❌ Menu deletion failed:', error);
            throw new Error(`Failed to delete menu: ${error.message}`);
        }
    }
    async getAllApplications() {
        return this.prisma.membershipApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    async reassignChef(orderId, newChefId) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { chefId: newChefId },
            include: { chef: true, member: true }
        });
        if (order.chefId) {
            await this.notificationService.notifyChefs([order.chefId], order);
        }
        return order;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService, typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AdminService);
//# sourceMappingURL=admin.service.js.map