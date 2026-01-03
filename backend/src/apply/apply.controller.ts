import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApplyService } from './apply.service';
// import { AuthGuard } from '@nestjs/passport'; // Apply is public

@Controller('api/apply')
export class ApplyController {
    constructor(private readonly applyService: ApplyService) { }

    @Post()
    async submitApplication(@Body() body: any) {
        return this.applyService.createApplication(body);
    }

    // @UseGuards(AuthGuard('jwt')) // Protect this in real app
    @Get()
    async getApplications() {
        return this.applyService.getApplications();
    }
}
