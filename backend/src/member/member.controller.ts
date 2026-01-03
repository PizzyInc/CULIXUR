import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/member')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('dashboard')
    async getDashboard(@Request() req: { user: { userId: number } }) {
        return this.memberService.getDashboard(req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('booking-details')
    async getBookingDetails() {
        return this.memberService.getBookingDetails();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('book')
    async book(@Request() req: { user: { userId: number } }, @Body() body: any) {
        return this.memberService.createBooking(req.user.userId, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('refer-elite')
    async referElite(@Request() req: { user: { userId: number } }, @Body() body: { full_name: string, email: string, phone: string, occupation?: string }) {
        return this.memberService.referElite(req.user.userId, body);
    }

    @Post('apply')
    async apply(@Body() body: any) {
        return this.memberService.apply(body);
    }
}
