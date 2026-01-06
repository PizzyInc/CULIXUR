import { Controller, Get, Post, Body, UseGuards, Request, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChefService } from './chef.service';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../backend/src/auth/roles.decorator';
import { RolesGuard } from '../../backend/src/auth/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CHEF)
@Controller('chef')
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
    updateAvailability(@Request() req: any, @Body() body: { isAvailable: boolean; unavailableDates: string[] }) {
        return this.chefService.updateAvailability(req.user.userId, body);
    }

    @Get('verify-member/:id')
    verifyMember(@Param('id') id: string) {
        return this.chefService.verifyMember(id);
    }

    @Post('setup')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    setupProfile(@Request() req: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        console.log('Setup Profile Request:', { userId: req.user.userId, body });
        const imagePath = file ? `/uploads/${file.filename}` : undefined;
        return this.chefService.setupProfile(req.user.userId, {
            bio: body.bio,
            categories: JSON.parse(body.categories || '[]'),
            image: imagePath
        });
    }

    @Post('menus/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    updateMenu(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
        const imagePath = file ? `/uploads/${file.filename}` : undefined;
        return this.chefService.updateMenu(Number(id), {
            ...body,
            image: imagePath
        });
    }
}
