import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            member_id: any;
            avatar: any;
        };
    }>;
    register(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            member_id: any;
            avatar: any;
        };
    }>;
    getProfile(req: any): Promise<{
        chefProfile: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
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
    } & {
        name: string | null;
        email: string;
        emailVerifiedAt: Date | null;
        password: string;
        image: string | null;
        role: import(".prisma/client").$Enums.Role;
        memberId: string | null;
        membershipTier: import(".prisma/client").$Enums.MembershipTier;
        createdAt: Date;
        updatedAt: Date;
        stripeCustomerId: string | null;
        id: number;
    }>;
}
