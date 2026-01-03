import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class AdminService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
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
    getUsers(): Promise<({
        chefProfile: {
            id: number;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            specialty: string;
            phoneNumber: string;
            bio: string | null;
            experienceYears: number | null;
        } | null;
    } & {
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
    })[]>;
    approveApplication(applicationId: number): Promise<{
        success: boolean;
        memberId: string;
    }>;
    rejectApplication(applicationId: number): Promise<{
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
    createChef(data: {
        name: string;
        email: string;
        password?: string;
        specialty?: string;
        phone_number?: string;
        bio?: string;
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
