import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { OrderStatus, AvailabilityStatus } from '@prisma/client';
import { NotificationService } from '../../backend/src/notification/notification.service';

@Injectable()
export class ChefService {
    private backendUrl: string;

    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private configService: ConfigService,
    ) {
        this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://127.0.0.1:3001';
    }

    async getDashboard(userId: number) {
        // 1. Get Orders assigned to this chef
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

        // 2. Get Profile
        const chef = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { chefProfile: true }
        });

        // 3. Get All Menus
        const menus = await this.prisma.menu.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Format menu images
        const formattedMenus = menus.map(m => ({
            ...m,
            image: m.image ? (m.image.startsWith('http') ? m.image : `${this.backendUrl}${m.image}`) : null
        }));

        // Format chef profile image
        if (chef?.chefProfile) {
            chef.chefProfile.image = chef.chefProfile.image ? (chef.chefProfile.image.startsWith('http') ? chef.chefProfile.image : `${this.backendUrl}${chef.chefProfile.image}`) : null;
        }

        // Separate orders by status for the frontend
        return {
            pending: orders.filter(o => o.status === 'PENDING'),
            active: orders.filter(o => o.status === 'ASSIGNED' || o.status === 'ACCEPTED' || o.status === 'EN_ROUTE'),
            completed: orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED'),
            chefProfile: chef?.chefProfile || null,
            menus: formattedMenus
        };
    }

    async updateMenu(id: number, data: any) {
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

    async updateOrderStatus(orderId: number, status: OrderStatus) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { member: true }
        });

        if (order) {
            // Notify Admins
            await this.notificationService.notifyAdmins(order);
            // Notify Member
            await this.notificationService.notifyMember(order);
        }

        return order;
    }

    async updateAvailability(userId: number, data: { isAvailable: boolean; unavailableDates: string[] }) {
        return this.prisma.chefProfile.updateMany({
            where: { userId },
            data: {
                isAvailable: data.isAvailable,
                unavailableDates: data.unavailableDates.map(d => new Date(d))
            }
        });
    }

    async setupProfile(userId: number, data: { bio: string; specialty?: string; categories: string[]; image?: string }) {
        return this.prisma.chefProfile.upsert({
            where: { userId },
            create: {
                userId,
                bio: data.bio,
                categories: data.categories,
                image: data.image,
                isComplete: true,
                specialty: data.specialty || data.categories[0] || 'Executive Chef',  // Use provided specialty or first category
                phoneNumber: 'N/A'
            },
            update: {
                bio: data.bio,
                categories: data.categories,
                specialty: data.specialty || data.categories[0],  // Update specialty if provided
                ...(data.image ? { image: data.image } : {}),
                isComplete: true
            }
        });
    }

    async verifyMember(memberId: string) {
        const user = await this.prisma.user.findUnique({
            where: { memberId },
            include: {
                ordersAsMember: {
                    where: {
                        status: {
                            notIn: ['COMPLETED', 'CANCELLED'] as OrderStatus[]
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
}
