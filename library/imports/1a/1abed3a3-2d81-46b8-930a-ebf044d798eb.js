"use strict";
cc._RF.push(module, '1abedOjLYFGuJMK6/BE15jr', 'Enemy');
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
        _this.game = null;
        // Being set in the subclasses.
        _this.hitPoints = 0;
        _this.applyForceLeft = false;
        _this.xSpeed = 0;
        return _this;
    }
    // Called from the subclasses
    // When they are created.
    Enemy.prototype.initialize = function () {
        // this.game = game;
        this.lowerBound = -this.game.getMainCanvas().height * 0.6;
        this.leftBound = -this.game.getMainCanvas().width * 0.5;
        this.rightBound = this.game.getMainCanvas().width * 0.5;
        this.applyForceLeft = this.getComponent(cc.RigidBody).linearVelocity.x < 0 ? false : true;
    };
    Enemy.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            // Stop the laser shooting after passing the lower part
            // Of the canvas
            if (this.node.y <= this.lowerBound * 0.6) {
                this.isAllowedToFire = false;
            }
            if (this.node.y < this.lowerBound) {
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
            this.getComponent(cc.Animation).play("Explosion");
            var isAlive = this.game.isPlayerAlive();
            if (!this.game.getPlayerObject().isInvincible() && isAlive) {
                // Will destroy itself after the animation.
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