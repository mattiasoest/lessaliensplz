"use strict";
cc._RF.push(module, '8623eOQMhdFqZqaPvHjT6/f', 'PlayerControl');
// Script/PlayerControl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PlayerControl = /** @class */ (function (_super) {
    __extends(PlayerControl, _super);
    function PlayerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Keys for acceleration movement
        _this.accLeft = false;
        _this.accRight = false;
        _this.accUp = false;
        _this.accDown = false;
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
        _this.cvs = null;
        _this.animations = null;
        _this.isCurrentlyInvincible = false;
        _this.invincibleId = -1;
        _this.boundId = -1;
        _this.justPlayedBoundSound = false;
        _this.isMobile = false;
        _this.xAccelerometer = 0;
        _this.yAccelerometer = 0;
        _this.invincibleSound = null;
        _this.upperBoundSound = null;
        _this.game = null;
        // Constants
        _this.X_ACCELERATION = 3200;
        _this.Y_ACCELERATION = 2000;
        _this.MOBILE_ACC_MULTIPLIER = 2.7;
        _this.DAMP = 0.8;
        return _this;
    }
    PlayerControl.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.flySound = this.getComponent(cc.AudioSource);
        this.flySound.volume = 0.6;
        this.animations = this.getComponent(cc.Animation);
        this.isMobile = cc.sys.isMobile;
        // =========== DIFFERENT CONTROLS DEPENDING ON THE SYSTEM ===========
        if (this.isMobile) {
            cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
            cc.systemEvent.setAccelerometerEnabled(true);
        }
        else {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
    };
    PlayerControl.prototype.start = function () {
        this.leftBound = -this.cvs.width / 2 + this.node.width / 2;
        this.rightBound = this.cvs.width / 2 - this.node.width / 2;
        this.upperBound = this.game.getPlayerUpperBound();
        this.lowerBound = this.node.height / 2 - this.cvs.height / 2;
    };
    PlayerControl.prototype.update = function (dt) {
        if (this.game.isPlayerAlive()) {
            if (this.isMobile) {
                this.updateForceMobile(dt);
            }
            else {
                this.updateForce(dt);
            }
            this.applyForce(dt);
            this.checkPlayerBounds();
        }
    };
    PlayerControl.prototype.checkPlayerBounds = function () {
        // X-Screen bounds
        if (this.node.x <= this.leftBound) {
            this.node.x = this.leftBound;
        }
        else if (this.node.x >= this.rightBound) {
            this.node.x = this.rightBound;
        }
        // Y-Screen bounds
        if (this.node.y <= this.lowerBound) {
            this.node.y = this.lowerBound;
        }
        else if (this.node.y > this.upperBound) {
            this.playBoundSound();
            this.node.y = this.upperBound - 1;
            this.ySpeed = 0;
        }
    };
    PlayerControl.prototype.updateForceMobile = function (dt) {
        if (this.xAccelerometer < -0.25) {
            if (!this.isLeftAnimPlaying) {
                this.flySound.play();
                this.isLeftAnimPlaying = true;
                this.animations.play("PlayerLeft");
            }
        }
        else if (this.xAccelerometer > 0.25) {
            if (!this.isRightAnimPlaying) {
                this.flySound.play();
                this.isRightAnimPlaying = true;
                this.animations.play("PlayerRight");
            }
        }
        else {
            this.animations.play("PlayerNormal");
            this.isRightAnimPlaying = false;
            this.isLeftAnimPlaying = false;
        }
        // === X-AXIS ===
        this.xSpeed += this.xAccelerometer * this.X_ACCELERATION * dt;
        // === Y-AXIS ===
        this.ySpeed += this.yAccelerometer * this.Y_ACCELERATION * dt;
    };
    PlayerControl.prototype.updateForce = function (dt) {
        if (this.accLeft) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        if (this.accDown) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        }
        else if (this.accUp) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }
    };
    PlayerControl.prototype.applyForce = function (dt) {
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;
    };
    PlayerControl.prototype.onKeyDown = function (event) {
        if (this.game.isPlayerAlive()) {
            switch (event.keyCode) {
                case cc.macro.KEY.left:
                    if (!this.isLeftAnimPlaying) {
                        this.flySound.play();
                        this.isLeftAnimPlaying = true;
                        this.animations.play("PlayerLeft");
                    }
                    this.accLeft = true;
                    break;
                case cc.macro.KEY.right:
                    if (!this.isRightAnimPlaying) {
                        this.flySound.play();
                        this.isRightAnimPlaying = true;
                        this.animations.play("PlayerRight");
                    }
                    this.accRight = true;
                    break;
                case cc.macro.KEY.up:
                    this.accUp = true;
                    break;
                case cc.macro.KEY.down:
                    this.justPlayedBoundSound = false;
                    this.accDown = true;
                    break;
                case cc.macro.KEY.space:
                    break;
            }
        }
    };
    PlayerControl.prototype.onKeyUp = function (event) {
        if (this.game.isPlayerAlive()) {
            switch (event.keyCode) {
                case cc.macro.KEY.left:
                    this.isLeftAnimPlaying = false;
                    this.animations.play("PlayerNormal");
                    this.accLeft = false;
                    break;
                case cc.macro.KEY.right:
                    this.isRightAnimPlaying = false;
                    this.animations.play("PlayerNormal");
                    this.accRight = false;
                    break;
                case cc.macro.KEY.up:
                    this.accUp = false;
                    break;
                case cc.macro.KEY.down:
                    this.accDown = false;
                    break;
                case cc.macro.KEY.space:
                    this.game.spawnBlueLaser();
                    break;
            }
        }
    };
    PlayerControl.prototype.onDeviceMotionEvent = function (event) {
        this.xAccelerometer = event.acc.x;
        this.yAccelerometer = event.acc.y;
        // Cap it to 1 /  this.MOBILE_ACC_MULTIPLIER angle of the device
        if (Math.abs(this.xAccelerometer) > 1 / this.MOBILE_ACC_MULTIPLIER) {
            this.xAccelerometer = Math.sign(this.xAccelerometer) * (1 / this.MOBILE_ACC_MULTIPLIER);
        }
        if (Math.abs(this.yAccelerometer) > 1 / this.MOBILE_ACC_MULTIPLIER) {
            this.yAccelerometer = Math.sign(this.yAccelerometer) * (1 / this.MOBILE_ACC_MULTIPLIER);
        }
        this.xAccelerometer *= this.MOBILE_ACC_MULTIPLIER;
        this.yAccelerometer *= this.MOBILE_ACC_MULTIPLIER;
    };
    PlayerControl.prototype.playBoundSound = function () {
        var _this = this;
        if (!this.justPlayedBoundSound) {
            this.justPlayedBoundSound = true;
            this.boundId = cc.audioEngine.play(this.upperBoundSound, false, 1);
            this.game.hitBound();
            if (this.isMobile) {
                cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.yAccelerometer > 0 ? _this.justPlayedBoundSound = true : _this.justPlayedBoundSound = false; });
            }
            else {
                cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.accUp ? _this.justPlayedBoundSound = true : _this.justPlayedBoundSound = false; });
            }
        }
    };
    PlayerControl.prototype.makeInvincible = function () {
        this.invincibleId = cc.audioEngine.play(this.invincibleSound, true, 0.4);
        this.isCurrentlyInvincible = true;
    };
    PlayerControl.prototype.makeNotInvincible = function () {
        cc.audioEngine.stop(this.invincibleId);
        this.isCurrentlyInvincible = false;
    };
    PlayerControl.prototype.isInvincible = function () {
        return this.isCurrentlyInvincible;
    };
    // ============== Animation trigger functions ==============
    // These gets called after the main animation is finished (left/right animation)
    // To keep the fire from the engine fired up while in a tilted state. 
    PlayerControl.prototype.playMaxLeftFrames = function () {
        this.animations.play("PlayerLeftMax");
    };
    PlayerControl.prototype.playMaxRightFrames = function () {
        this.animations.play("PlayerRightMax");
    };
    PlayerControl.prototype.destroySelf = function () {
        this.node.destroy();
    };
    __decorate([
        property(cc.AudioClip)
    ], PlayerControl.prototype, "invincibleSound", void 0);
    __decorate([
        property(cc.AudioClip)
    ], PlayerControl.prototype, "upperBoundSound", void 0);
    PlayerControl = __decorate([
        ccclass
    ], PlayerControl);
    return PlayerControl;
}(cc.Component));
exports.default = PlayerControl;

cc._RF.pop();