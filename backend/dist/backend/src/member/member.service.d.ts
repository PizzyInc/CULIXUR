import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
export declare class MemberService {
    private prisma;
    private paymentService;
    private configService;
    private backendUrl;
    constructor(prisma: PrismaService, paymentService: PaymentService, configService: ConfigService);
    getDashboard(userId: number): Promise<{
        user: {
            id: number;
            email: string;
            memberId: string;
            name: string;
            image: string;
            role: import(".prisma/client").$Enums.Role;
            membershipTier: import(".prisma/client").$Enums.MembershipTier;
        };
        orders: ({
            chef: {
                id: number;
                email: string;
                memberId: string | null;
                stripeCustomerId: string | null;
                name: string | null;
                emailVerifiedAt: Date | null;
                password: string;
                image: string | null;
                role: import(".prisma/client").$Enums.Role;
                membershipTier: import(".prisma/client").$Enums.MembershipTier;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            memberId: number;
            createdAt: Date;
            updatedAt: Date;
            orderId: string | null;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            menu: string;
            price: import("@prisma/client/runtime/library").Decimal;
            datetime: Date;
            address: string;
            guestCount: number;
            allergies: string | null;
            paymentIntentId: string | null;
            paymentStatus: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            chefId: number | null;
            selectedChefs: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        upcomingEvents: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eventAt: Date;
            location: string | null;
            imagePath: string | null;
            active: boolean;
        }[];
        monthlyOrderCount: number;
    }>;
    getBookingDetails(): Promise<{
        menus: any[];
        chefs: {
            id: any;
            name: any;
            specialty: any;
            bio: any;
            categories: any;
            experienceYears: any;
            avatar: any;
        }[];
    }>;
    createBooking(userId: number, data: any): Promise<{
        success: boolean;
        message: string;
        order_id: number;
        order_number: string;
    }>;
    referElite(userId: number, data: {
        full_name: string;
        email: string;
        phone: string;
        occupation?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ReferralStatus;
        referredName: string;
        referredEmail: string;
        referredPhone: string;
        referredOccupation: string;
        isElite: boolean;
        notes: string | null;
        referrerId: number;
    }>;
    apply(data: any): Promise<{
        id: number;
        email: string;
        membershipTier: import(".prisma/client").$Enums.MembershipTier;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        location: string | null;
        userId: number | null;
        firstName: string;
        lastName: string;
        phone: string;
        eliteQualifiers: string | null;
        company: string | null;
        referralCode: string | null;
        message: string | null;
    }>;
    updateProfile(userId: number, data: {
        image?: string | null;
    }): Promise<{
        id: number;
        email: string;
        memberId: string | null;
        stripeCustomerId: string | null;
        name: string | null;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import(".prisma/client").$Enums.Role;
        membershipTier: import(".prisma/client").$Enums.MembershipTier;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
