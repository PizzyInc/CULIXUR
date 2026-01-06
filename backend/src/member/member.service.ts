import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { ServiceType, MembershipTier, ApplicationStatus } from '@prisma/client';

@Injectable()
export class MemberService {
    private backendUrl: string;

    constructor(
        private prisma: PrismaService,
        private paymentService: PaymentService,
        private configService: ConfigService,
    ) {
        this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://127.0.0.1:3001';
    }

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
                image: true,
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

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyOrderCount = await this.prisma.order.count({
            where: {
                memberId: userId,
                createdAt: { gte: startOfMonth },
            }
        });

        if (user && user.image) {
            user.image = user.image.startsWith('http') ? user.image : `${this.backendUrl}${user.image}`;
        }

        return { user, orders, upcomingEvents, monthlyOrderCount };
    }

    async getBookingDetails() {
        try {
            const menus = await this.prisma.menu.findMany({
                orderBy: { createdAt: 'desc' }
            });

            // Ensure menu images are absolute or properly formatted
            const formattedMenus = menus.map((menu: any) => ({
                ...menu,
                image: menu.image ? (menu.image.startsWith('http') ? menu.image : `${this.backendUrl}${menu.image}`) : null
            }));

            const chefs = await this.prisma.user.findMany({
                where: {
                    role: 'CHEF',
                    chefProfile: {
                        isAvailable: true  // Only show available chefs
                    }
                },
                include: { chefProfile: true },
            });

            const formattedChefs = chefs.map((chef: any) => {
                const chefImage = chef.image || chef.chefProfile?.image;
                return {
                    id: chef.id,
                    name: chef.name,
                    specialty: chef.chefProfile?.specialty ?? 'Master Chef',
                    bio: chef.chefProfile?.bio ?? '',
                    categories: chef.chefProfile?.categories ?? [],
                    experienceYears: chef.chefProfile?.experienceYears ?? 0,
                    // Ensure absolute URL for chef avatar
                    avatar: chefImage
                        ? (chefImage.startsWith('http') ? chefImage : `${this.backendUrl}${chefImage}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.name)}&background=654321&color=fff`,
                };
            });

            return {
                menus: formattedMenus,
                chefs: formattedChefs,
            };
        } catch (error) {
            console.error("Error fetching booking details:", error);
            // Return empty structure instead of throwing to allow partial UI rendering if possible, 
            // or let the controller handle strings.
            // But rethrowing with a clear message is better for the frontend.
            throw new Error('Failed to load experience details. Please try again.');
        }
    }

    async createBooking(userId: number, data: any) {
        const menu = await this.prisma.menu.findUnique({ where: { id: data.menu_id } });
        if (!menu) throw new Error('Menu not found');


        // Check Order Limit
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const orderCount = await this.prisma.order.count({
            where: {
                memberId: userId,
                createdAt: { gte: startOfMonth },
            },
        });

        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        // Elite members have a 15-order limit per month.
        // Standard members (CULIXUR) pay per order.
        let isPaymentRequired = false;

        if (user?.membershipTier === 'ELITE') {
            if (orderCount >= 15) {
                throw new Error('Monthly Elite order limit reached (15 orders). Please contact support for additional orchestration.');
            }
        } else {
            // Standard members must pay
            isPaymentRequired = true;
        }

        if (isPaymentRequired) {
            if (!data.payment_intent_id) {
                throw new Error('Payment is required to confirm this orchestration.');
            }
            const isVerified = await this.paymentService.verifyPaymentIntent(data.payment_intent_id);
            if (!isVerified) {
                throw new Error('Secure payment verification failed. Please try again.');
            }
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
                paymentIntentId: data.payment_intent_id,
                paymentStatus: data.payment_intent_id ? 'PAID' : 'PENDING'
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
        const referrer = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!referrer || referrer.membershipTier !== 'ELITE') {
            throw new Error('Only Elite members can refer new Elite candidates.');
        }

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

    async updateProfile(userId: number, data: { image?: string | null }) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.image ? { image: data.image } : {})
            }
        });
    }
}
