import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private backendUrl: string;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://127.0.0.1:3001';
    }

    async validateUser(identity: string, pass: string): Promise<any> {
        if (!identity) return null;

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: identity },
                    { memberId: identity }
                ]
            }
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                member_id: user.memberId,
                avatar: user.image,
            }
        };
    }

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            }
        });
        return this.login(user);
    }

    async getUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                chefProfile: true,
            },
        });

        if (user) {
            if (user.image) {
                user.image = user.image.startsWith('http') ? user.image : `${this.backendUrl}${user.image}`;
            }
            if (user.chefProfile && user.chefProfile.image) {
                user.chefProfile.image = user.chefProfile.image.startsWith('http') ? user.chefProfile.image : `${this.backendUrl}${user.chefProfile.image}`;
            }
        }

        return user;
    }
}
