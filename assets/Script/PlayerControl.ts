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
    private invincibleTimer: number = 0;
    private audioId = 0;

    @property(cc.AudioClip)
    invincibleSound: cc.AudioClip = null;

    game : Game = null;


    // Constants
    private readonly X_ACCELERATION: number = 3200;
    private readonly Y_ACCELERATION: number = 2000;
    private readonly DAMP: number = 0.8;

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.flySound = this.getComponent(cc.AudioSource);
        this.flySound.volume = 0.6;
        this.animations = this.getComponent(cc.Animation);
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
        this.upperBound = 0;
        this.lowerBound = this.node.height / 2 -this.cvs.height / 2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
    }

    update (dt) {
        if (this.isCurrentlyInvincible) {
            this.invincibleTimer += dt;
            if (this.invincibleTimer >= this.game.getInvincibleDuration()) {
                cc.audioEngine.stop(this.audioId);
                this.isCurrentlyInvincible = false;
                this.invincibleTimer = 0;
            }
        }

        // === X-AXIS ===
        if (this.accLeft) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        } else if (this.accRight) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;

        // X-Screen bounds
        if (this.node.x <= this.leftBound) {
            this.node.x = this.leftBound;
        }
        else if (this.node.x >= this.rightBound) {
            this.node.x = this.rightBound;
        }

        // === Y-AXIS ===
        if (this.accDown) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        } else if (this.accUp) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }

        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;

        // Y-Screen bounds
        if (this.node.y <= this.lowerBound) {
            this.node.y = this.lowerBound;
        }
        else if (this.node.y >= this.upperBound) {
            this.node.y = this.upperBound;
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
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
                this.accDown = true;
                break;
            case cc.macro.KEY.space:
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
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

    makeInvincible() {
        this.audioId = cc.audioEngine.play(this.invincibleSound, true, 0.4);
        this.isCurrentlyInvincible = true;
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
}
