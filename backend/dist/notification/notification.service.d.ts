import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    notifyMember(order: any): Promise<void>;
    notifyChefs(chefIds: number[], order: any): Promise<void>;
    notifyAdmins(order: any): Promise<void>;
}
