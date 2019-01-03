import Game from "./Game";
import InvincibleEffect from "./InvincibleEffect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    // Keys for acceleration movement
    private accLeft: boolean = false;
    private accRight: boolean = false;
    private accUp: boolean = false;
    private accDown: boolean = false;
    private isLeftAnimPlaying: boolean = false;
    private isRightAnimPlaying: boolean = false;

    // X / Y bounds for the player
    private leftBound: number = 0;
    private rightBound: number = 0;
    private upperBound: number = 0;
    private lowerBound: number = 0;

    private xSpeed: number = 0;
    private ySpeed: number = 0;

    private flySound: cc.AudioSource = null;
    private cvs: cc.Node  = null;
    private animations : cc.Animation = null;
    private isCurrentlyInvincible: boolean = false;
    private invincibleId = -1;
    private boundId = -1;
    private justPlayedBoundSound: boolean = false;
    private isMobile : boolean = false;

    private xAccelerometer: number = 0;
    private yAccelerometer: number = 0;

    @property(cc.AudioClip)
    invincibleSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    upperBoundSound: cc.AudioClip = null;

    game : Game = null;

    // Constants
    private readonly X_ACCELERATION: number = 3200;
    private readonly Y_ACCELERATION: number = 2000;
    private readonly MOBILE_ACC_MULTIPLIER = 2.7;
    private readonly DAMP: number = 0.8;

    onLoad () {
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
    }

    start () {
        this.leftBound = -this.cvs.width / 2 + this.node.width / 2;
        this.rightBound = this.cvs.width / 2 - this.node.width / 2;
        this.upperBound = this.game.getPlayerUpperBound();
        this.lowerBound = this.node.height / 2 -this.cvs.height / 2;
    }

    update (dt) {
        if (this.game.isPlayerAlive()) {
            if (this.isMobile) {
                this.updateForceMobile(dt);
            }
            else {
                this.updateForce(dt);
            }
            this.applyForce(dt)
            this.checkPlayerBounds();
        }
    }

    checkPlayerBounds(){
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
            this.node.y = this.upperBound -1;
            this.ySpeed = 0;
        }
    }

    updateForceMobile(dt: number) {
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
    }

    updateForce(dt: number) {
        if (this.accLeft) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        } else if (this.accRight) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        if (this.accDown) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        } else if (this.accUp) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }
    }

    applyForce(dt) {
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        
        if (this.game.isPlayerAlive()) {
            switch(event.keyCode) {
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
 
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (this.game.isPlayerAlive()) {
            switch(event.keyCode) {
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
    }

    onDeviceMotionEvent(event: any) {
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
}

    playBoundSound() {
        if (!this.justPlayedBoundSound) {
            this.justPlayedBoundSound = true;
            this.boundId = cc.audioEngine.play(this.upperBoundSound, false, 1);
            this.game.hitBound();
            if (this.isMobile) {
                cc.audioEngine.setFinishCallback(this.boundId,
                    () => this.yAccelerometer > 0 ? this.justPlayedBoundSound = true : this.justPlayedBoundSound = false);
            }
            else {
                cc.audioEngine.setFinishCallback(this.boundId,
                    () => this.accUp ? this.justPlayedBoundSound = true : this.justPlayedBoundSound = false);
            }
        }
    }

    makeInvincible() {
        this.invincibleId = cc.audioEngine.play(this.invincibleSound, true, 0.4);
        this.isCurrentlyInvincible = true;
    }

    makeNotInvincible() {
        cc.audioEngine.stop(this.invincibleId);
        this.isCurrentlyInvincible = false;
    }

    isInvincible() {
        return this.isCurrentlyInvincible;
    }

    // ============== Animation trigger functions ==============
    // These gets called after the main animation is finished (left/right animation)
    // To keep the fire from the engine fired up while in a tilted state. 
    playMaxLeftFrames() {
        this.animations.play("PlayerLeftMax");
    }

    playMaxRightFrames() {
        this.animations.play("PlayerRightMax");
    }

    destroySelf() {
        this.node.destroy();
    }
}
