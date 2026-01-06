import { ChefService } from './chef.service';
export declare class ChefController {
    private readonly chefService;
    constructor(chefService: ChefService);
    getDashboard(req: any): Promise<{
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
    updateStatus(id: string, body: {
        status: any;
    }): Promise<{
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
    updateAvailability(req: any, body: {
        isAvailable: boolean;
        unavailableDates: string[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    verifyMember(id: string): Promise<{
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
    setupProfile(req: any, body: any, file: Express.Multer.File): Promise<{
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
    updateMenu(id: string, file: Express.Multer.File, body: any): Promise<{
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
}
