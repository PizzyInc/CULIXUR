"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplyService = class ApplyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createApplication(data) {
        return this.prisma.membershipApplication.create({
            data: {
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                phone: data.phone,
                location: data.location,
                company: data.company,
                membershipTier: data.membership_tier,
                referralCode: data.referral_code,
                message: data.message,
                eliteQualifiers: JSON.stringify({
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
};
exports.ApplyService = ApplyService;
exports.ApplyService = ApplyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplyService);
//# sourceMappingURL=apply.service.js.map