import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PaymentModule } from '../payment/payment.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PaymentModule, PrismaModule],
    controllers: [MemberController],
    providers: [MemberService],
})
export class MemberModule { }
