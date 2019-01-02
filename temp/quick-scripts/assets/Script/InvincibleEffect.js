(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/InvincibleEffect.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '05190mEwIFFNqhn6Ww2Omrd', 'InvincibleEffect', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=InvincibleEffect.js.map
        