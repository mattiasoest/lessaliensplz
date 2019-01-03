"use strict";
cc._RF.push(module, '57af1WCawNKqa1Z6WuIFHUH', 'LaserBlue');
// Script/LaserBlue.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LaserBlue = /** @class */ (function (_super) {
    __extends(LaserBlue, _super);
    function LaserBlue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerFireSound = null;
        _this.game = null;
        return _this;
    }
    LaserBlue.prototype.onLoad = function () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
    };
    // start () {
    // }
    LaserBlue.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y > cc.find("Canvas").height * 0.5) {
                this.node.destroy();
            }
        }
    };
    LaserBlue.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Asteroid") {
            this.game.playRockExplosion();
            this.getComponent(cc.Animation).play("Explosion");
            // selfCollider.node.destroy();
            otherCollider.node.destroy();
        }
    };
    LaserBlue.prototype.playLaserSound = function () {
        this.playerFireSound.play();
    };
    LaserBlue = __decorate([
        ccclass
    ], LaserBlue);
    return LaserBlue;
}(cc.Component));
exports.default = LaserBlue;

cc._RF.pop();