import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceType, MembershipTier, ApplicationStatus } from '@prisma/client';

@Injectable()
export class MemberService {
    constructor(private prisma: PrismaService) { }

    async getDashboard(userId: number) {
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
            where: { role: 'CHEF' }, // Assuming 'isApproved' logic will be added to User model or handled appropriately
            include: { chefProfile: true },
        });

        return {
            menus,
            chefs: chefs.map((chef: any) => ({
                id: chef.id,
                name: chef.name,
                specialty: chef.chefProfile?.specialty ?? 'Master Chef',
                avatar: chef.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}&background=654321&color=fff`,
            })),
        };
    }

    async createBooking(userId: number, data: any) {
        const menu = await this.prisma.menu.findUnique({ where: { id: data.menu_id } });
        if (!menu) throw new Error('Menu not found');


        // Check Order Limit (Elite: Max 15)
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
                serviceType: data.service_type as ServiceType,
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

        // Generate Order ID
        const orderId = 'ORD-' + order.id.toString().padStart(4, '0');
        await this.prisma.order.update({
            where: { id: order.id },
            data: { orderId },
        });

        // Trigger Notifications (TODO: Implement NotificationService)

        return {
            success: true,
            message: 'Booking created successfully',
            order_id: order.id,
            order_number: orderId,
        };
    }

    async referElite(userId: number, data: { full_name: string, email: string, phone: string, occupation?: string }) {
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

    async apply(data: any) {
        return this.prisma.membershipApplication.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                location: data.location,
                membershipTier: data.membershipTier as MembershipTier,
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
                status: ApplicationStatus.PENDING
            }
        });
    }
}
