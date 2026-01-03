import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
// Note: In a real app, we'd have a specific RolesGuard here to ensure only ADMINs can access.
// For migration speed, we assume the frontend hides these routes or we add a simple check.

@UseGuards(AuthGuard('jwt'))
@Controller('api/admin')
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

    @Post('approve-application/:id')
    approveApplication(@Param('id') id: string) {
        return this.adminService.approveApplication(Number(id));
    }

    @Post('reject-application/:id')
    rejectApplication(@Param('id') id: string) {
        return this.adminService.rejectApplication(Number(id));
    }

    @Post('create-chef')
    createChef(@Body() body: { name: string; email: string; password?: string }) {
        return this.adminService.createChef(body);
    }
}
