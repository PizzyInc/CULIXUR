import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
export declare class ChefService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    getDashboard(userId: number): Promise<{
        orders: ({
            member: {
                id: number;
                email: string;
                memberId: string | null;
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
            menu: string;
            id: number;
            memberId: number;
            createdAt: Date;
            updatedAt: Date;
            orderId: string | null;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            price: import("@prisma/client/runtime/library").Decimal;
            datetime: Date;
            address: string;
            guestCount: number;
            allergies: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            chefId: number | null;
            selectedChefs: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        availability: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AvailabilityStatus;
            chefId: number;
            date: Date;
            startTime: Date;
            endTime: Date;
        }[];
    }>;
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<{
        member: {
            id: number;
            email: string;
            memberId: string | null;
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
        menu: string;
        id: number;
        memberId: number;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        price: import("@prisma/client/runtime/library").Decimal;
        datetime: Date;
        address: string;
        guestCount: number;
        allergies: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        chefId: number | null;
        selectedChefs: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateAvailability(userId: number, slots: {
        date: string;
        startTime: string;
        endTime: string;
    }[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    verifyMember(memberId: string): Promise<{
        status: string;
        message: string;
        member?: undefined;
        active_order?: undefined;
    } | {
        status: string;
        member: {
            name: string | null;
            member_id: string | null;
            membership_tier: import(".prisma/client").$Enums.MembershipTier;
        };
        active_order: {
            id: number;
            menu: string;
            guests: number;
        } | null;
        message?: undefined;
    }>;
}
