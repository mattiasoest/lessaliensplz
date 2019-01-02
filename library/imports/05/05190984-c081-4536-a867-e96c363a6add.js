"use strict";
cc._RF.push(module, '05190mEwIFFNqhn6Ww2Omrd', 'InvincibleEffect');
// Script/InvincibleEffect.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var InvincibleEffect = /** @class */ (function (_super) {
    __extends(InvincibleEffect, _super);
    function InvincibleEffect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.particles = null;
        return _this;
    }
    InvincibleEffect.prototype.onLoad = function () {
        this.particles = this.node.getComponent(cc.ParticleSystem);
    };
    InvincibleEffect.prototype.setDuration = function (duration) {
        this.particles.duration = duration;
    };
    InvincibleEffect.prototype.startParticleEffect = function () {
        this.particles.resetSystem();
    };
    InvincibleEffect = __decorate([
        ccclass
    ], InvincibleEffect);
    return InvincibleEffect;
}(cc.Component));
exports.default = InvincibleEffect;

cc._RF.pop();