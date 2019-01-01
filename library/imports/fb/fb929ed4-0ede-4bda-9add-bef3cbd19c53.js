"use strict";
cc._RF.push(module, 'fb9297UDt5L2prdvvPL0ZxT', 'LaserRed');
// Script/LaserRed.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LaserRed = /** @class */ (function (_super) {
    __extends(LaserRed, _super);
    function LaserRed() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerFireSound = null;
        _this.lowerBound = 0;
        _this.cvs = null;
        _this.game = null;
        return _this;
    }
    LaserRed.prototype.onLoad = function () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
    };
    // start () {
    // }
    LaserRed.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y < -this.lowerBound) {
                // this.node.destroy();
            }
        }
    };
    LaserRed.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            otherCollider.getComponent(cc.Animation).play("Explosion");
            selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    };
    LaserRed.prototype.playLaserSound = function () {
        this.playerFireSound.play();
    };
    LaserRed = __decorate([
        ccclass
    ], LaserRed);
    return LaserRed;
}(cc.Component));
exports.default = LaserRed;

cc._RF.pop();