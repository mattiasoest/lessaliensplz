(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/EnemyMedium.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4a125VrSXlFmpYUFnW+uzHO', 'EnemyMedium', __filename);
// Script/EnemyMedium.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemyMedium = /** @class */ (function (_super) {
    __extends(EnemyMedium, _super);
    function EnemyMedium() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.FIRE_RATE = 2;
        _this.BULLET_BURST = 2;
        _this.LASER_INTERVAL = 0.15;
        _this.X_ACCELERATION = 300;
        _this.Y_SPEED = -60;
        _this.LASER_SPEED = 240;
        _this.laserSound = null;
        _this.isBurstOn = false;
        _this.burstTimer = 0;
        _this.numberOfBulletsFired = 0;
        return _this;
    }
    EnemyMedium.prototype.start = function () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.hitPoints = 1;
        _super.prototype.setLaserScheduler.call(this, this.FIRE_RATE, this.initiateLaser);
    };
    EnemyMedium.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        this.node.rotation = _super.prototype.getAngle.call(this);
        _super.prototype.updateShip.call(this, this.X_ACCELERATION, this.Y_SPEED, dt);
        if (this.isAllowedToFire) {
            if (this.isBurstOn) {
                this.burstTimer += dt;
                if (this.burstTimer >= this.LASER_INTERVAL && this.numberOfBulletsFired < this.BULLET_BURST) {
                    this.burstTimer = 0;
                    this.game.spawnEnemyLaser(-5, this.node, cc.v2(Math.sin(this.node.rotation / (-180 / Math.PI)) * this.LASER_SPEED, Math.cos(this.node.rotation / (-180 / Math.PI)) * -this.LASER_SPEED));
                    this.game.spawnEnemyLaser(5, this.node, cc.v2(Math.sin(this.node.rotation / (-180 / Math.PI)) * this.LASER_SPEED, Math.cos(this.node.rotation / (-180 / Math.PI)) * -this.LASER_SPEED));
                    this.laserSound.play();
                    this.numberOfBulletsFired++;
                }
            }
        }
    };
    EnemyMedium.prototype.initiateLaser = function () {
        this.isBurstOn = true;
        this.burstTimer = 0;
        this.numberOfBulletsFired = 0;
    };
    EnemyMedium = __decorate([
        ccclass
    ], EnemyMedium);
    return EnemyMedium;
}(Enemy_1.default));
exports.default = EnemyMedium;

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
        //# sourceMappingURL=EnemyMedium.js.map
        