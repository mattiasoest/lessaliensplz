import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

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

    @property(cc.AudioClip)
    invincibleSound: cc.AudioClip = null;

    game : Game = null;

    // Constants
    private readonly X_ACCELERATION: number = 3200;
    private readonly Y_ACCELERATION: number = 2300;
    private readonly DAMP: number = 0.8;

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.flySound = this.getComponent(cc.AudioSource);
        this.flySound.volume = 0.6;
        this.animations = this.getComponent(cc.Animation);
    }

    start () {
        this.leftBound = -this.cvs.width / 2 + this.node.width / 2;
        this.rightBound = this.cvs.width / 2 - this.node.width / 2;
        this.upperBound = this.game.getPlayerUpperBound();
        this.lowerBound = this.node.height / 2 -this.cvs.height / 2;
    }

    update (dt) {
        if (this.game.isPlayerAlive()) {
            if (this.game.isMobileDevice()) {
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
            this.game.playBoundSound();
            this.node.y = this.upperBound -1;
            this.ySpeed = 0;
        }
    }

    updateForceMobile(dt: number) {
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
    }

    updateForce(dt: number) {
        if (this.game.isAccLeft()) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        } else if (this.game.isAccRight()) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        if (this.game.isAccDown()) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        } else if (this.game.isAccUp()) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }
    }

    applyForce(dt: number) {
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;
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
    
    getShipAnimations() {
        return this.animations;
    }

    playFlySound() {
        this.flySound.play();
    }

    isTurnLeftAnimationPlaying() {
        return this.isLeftAnimPlaying;
    }

    isTurnRightAnimationPlaying() {
        return this.isRightAnimPlaying
    }

    setTurnLeftAnimationPlaying(value: boolean) {
        this.isLeftAnimPlaying = value;
    }

    setTurnRightAnimationPlaying(value: boolean) {
        this.isRightAnimPlaying = value;
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
