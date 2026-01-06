"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const chef_service_1 = require("./chef.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../../backend/src/auth/roles.decorator");
const roles_guard_1 = require("../../backend/src/auth/roles.guard");
const client_1 = require("@prisma/client");
let ChefController = class ChefController {
    constructor(chefService) {
        this.chefService = chefService;
    }
    getDashboard(req) {
        return this.chefService.getDashboard(req.user.userId);
    }
    updateStatus(id, body) {
        return this.chefService.updateOrderStatus(parseInt(id), body.status);
    }
    updateAvailability(req, body) {
        return this.chefService.updateAvailability(req.user.userId, body);
    }
    verifyMember(id) {
        return this.chefService.verifyMember(id);
    }
    setupProfile(req, body, file) {
        console.log('Setup Profile Request:', { userId: req.user.userId, body });
        const imagePath = file ? `/uploads/${file.filename}` : undefined;
        return this.chefService.setupProfile(req.user.userId, {
            bio: body.bio,
            categories: JSON.parse(body.categories || '[]'),
            image: imagePath
        });
    }
    updateMenu(id, file, body) {
        const imagePath = file ? `/uploads/${file.filename}` : undefined;
        return this.chefService.updateMenu(Number(id), {
            ...body,
            image: imagePath
        });
    }
};
exports.ChefController = ChefController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('orders/:id/update-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('availability'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Get)('verify-member/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "verifyMember", null);
__decorate([
    (0, common_1.Post)('setup'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "setupProfile", null);
__decorate([
    (0, common_1.Post)('menus/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateMenu", null);
exports.ChefController = ChefController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.CHEF),
    (0, common_1.Controller)('chef'),
    __metadata("design:paramtypes", [chef_service_1.ChefService])
], ChefController);
//# sourceMappingURL=chef.controller.js.map