import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            member_id: any;
            avatar: any;
        };
    }>;
    register(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            member_id: any;
            avatar: any;
        };
    }>;
    getProfile(req: any): any;
}
