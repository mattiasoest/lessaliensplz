"use strict";
cc._RF.push(module, '376bdpP5V9PiaUcTdLmsYFh', 'Ammo');
// Script/Ammo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Ammo = /** @class */ (function (_super) {
    __extends(Ammo, _super);
    function Ammo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lowerBound = 0;
        _this.cvs = null;
        _this.game = null;
        return _this;
    }
    Ammo.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
    };
    Ammo.prototype.start = function () {
    };
    Ammo.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    };
    Ammo.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.addAmmo();
            selfCollider.node.destroy();
        }
    };
    Ammo = __decorate([
        ccclass
    ], Ammo);
    return Ammo;
}(cc.Component));
exports.default = Ammo;

cc._RF.pop();