import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        // Handle BOTH 'email' (from Admin/Chef portals) and 'identifier' (from Member portal)
        const identity = req.email || req.identifier;
        const user = await this.authService.validateUser(identity, req.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() req: any) {
        return this.authService.register(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async getProfile(@Request() req: any) {
        // Fetch full user details including profile
        const user = await this.authService.getUserById(req.user.userId);
        return user;
    }
}
