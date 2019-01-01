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
        _this.FIRE_RATE = 0.5;
        _this.BULLET_BURST = 4;
        _this.LASER_INTERVAL = 0.25;
        _this.miniLaser = null;
        return _this;
    }
    EnemySmall.prototype.start = function () {
        this.miniLaser = this.getComponent(cc.AudioSource);
        this.setLaserScheduler();
    };
    EnemySmall.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
    };
    EnemySmall.prototype.fireLaser = function () {
        // cc.director.getScheduler().schedule(this.createLaser, this, this.FIRE_RATE, false);
        this.createLaser();
    };
    EnemySmall.prototype.setLaserScheduler = function () {
        cc.director.getScheduler().schedule(this.fireLaser, this, this.FIRE_RATE, false);
    };
    EnemySmall.prototype.createLaser = function () {
        var newLaser = cc.instantiate(this.redLaser);
        // Relative to the current node. So center it.
        newLaser.setPosition(0, -this.node.height / 2);
        var body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, -285);
        this.node.addChild(newLaser);
        var laserObject = newLaser.getComponent('LaserRed');
        // Game from the superclass.
        laserObject.game = this.game;
        this.miniLaser.play();
    };
    EnemySmall = __decorate([
        ccclass
    ], EnemySmall);
    return EnemySmall;
}(Enemy_1.default));
exports.default = EnemySmall;

cc._RF.pop();