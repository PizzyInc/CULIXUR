import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { OrderStatus, AvailabilityStatus } from '@prisma/client';
import { NotificationService } from '../../backend/src/notification/notification.service';

@Injectable()
export class ChefService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    async getDashboard(userId: number) {
        // 1. Get Orders assigned to this chef
        const orders = await this.prisma.order.findMany({
            where: { OR: [{ chefId: userId }, { status: 'PENDING' }] }, // Simplified logic: see assigned + pending
            include: { member: true },
            orderBy: { datetime: 'asc' },
        });

        // 2. Get Availability
        const availability = await this.prisma.chefAvailability.findMany({
            where: { chefId: userId, date: { gte: new Date() } },
            orderBy: { date: 'asc' },
        });

        return { orders, availability };
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

    async updateAvailability(userId: number, slots: { date: string; startTime: string; endTime: string }[]) {
        // Clear future availability and set new ones from the list
        await this.prisma.chefAvailability.deleteMany({
            where: { chefId: userId, date: { gte: new Date() } }
        });

        return this.prisma.chefAvailability.createMany({
            data: slots.map(slot => ({
                chefId: userId,
                date: new Date(slot.date),
                startTime: new Date(`${slot.date}T${slot.startTime}:00Z`), // Assuming HH:mm format
                endTime: new Date(`${slot.date}T${slot.endTime}:00Z`),
                status: AvailabilityStatus.AVAILABLE
            }))
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
}
