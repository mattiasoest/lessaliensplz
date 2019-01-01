"use strict";
cc._RF.push(module, 'a081212ytNLq6A0uP3PtqpY', 'EnemyBig');
// Script/EnemyBig.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemyBig = /** @class */ (function (_super) {
    __extends(EnemyBig, _super);
    function EnemyBig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.FIRE_RATE = 2;
        _this.BULLET_BURST = 1;
        _this.LASER_INTERVAL = 0.2;
        _this.X_ACCELERATION = 110;
        _this.Y_SPEED = -50;
        _this.LASER_SPEED = 135;
        _this.laserSound = null;
        _this.isBurstOn = false;
        _this.burstTimer = 0;
        _this.numberOfBulletsFired = 0;
        return _this;
    }
    EnemyBig.prototype.start = function () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.hitPoints = 1;
        _super.prototype.setLaserScheduler.call(this, this.FIRE_RATE, this.initiateLaser);
    };
    EnemyBig.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        _super.prototype.updateShip.call(this, this.X_ACCELERATION, this.Y_SPEED, dt);
        if (this.isAllowedToFire) {
            if (this.isBurstOn) {
                this.burstTimer += dt;
                if (this.burstTimer >= this.LASER_INTERVAL && this.numberOfBulletsFired < this.BULLET_BURST) {
                    this.burstTimer = 0;
                    var angle = -37.5;
                    var offset = -20;
                    for (var i = 0; i < 7; i++) {
                        this.createLaser(offset, cc.v2(Math.sin(angle / (180 / Math.PI)) * this.LASER_SPEED, Math.cos(angle / (180 / Math.PI)) * -this.LASER_SPEED));
                        angle += 12.5;
                        offset += 10;
                    }
                    this.laserSound.play();
                    this.numberOfBulletsFired++;
                }
            }
        }
    };
    EnemyBig.prototype.initiateLaser = function () {
        this.isBurstOn = true;
        this.burstTimer = 0;
        this.numberOfBulletsFired = 0;
    };
    EnemyBig = __decorate([
        ccclass
    ], EnemyBig);
    return EnemyBig;
}(Enemy_1.default));
exports.default = EnemyBig;

cc._RF.pop();