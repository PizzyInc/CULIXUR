import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { NotificationService } from '../../backend/src/notification/notification.service';
import { OrderStatus, ApplicationStatus, Role, MembershipTier } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

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

    async approveApplication(applicationId: number) {
        const application = await this.prisma.membershipApplication.findUnique({
            where: { id: applicationId }
        });

        if (!application) throw new Error('Application not found');

        // Static Member ID (e.g. CX-0001)
        const memberId = `CX-${application.id.toString().padStart(4, '0')}`;

        // Create or update User
        const user = await this.prisma.user.update({
            where: { email: application.email },
            data: {
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
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password || 'ChangeMe123!',
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
}
