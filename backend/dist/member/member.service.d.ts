import { PrismaService } from '../prisma/prisma.service';
export declare class MemberService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(userId: number): Promise<{
        user: {
            id: number;
            email: string;
            memberId: string | null;
            name: string | null;
            role: import(".prisma/client").$Enums.Role;
            membershipTier: import(".prisma/client").$Enums.MembershipTier;
        } | null;
        orders: ({
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
    }>;
    getBookingDetails(): Promise<{
        menus: {
            id: number;
            name: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            fixedPrice: import("@prisma/client/runtime/library").Decimal;
            details: string | null;
        }[];
        chefs: {
            id: any;
            name: any;
            specialty: any;
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
        firstName: string;
        lastName: string;
        phone: string;
        eliteQualifiers: string | null;
        company: string | null;
        referralCode: string | null;
        message: string | null;
        userId: number | null;
    }>;
}
