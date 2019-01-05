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
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.upperBound = 0;
        _this.game = null;
        return _this;
    }
    LaserRed.prototype.onLoad = function () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
    };
    LaserRed.prototype.start = function () {
        this.lowerBound = -this.game.getMainCanvas().height * 0.6;
        this.leftBound = -this.game.getMainCanvas().width * 0.5;
        this.rightBound = this.game.getMainCanvas().width * 0.5;
        this.upperBound = this.game.getMainCanvas().height * 0.5;
    };
    LaserRed.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.isOutOfBounds()) {
                this.node.destroy();
            }
        }
    };
    LaserRed.prototype.isOutOfBounds = function () {
        return this.node.y < this.lowerBound || this.node.y > this.upperBound ||
            this.node.x < this.leftBound || this.node.x > this.rightBound;
    };
    LaserRed.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            selfCollider.node.destroy();
            var isAlive = this.game.isPlayerAlive();
            if (!this.game.getPlayerObject().isInvincible() && isAlive) {
                this.game.resetGame();
            }
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