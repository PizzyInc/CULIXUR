import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private backendUrl;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(identity: string, pass: string): Promise<any>;
    login(user: any): Promise<{
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
    register(data: any): Promise<{
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
    getUserById(id: number): Promise<{
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
