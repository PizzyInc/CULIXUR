import { Controller, Get, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('member')
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

    @UseGuards(AuthGuard('jwt'))
    @Post('update-profile')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async updateProfile(@Request() req: { user: { userId: number } }, @UploadedFile() file: Express.Multer.File) {
        const imagePath = file ? `/uploads/${file.filename}` : null;
        return this.memberService.updateProfile(req.user.userId, { image: imagePath });
    }
}
