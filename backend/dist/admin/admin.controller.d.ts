import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        recentOrders: ({
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
            chef: {
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
            } | null;
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
        pending_applications: {
            id: number;
            email: string;
            membershipTier: import(".prisma/client").$Enums.MembershipTier;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            location: string | null;
            firstName: string;
            lastName: string;
            phone: string;
            eliteQualifiers: string | null;
            company: string | null;
            referralCode: string | null;
            message: string | null;
            userId: number | null;
        }[];
        stats: {
            live_orders: number;
            active_chefs: number;
            review_queue: number;
            aov: number | import("@prisma/client/runtime/library").Decimal;
        };
    }>;
    getMenus(): Promise<{
        id: number;
        name: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        description: string;
        fixedPrice: import("@prisma/client/runtime/library").Decimal;
        details: string | null;
    }[]>;
    approveApplication(id: string): Promise<{
        success: boolean;
        memberId: string;
    }>;
    rejectApplication(id: string): Promise<{
        id: number;
        email: string;
        membershipTier: import(".prisma/client").$Enums.MembershipTier;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        location: string | null;
        firstName: string;
        lastName: string;
        phone: string;
        eliteQualifiers: string | null;
        company: string | null;
        referralCode: string | null;
        message: string | null;
        userId: number | null;
    }>;
    createChef(body: {
        name: string;
        email: string;
        password?: string;
    }): Promise<{
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
    }>;
}
