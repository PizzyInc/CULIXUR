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
const chef_service_1 = require("./chef.service");
const passport_1 = require("@nestjs/passport");
let ChefController = class ChefController {
    chefService;
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
        return this.chefService.updateAvailability(req.user.userId, body.slots);
    }
    verifyMember(id) {
        return this.chefService.verifyMember(id);
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
exports.ChefController = ChefController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api/chef'),
    __metadata("design:paramtypes", [chef_service_1.ChefService])
], ChefController);
//# sourceMappingURL=chef.controller.js.map