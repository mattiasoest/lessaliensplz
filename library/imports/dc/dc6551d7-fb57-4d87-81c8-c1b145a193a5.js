"use strict";
cc._RF.push(module, 'dc655HX+1dNh4HIwbFFoZOl', 'EnemySmall');
// Script/EnemySmall.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemySmall = /** @class */ (function (_super) {
    __extends(EnemySmall, _super);
    function EnemySmall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.FIRE_RATE = 1.8;
        _this.BULLET_BURST = 5;
        _this.LASER_INTERVAL = 0.05;
        _this.X_ACCELERATION = 1000;
        _this.Y_SPEED = -70;
        _this.LASER_SPEED = 300;
        _this.laserSound = null;
        _this.isBurstOn = false;
        _this.burstTimer = 0;
        _this.numberOfBulletsFired = 0;
        return _this;
    }
    EnemySmall.prototype.start = function () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.hitPoints = 0;
        _super.prototype.setLaserScheduler.call(this, this.FIRE_RATE, this.initiateLaser);
    };
    EnemySmall.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        this.node.rotation = _super.prototype.getAngle.call(this);
        _super.prototype.updateShip.call(this, this.X_ACCELERATION, this.Y_SPEED, dt);
        if (this.isAllowedToFire) {
            if (this.isBurstOn) {
                this.burstTimer += dt;
                if (this.burstTimer >= this.LASER_INTERVAL && this.numberOfBulletsFired < this.BULLET_BURST) {
                    this.burstTimer = 0;
                    // Local xPos (center)
                    this.game.spawnEnemyLaser(0, this.node, cc.v2(Math.sin(this.node.rotation / (-180 / Math.PI)) * this.LASER_SPEED, Math.cos(this.node.rotation / (-180 / Math.PI)) * -this.LASER_SPEED));
                    this.laserSound.play();
                    this.numberOfBulletsFired++;
                }
            }
        }
    };
    EnemySmall.prototype.initiateLaser = function () {
        this.isBurstOn = true;
        this.burstTimer = 0;
        this.numberOfBulletsFired = 0;
    };
    EnemySmall = __decorate([
        ccclass
    ], EnemySmall);
    return EnemySmall;
}(Enemy_1.default));
exports.default = EnemySmall;

cc._RF.pop();