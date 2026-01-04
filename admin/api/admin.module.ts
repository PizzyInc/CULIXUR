import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../backend/src/prisma/prisma.service';
import { NotificationService } from '../../backend/src/notification/notification.service';

@Module({
    imports: [NotificationModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
