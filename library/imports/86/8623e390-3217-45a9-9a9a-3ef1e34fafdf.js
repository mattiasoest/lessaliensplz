"use strict";
cc._RF.push(module, '8623eOQMhdFqZqaPvHjT6/f', 'Player');
// Script/Player.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLeftAnimPlaying = false;
        _this.isRightAnimPlaying = false;
        // X / Y bounds for the player
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.upperBound = 0;
        _this.lowerBound = 0;
        _this.xSpeed = 0;
        _this.ySpeed = 0;
        _this.flySound = null;
        _this.animations = null;
        _this.isCurrentlyInvincible = false;
        _this.invincibleId = -1;
        _this.invincibleSound = null;
        _this.game = null;
        // Constants
        _this.X_ACCELERATION = 3200;
        _this.Y_ACCELERATION = 2300;
        _this.DAMP = 0.8;
        return _this;
    }
    Player.prototype.onLoad = function () {
        this.flySound = this.getComponent(cc.AudioSource);
        this.flySound.volume = 0.6;
        this.animations = this.getComponent(cc.Animation);
    };
    Player.prototype.start = function () {
        this.leftBound = -this.game.getMainCanvas().width / 2 + this.node.width / 2;
        this.rightBound = this.game.getMainCanvas().width / 2 - this.node.width / 2;
        this.upperBound = this.game.getPlayerUpperBound();
        this.lowerBound = this.node.height / 2 - this.game.getMainCanvas().height / 2;
    };
    Player.prototype.update = function (dt) {
        if (this.game.isPlayerAlive()) {
            if (this.game.isMobileDevice()) {
                this.updateForceMobile(dt);
            }
            else {
                this.updateForce(dt);
            }
            this.applyForce(dt);
            this.checkPlayerBounds();
        }
    };
    Player.prototype.checkPlayerBounds = function () {
        // X-Screen bounds
        if (this.node.x <= this.leftBound) {
            this.node.x = this.leftBound;
        }
        else if (this.node.x >= this.rightBound) {
            this.node.x = this.rightBound;
        }
        // Y-Screen bounds
        if (this.node.y < this.lowerBound) {
            this.game.playBoundEffect(false);
            this.node.y = this.lowerBound;
            this.ySpeed = 0;
        }
        else if (this.node.y > this.upperBound) {
            this.game.playBoundEffect(true);
            this.node.y = this.upperBound;
            this.ySpeed = 0;
        }
    };
    Player.prototype.updateForceMobile = function (dt) {
        if (this.game.getAccelerometerX() < -0.25) {
            if (!this.isLeftAnimPlaying) {
                this.flySound.play();
                this.isLeftAnimPlaying = true;
                this.animations.play("PlayerLeft");
            }
        }
        else if (this.game.getAccelerometerX() > 0.25) {
            if (!this.isRightAnimPlaying) {
                this.flySound.play();
                this.isRightAnimPlaying = true;
                this.animations.play("PlayerRight");
            }
        }
        else {
            this.isRightAnimPlaying = false;
            this.isLeftAnimPlaying = false;
            if (!this.animations.getAnimationState("PlayerNormal").isPlaying) {
                this.animations.play("PlayerNormal");
            }
        }
        // === X-AXIS ===
        this.xSpeed += this.game.getAccelerometerX() * this.X_ACCELERATION * dt;
        // === Y-AXIS ===
        this.ySpeed += this.game.getAccelerometerY() * this.Y_ACCELERATION * dt;
    };
    Player.prototype.updateForce = function (dt) {
        if (this.game.isAccLeft()) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        }
        else if (this.game.isAccRight()) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        if (this.game.isAccDown()) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        }
        else if (this.game.isAccUp()) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }
    };
    Player.prototype.applyForce = function (dt) {
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;
    };
    Player.prototype.makeInvincible = function () {
        this.invincibleId = cc.audioEngine.play(this.invincibleSound, true, 0.75);
        this.isCurrentlyInvincible = true;
    };
    Player.prototype.makeNotInvincible = function () {
        cc.audioEngine.stop(this.invincibleId);
        this.isCurrentlyInvincible = false;
    };
    Player.prototype.isInvincible = function () {
        return this.isCurrentlyInvincible;
    };
    Player.prototype.getShipAnimations = function () {
        return this.animations;
    };
    Player.prototype.playFlySound = function () {
        this.flySound.play();
    };
    Player.prototype.isTurnLeftAnimationPlaying = function () {
        return this.isLeftAnimPlaying;
    };
    Player.prototype.isTurnRightAnimationPlaying = function () {
        return this.isRightAnimPlaying;
    };
    Player.prototype.setTurnLeftAnimationPlaying = function (value) {
        this.isLeftAnimPlaying = value;
    };
    Player.prototype.setTurnRightAnimationPlaying = function (value) {
        this.isRightAnimPlaying = value;
    };
    // ============== Animation trigger functions ==============
    // These gets called after the main animation is finished (left/right animation)
    // To keep the fire from the engine fired up while in a tilted state. 
    Player.prototype.playMaxLeftFrames = function () {
        this.animations.play("PlayerLeftMax");
    };
    Player.prototype.playMaxRightFrames = function () {
        this.animations.play("PlayerRightMax");
    };
    Player.prototype.destroySelf = function () {
        this.node.destroy();
    };
    __decorate([
        property(cc.AudioClip)
    ], Player.prototype, "invincibleSound", void 0);
    Player = __decorate([
        ccclass
    ], Player);
    return Player;
}(cc.Component));
exports.default = Player;

cc._RF.pop();