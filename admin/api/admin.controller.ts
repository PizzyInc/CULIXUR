import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
// Note: In a real app, we'd have a specific RolesGuard here to ensure only ADMINs can access.
// For migration speed, we assume the frontend hides these routes or we add a simple check.

import { Roles } from '../../backend/src/auth/roles.decorator';
import { RolesGuard } from '../../backend/src/auth/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    getDashboard() {
        return this.adminService.getDashboard();
    }

    @Get('menus')
    getMenus() {
        return this.adminService.getMenus();
    }

    @Get('users')
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get('bookings')
    getBookings() {
        return this.adminService.getBookings();
    }

    @Post('applications/:id/approve')
    approveApplication(@Param('id') id: string) {
        return this.adminService.approveApplication(Number(id));
    }

    @Post('applications/:id/reject')
    rejectApplication(@Param('id') id: string) {
        return this.adminService.rejectApplication(Number(id));
    }

    @Post('chefs')
    createChef(@Body() body: { name: string; email: string; password?: string }) {
        return this.adminService.createChef(body);
    }

    @Post('chefs/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    updateChef(@Param('id') id: string, @UploadedFile() file: any, @Body() body: any) {
        const fullBody = {
            ...body,
            categories: JSON.parse(body.categories || '[]'),
            img: file ? `/uploads/${file.filename}` : undefined
        };
        // Normalize 'img' to 'image' for service
        if (fullBody.img) fullBody.image = fullBody.img;

        return this.adminService.updateChefProfile(Number(id), fullBody);
    }

    @Post('menus')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    createMenu(@UploadedFile() file: any, @Body() body: any) {
        const fullBody = { ...body, img: file ? `/uploads/${file.filename}` : body.img };
        return this.adminService.createMenu(fullBody);
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
    updateMenu(@Param('id') id: string, @UploadedFile() file: any, @Body() body: any) {
        const fullBody = { ...body, img: file ? `/uploads/${file.filename}` : body.img };
        return this.adminService.updateMenu(Number(id), fullBody);
    }

    @Delete('menus/:id')
    deleteMenu(@Param('id') id: string) {
        return this.adminService.deleteMenu(Number(id));
    }

    @Get('applications')
    getAllApplications() {
        return this.adminService.getAllApplications();
    }

    @Post('members')
    createMember(@Body() body: any) {
        return this.adminService.createMember(body);
    }

    @Post('users/:id')
    updateUser(@Param('id') id: string, @Body() body: any) {
        return this.adminService.updateUser(Number(id), body);
    }

    @Delete('users/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(Number(id));
    }

    @Post('sync')
    syncUsers() {
        return this.adminService.syncUsers();
    }

    @Post('orders/:id/reassign-chef')
    reassignChef(@Param('id') id: string, @Body() body: { chefId: number }) {
        return this.adminService.reassignChef(Number(id), body.chefId);
    }
}
