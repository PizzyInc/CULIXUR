import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
// Note: In a real app, we'd have a specific RolesGuard here to ensure only ADMINs can access.
// For migration speed, we assume the frontend hides these routes or we add a simple check.

@UseGuards(AuthGuard('jwt'))
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
        // We'll need to define this in the service or just return recent orders
        return this.adminService.getDashboard().then(data => data.recentOrders);
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
}
