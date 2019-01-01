(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Enemy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1abedOjLYFGuJMK6/BE15jr', 'Enemy', __filename);
// Script/Enemy.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.DAMP = 0.95;
        _this.lowerBound = 0;
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.isAllowedToFire = true;
        // Being set in the subclasses.
        _this.hitPoints = 0;
        _this.cvs = null;
        _this.applyForceLeft = false;
        _this.xSpeed = 0;
        _this.game = null;
        return _this;
    }
    Enemy.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.65;
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
        this.applyForceLeft = this.getComponent(cc.RigidBody).linearVelocity.x < 0 ? false : true;
    };
    // start () {}
    Enemy.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            // Stop the laser shooting after passing the lower part
            // Of the canvas
            if (this.node.y <= this.lowerBound * 0.6) {
                this.isAllowedToFire = false;
            }
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    };
    Enemy.prototype.updateShip = function (xAcceleration, ySpeed, dt) {
        // X-axis force bounds
        if (this.node.x <= this.leftBound * 0.65) {
            this.applyForceLeft = false;
        }
        else if (this.node.x >= this.rightBound * 0.65) {
            this.applyForceLeft = true;
        }
        // === X-AXIS ===
        if (this.applyForceLeft) {
            this.xSpeed -= xAcceleration * dt;
        }
        else {
            this.xSpeed += xAcceleration * dt;
        }
        this.node.y += ySpeed * dt;
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
    };
    Enemy.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "LaserBlue") {
            this.game.playRockExplosion();
            otherCollider.node.destroy();
            if (this.hitPoints > 0) {
                this.hitPoints--;
            }
            else {
                this.isAllowedToFire = false;
                // Turn off just the hitbox since we will destroy the whole node after we are done with the animation.
                this.node.getComponent(cc.RigidBody).enabledContactListener = false;
                this.getComponent(cc.Animation).play("Explosion");
            }
        }
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.getComponent(cc.Animation).play("Explosion");
            if (!this.game.player.getComponent("PlayerControl").isInvincible()) {
                this.game.playPlayerExplosionAnimation();
                this.game.resetGame();
            }
        }
    };
    Enemy.prototype.setLaserScheduler = function (fireRate, initiateLaser) {
        cc.director.getScheduler().schedule(initiateLaser, this, fireRate, false);
    };
    // Just a hack to get the angle, need to read more about
    // the coordinate system and how angles work in cocos
    // Works for now.
    Enemy.prototype.getAngle = function () {
        if (this.game.isPlayerAlive()) {
            var angle = Math.atan2(this.game.player.y - this.node.y, this.game.player.x - this.node.x) * -180 / Math.PI;
            return angle - 90;
        }
        else {
            return 0;
        }
    };
    // ============== Animation trigger functions ==============
    Enemy.prototype.destroySelf = function () {
        this.node.destroy();
    };
    Enemy = __decorate([
        ccclass
    ], Enemy);
    return Enemy;
}(cc.Component));
exports.default = Enemy;

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
        //# sourceMappingURL=Enemy.js.map
        