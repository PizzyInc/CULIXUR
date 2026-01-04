import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { ChefModule } from '../../chef/api/chef.module';
import { AdminModule } from '../../admin/api/admin.module';
import { ApplyModule } from './apply/apply.module';

@Module({
  imports: [
    // Rate Limiting: 10 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window in milliseconds
      limit: 10, // Max requests per window
    }]),
    PrismaModule,
    AuthModule,
    MemberModule,
    ChefModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
