import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipTier } from '@prisma/client';

@Injectable()
export class ApplyService {
    constructor(private prisma: PrismaService) { }

    async createApplication(data: any) {
        return this.prisma.membershipApplication.create({
            data: {
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                phone: data.phone,
                location: data.location, // New field
                company: data.company,
                membershipTier: data.membership_tier as MembershipTier, // Default to ELITE or relevant tier
                referralCode: data.referral_code,
                message: data.message,
                eliteQualifiers: JSON.stringify({ // Store complex elite data as JSON
                    industry: data.industry,
                    position: data.position_title,
                    net_worth: data.net_worth_range,
                    why_elite: data.why_elite,
                    achievements: data.achievements,
                    elite_category: data.elite_category
                }),
            },
        });
    }

    async getApplications() {
        return this.prisma.membershipApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}
