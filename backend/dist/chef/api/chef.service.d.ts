import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationService } from '../../backend/src/notification/notification.service';
export declare class ChefService {
    private prisma;
    private notificationService;
    private configService;
    private backendUrl;
    constructor(prisma: PrismaService, notificationService: NotificationService, configService: ConfigService);
    getDashboard(userId: number): Promise<{
        pending: ({
            member: {
                id: number;
                memberId: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                emailVerifiedAt: Date | null;
                password: string;
                image: string | null;
                role: import("@prisma/client").$Enums.Role;
                membershipTier: import("@prisma/client").$Enums.MembershipTier;
                stripeCustomerId: string | null;
            };
        } & {
            id: number;
            orderId: string | null;
            serviceType: import("@prisma/client").$Enums.ServiceType;
            menu: string;
            price: import("node_modules/@prisma/client/runtime/library").Decimal;
            datetime: Date;
            address: string;
            guestCount: number;
            allergies: string | null;
            paymentIntentId: string | null;
            paymentStatus: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            memberId: number;
            chefId: number | null;
            selectedChefs: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        active: ({
            member: {
                id: number;
                memberId: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                emailVerifiedAt: Date | null;
                password: string;
                image: string | null;
                role: import("@prisma/client").$Enums.Role;
                membershipTier: import("@prisma/client").$Enums.MembershipTier;
                stripeCustomerId: string | null;
            };
        } & {
            id: number;
            orderId: string | null;
            serviceType: import("@prisma/client").$Enums.ServiceType;
            menu: string;
            price: import("node_modules/@prisma/client/runtime/library").Decimal;
            datetime: Date;
            address: string;
            guestCount: number;
            allergies: string | null;
            paymentIntentId: string | null;
            paymentStatus: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            memberId: number;
            chefId: number | null;
            selectedChefs: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        completed: ({
            member: {
                id: number;
                memberId: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                emailVerifiedAt: Date | null;
                password: string;
                image: string | null;
                role: import("@prisma/client").$Enums.Role;
                membershipTier: import("@prisma/client").$Enums.MembershipTier;
                stripeCustomerId: string | null;
            };
        } & {
            id: number;
            orderId: string | null;
            serviceType: import("@prisma/client").$Enums.ServiceType;
            menu: string;
            price: import("node_modules/@prisma/client/runtime/library").Decimal;
            datetime: Date;
            address: string;
            guestCount: number;
            allergies: string | null;
            paymentIntentId: string | null;
            paymentStatus: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            memberId: number;
            chefId: number | null;
            selectedChefs: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        chefProfile: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            userId: number;
            specialty: string;
            phoneNumber: string;
            bio: string | null;
            categories: string[];
            experienceYears: number | null;
            isComplete: boolean;
            isAvailable: boolean;
            unavailableDates: Date[];
        };
        menus: {
            image: string;
            id: number;
            serviceType: import("@prisma/client").$Enums.ServiceType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            fixedPrice: import("node_modules/@prisma/client/runtime/library").Decimal;
            details: string | null;
        }[];
    }>;
    updateMenu(id: number, data: any): Promise<{
        id: number;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        description: string;
        fixedPrice: import("node_modules/@prisma/client/runtime/library").Decimal;
        details: string | null;
    }>;
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<{
        member: {
            id: number;
            memberId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            emailVerifiedAt: Date | null;
            password: string;
            image: string | null;
            role: import("@prisma/client").$Enums.Role;
            membershipTier: import("@prisma/client").$Enums.MembershipTier;
            stripeCustomerId: string | null;
        };
    } & {
        id: number;
        orderId: string | null;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        menu: string;
        price: import("node_modules/@prisma/client/runtime/library").Decimal;
        datetime: Date;
        address: string;
        guestCount: number;
        allergies: string | null;
        paymentIntentId: string | null;
        paymentStatus: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        memberId: number;
        chefId: number | null;
        selectedChefs: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAvailability(userId: number, data: {
        isAvailable: boolean;
        unavailableDates: string[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    setupProfile(userId: number, data: {
        bio: string;
        specialty?: string;
        categories: string[];
        image?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        userId: number;
        specialty: string;
        phoneNumber: string;
        bio: string | null;
        categories: string[];
        experienceYears: number | null;
        isComplete: boolean;
        isAvailable: boolean;
        unavailableDates: Date[];
    }>;
    verifyMember(memberId: string): Promise<{
        status: string;
        message: string;
        member?: undefined;
        active_order?: undefined;
    } | {
        status: string;
        member: {
            name: string;
            member_id: string;
            membership_tier: import("@prisma/client").$Enums.MembershipTier;
            image: string;
        };
        active_order: {
            id: number;
            menu: string;
            guests: number;
            datetime: Date;
            address: string;
        };
        message?: undefined;
    }>;
}
