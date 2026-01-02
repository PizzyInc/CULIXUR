import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ChefService } from './chef.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/chef')
export class ChefController {
    constructor(private readonly chefService: ChefService) { }

    @Get('dashboard')
    getDashboard(@Request() req: any) {
        return this.chefService.getDashboard(req.user.userId);
    }

    @Post('orders/:id/update-status')
    updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
        return this.chefService.updateOrderStatus(parseInt(id), body.status);
    }

    @Post('availability')
    updateAvailability(@Request() req: any, @Body() body: { slots: { date: string; startTime: string; endTime: string }[] }) {
        return this.chefService.updateAvailability(req.user.userId, body.slots);
    }

    @Get('verify-member/:id')
    verifyMember(@Param('id') id: string) {
        return this.chefService.verifyMember(id);
    }
}
