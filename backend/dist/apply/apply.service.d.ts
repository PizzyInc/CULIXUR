import { PrismaService } from '../prisma/prisma.service';
export declare class ApplyService {
    private prisma;
    constructor(prisma: PrismaService);
    createApplication(data: any): Promise<{
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
    getApplications(): Promise<{
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
    }[]>;
}
