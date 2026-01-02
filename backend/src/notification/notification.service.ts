import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async notifyMember(order: any) {
        // 1. Create DB Notification
        await this.prisma.notification.create({
            data: {
                type: 'ORDER_CONFIRMATION',
                notifiableType: 'User',
                notifiableId: order.memberId,
                data: JSON.stringify({
                    order_id: order.id,
                    order_number: order.orderId,
                    message: `Your booking for ${order.menu} has been confirmed.`,
                }),
            },
        });
        // 2. Send Email (TODO: Implement Nodemailer)
        console.log(`[Email] Sending confirmation to member ${order.memberId}`);
    }

    async notifyChefs(chefIds: number[], order: any) {
        for (const chefId of chefIds) {
            await this.prisma.notification.create({
                data: {
                    type: 'NEW_ASSIGNMENT',
                    notifiableType: 'User',
                    notifiableId: chefId,
                    data: JSON.stringify({
                        order_id: order.id,
                        order_number: order.orderId,
                        message: `New assignment available: ${order.menu}`,
                    }),
                },
            });
        }
    }

    async notifyAdmins(order: any) {
        const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' } });
        for (const admin of admins) {
            await this.prisma.notification.create({
                data: {
                    type: 'NEW_ORDER_ADMIN',
                    notifiableType: 'User',
                    notifiableId: admin.id,
                    data: JSON.stringify({
                        order_id: order.id,
                        order_number: order.orderId,
                        message: `New order #${order.orderId} created.`,
                    }),
                },
            });
        }
    }
}
