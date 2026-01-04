import { Module } from '@nestjs/common';
import { ChefController } from './chef.controller';
import { ChefService } from './chef.service';
import { NotificationModule } from '../../backend/src/notification/notification.module';

@Module({
    imports: [NotificationModule],
    controllers: [ChefController],
    providers: [ChefService],
})
export class ChefModule { }
