import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        recentOrders: any[];
        pending_applications: {
            id: number;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            location: string | null;
            eliteQualifiers: string | null;
            company: string | null;
            membershipTier: import("@prisma/client").$Enums.MembershipTier;
            referralCode: string | null;
            message: string | null;
            userId: number | null;
        }[];
        stats: {
            live_orders: number;
            active_chefs: number;
            review_queue: number;
            aov: number | import("node_modules/@prisma/client/runtime/library").Decimal;
        };
    }>;
    getMenus(): Promise<{
        image: string;
        id: number;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        fixedPrice: import("node_modules/@prisma/client/runtime/library").Decimal;
        details: string | null;
    }[]>;
    getUsers(): Promise<any[]>;
    getBookings(): Promise<any[]>;
    approveApplication(id: string): Promise<{
        success: boolean;
        memberId: string;
    }>;
    rejectApplication(id: string): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        location: string | null;
        eliteQualifiers: string | null;
        company: string | null;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
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
        memberId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import("@prisma/client").$Enums.Role;
        stripeCustomerId: string | null;
    }>;
    updateChef(id: string, file: any, body: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        image: string | null;
        specialty: string;
        phoneNumber: string;
        bio: string | null;
        categories: string[];
        experienceYears: number | null;
        isComplete: boolean;
        isAvailable: boolean;
        unavailableDates: Date[];
    }>;
    createMenu(file: any, body: any): Promise<{
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
    updateMenu(id: string, file: any, body: any): Promise<{
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
    deleteMenu(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllApplications(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        location: string | null;
        eliteQualifiers: string | null;
        company: string | null;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
        referralCode: string | null;
        message: string | null;
        userId: number | null;
    }[]>;
    createMember(body: any): Promise<{
        id: number;
        memberId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import("@prisma/client").$Enums.Role;
        stripeCustomerId: string | null;
    }>;
    updateUser(id: string, body: any): Promise<{
        id: number;
        memberId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import("@prisma/client").$Enums.Role;
        stripeCustomerId: string | null;
    }>;
    deleteUser(id: string): Promise<{
        id: number;
        memberId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        membershipTier: import("@prisma/client").$Enums.MembershipTier;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import("@prisma/client").$Enums.Role;
        stripeCustomerId: string | null;
    }>;
    syncUsers(): Promise<{
        message: string;
        total: number;
    }>;
    reassignChef(id: string, body: {
        chefId: number;
    }): Promise<{
        chef: {
            id: number;
            memberId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            membershipTier: import("@prisma/client").$Enums.MembershipTier;
            emailVerifiedAt: Date | null;
            password: string;
            image: string | null;
            role: import("@prisma/client").$Enums.Role;
            stripeCustomerId: string | null;
        };
        member: {
            id: number;
            memberId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            email: string;
            membershipTier: import("@prisma/client").$Enums.MembershipTier;
            emailVerifiedAt: Date | null;
            password: string;
            image: string | null;
            role: import("@prisma/client").$Enums.Role;
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
}
