"use strict";
cc._RF.push(module, '9acbcqEilhC0YfW02UrMAh1', 'Asteroid');
// Script/Asteroid.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Asteroid = /** @class */ (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotationSpeed = 100;
        _this.velocity = 100;
        // LIFE-CYCLE CALLBACKS:
        _this.rotationDir = 1;
        _this.lowerBound = 0;
        _this.cvs = null;
        _this.game = null;
        return _this;
    }
    Asteroid.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
        this.node.setScale(0.3);
        this.rotationDir *= Math.random() < 0.5 ? -1 : 1;
        if (Math.random() < 0.65) {
            this.rotationSpeed *= 2;
            this.velocity *= 1.5;
        }
        else {
            this.rotationSpeed *= 4.2;
            this.velocity *= 2.2;
        }
    };
    Asteroid.prototype.start = function () {
    };
    Asteroid.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            this.node.rotation += this.rotationSpeed * dt * this.rotationDir;
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    };
    Asteroid.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "LaserBlue") {
            this.game.playRockExplosion();
            // this.node.rotation = 0;
            // Turn off just the hitbox since we will destroy the whole node after we are done with the animation.
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.getComponent(cc.Animation).play("ExplosionLarger");
            // Gets destroyed by the trigger function destroySelf
            otherCollider.node.destroy();
        }
        if (otherCollider.node.name === "Player") {
            console.log("PLAYER ASTEROID CONTACT");
            // ====== TODO FIX
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.getComponent(cc.Animation).play("ExplosionLarger");
            // ======
            this.game.resetGame();
            this.game.playExplosionAnimation();
            // selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    };
    // Trigger functions for animation triggers
    Asteroid.prototype.destroySelf = function () {
        this.node.destroy();
    };
    Asteroid.prototype.selfScale = function () {
        this.node.setScale(1.4);
    };
    Asteroid = __decorate([
        ccclass
    ], Asteroid);
    return Asteroid;
}(cc.Component));
exports.default = Asteroid;

cc._RF.pop();