import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { NotificationService } from '../../backend/src/notification/notification.service';
import { OrderStatus, ApplicationStatus, Role, MembershipTier } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    private backendUrl: string;
    private defaultPassword: string;

    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private configService: ConfigService,
    ) {
        this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://127.0.0.1:3001';
        this.defaultPassword = this.configService.get<string>('DEFAULT_USER_PASSWORD') || 'welcome123';
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
            recentOrders: recentOrders.map((o: any) => ({
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
        return users.map((u: any) => ({
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
        return orders.map((o: any) => ({
            ...o,
            member: o.member ? { ...o.member, image: o.member.image ? (o.member.image.startsWith('http') ? o.member.image : `${this.backendUrl}${o.member.image}`) : null } : null,
            chef: o.chef ? { ...o.chef, image: o.chef.image ? (o.chef.image.startsWith('http') ? o.chef.image : `${this.backendUrl}${o.chef.image}`) : null } : null,
        }));
    }

    async approveApplication(applicationId: number) {
        const application = await this.prisma.membershipApplication.findUnique({
            where: { id: applicationId }
        });

        if (!application) throw new Error('Application not found');

        // Static Member ID (e.g. CX-0001)
        const memberId = `CX-${application.id.toString().padStart(4, '0')}`;

        // Create or update User
        // Default password for new members: "welcome123"
        const hashedPassword = await bcrypt.hash(this.defaultPassword, 10);

        // Upsert User: Create if doesn't exist, Update if they do
        const user = await this.prisma.user.upsert({
            where: { email: application.email },
            update: {
                role: Role.MEMBER,
                membershipTier: application.membershipTier,
                memberId: memberId,
            },
            create: {
                email: application.email,
                password: hashedPassword,
                name: `${application.firstName} ${application.lastName}`,
                role: Role.MEMBER,
                membershipTier: application.membershipTier,
                memberId: memberId,
            }
        });

        await this.prisma.membershipApplication.update({
            where: { id: applicationId },
            data: { status: ApplicationStatus.APPROVED, userId: user.id }
        });

        return { success: true, memberId };
    }

    async rejectApplication(applicationId: number) {
        return this.prisma.membershipApplication.update({
            where: { id: applicationId },
            data: { status: ApplicationStatus.REJECTED }
        });
    }

    async createChef(data: { name: string; email: string; password?: string; specialty?: string; phone_number?: string; bio?: string }) {
        const password = data.password || 'ChangeMe123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: Role.CHEF,
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

    async updateChefProfile(userId: number, data: any) {
        console.log(`Updating chef ${userId} with data:`, data);

        // Update User fields
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
            }
        });

        // Upsert Chef Profile
        const chefProfileData: any = {
            bio: data.bio,
            categories: data.categories || [], // Expecting array of strings
        };

        if (data.image) {
            chefProfileData.image = data.image; // Only update image if new one provided
        }

        return this.prisma.chefProfile.upsert({
            where: { userId },
            create: {
                userId,
                specialty: data.specialty || 'General', // Fallback
                phoneNumber: data.phoneNumber || 'N/A',
                ...chefProfileData
            },
            update: chefProfileData
        });
    }

    async createMember(data: any) {
        // Default password if not provided (fallback)
        const password = data.passphrase || data.password || this.defaultPassword;
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                memberId: data.memberId, // Explicit Member ID
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: Role.MEMBER,
                membershipTier: MembershipTier.CULIXUR, // Default tier
            }
        });
    }

    async updateUser(id: number, data: any) {
        const updateData: any = {
            name: data.name,
            email: data.email,
            membershipTier: data.membershipTier,
        };

        // Only hash and update password if provided
        if (data.passphrase && data.passphrase.trim() !== '') {
            updateData.password = await bcrypt.hash(data.passphrase, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    async deleteUser(id: number) {
        // Prevent deleting the last admin if necessary, or self-deletion checks
        // For now, simpler implementation:
        return this.prisma.user.delete({
            where: { id }
        });
    }

    async syncUsers() {
        const users = await this.prisma.user.findMany();
        let updatedCount = 0;

        for (const user of users) {
            let needsUpdate = false;
            const updateData: any = {};

            if (!user.membershipTier) {
                updateData.membershipTier = MembershipTier.CULIXUR;
                needsUpdate = true;
            }

            if (user.role === Role.MEMBER && !user.memberId) {
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

    async createMenu(data: any) {
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
        } catch (error) {
            console.error('❌ Menu creation failed:', error);
            throw new Error(`Failed to create menu: ${error.message}`);
        }
    }

    async updateMenu(id: number, data: any) {
        try {
            console.log(`📝 Updating menu ${id} with data:`, data);

            const updateData: any = {
                name: data.name,
                description: data.description,
                fixedPrice: data.price,
                serviceType: data.serviceType || 'ATELIER'
            };

            // Only update image if provided
            if (data.img) {
                updateData.image = data.img;
            }

            const menu = await this.prisma.menu.update({
                where: { id },
                data: updateData
            });

            console.log('✅ Menu updated successfully:', menu.id);
            return menu;
        } catch (error) {
            console.error('❌ Menu update failed:', error);
            throw new Error(`Failed to update menu: ${error.message}`);
        }
    }

    async deleteMenu(id: number) {
        try {
            console.log(`🗑️  Deleting menu ${id}`);
            await this.prisma.menu.delete({
                where: { id }
            });
            console.log('✅ Menu deleted successfully');
            return { success: true, message: 'Menu deleted successfully' };
        } catch (error) {
            console.error('❌ Menu deletion failed:', error);
            throw new Error(`Failed to delete menu: ${error.message}`);
        }
    }

    async getAllApplications() {
        return this.prisma.membershipApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async reassignChef(orderId: number, newChefId: number) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { chefId: newChefId },
            include: { chef: true, member: true }
        });

        // Notify the new chef
        if (order.chefId) {
            await this.notificationService.notifyChefs([order.chefId], order);
        }

        return order;
    }
}
