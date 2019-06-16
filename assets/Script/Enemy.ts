import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    private readonly DAMP = 0.95;

    protected lowerBound: number = 0;
    protected leftBound: number = 0;
    protected rightBound: number = 0;
    protected isAllowedToFire: boolean = true;
    protected game: Game = null;
    // Being set in the subclasses.
    protected hitPoints: number = 0;
    private applyForceLeft: boolean = false;
    private xSpeed = 0;


    // Called from the subclasses
    // When they are created.
    initialize() {
        // this.game = game;
        this.lowerBound = -this.game.getMainCanvas().height * 0.6;
        this.leftBound = -this.game.getMainCanvas().width * 0.5;
        this.rightBound = this.game.getMainCanvas().width * 0.5;
        this.applyForceLeft = this.getComponent(cc.RigidBody).linearVelocity.x < 0 ? false : true;
    }

    update (dt) {
        if (cc.isValid(this.node)) {
            // Stop the laser shooting after passing the lower part
            // Of the canvas
            if (this.node.y <= this.game.getPlayerLowerBound()) {
                this.isAllowedToFire = false;
            }
            if (this.node.y < this.lowerBound) {
                this.node.destroy();
            }
        }
    }

    updateShip(xAcceleration : number, ySpeed: number, dt : number) {

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
        } else {
            this.xSpeed += xAcceleration * dt;
        }

        this.node.y += ySpeed * dt;
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;
        
    }

    onBeginContact(contact, selfCollider, otherCollider) {
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
            let isAlive = this.game.isPlayerAlive();
            if (!this.game.getPlayerObject().isInvincible() && isAlive) {
                // Will destroy itself after the animation.
                this.game.resetGame();
            }
        }
    }

    setLaserScheduler(fireRate: number,initiateLaser: Function) {
        cc.director.getScheduler().schedule(initiateLaser, this, fireRate, false);
    }

    // Just a hack to get the angle, need to read more about
    // the coordinate system and how angles work in cocos
    // Works for now.
    getAngle() {
        if (this.game.isPlayerAlive()) {
            let angle = Math.atan2(this.game.player.y - this.node.y, this.game.player.x - this.node.x) * -180 / Math.PI;
            return angle - 90;
        }
        else {
            return 0;
        }

    }
    // ============== Animation trigger functions ==============
    destroySelf() {
        this.node.destroy();
    }
}
