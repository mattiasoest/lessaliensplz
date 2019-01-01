import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    private readonly DAMP = 0.95;

    protected lowerBound: number = 0;
    protected leftBound: number = 0;
    protected rightBound: number = 0;
    protected isAllowedToFire: boolean = true;

    // Being set in the subclasses.
    protected hitPoints: number = 0;
    private cvs: cc.Node = null;
    private applyForceLeft: boolean = false;
    private xSpeed = 0;

    @property(cc.Prefab)
    redLaser: cc.Prefab = null;

    game: Game = null;

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.65;
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
        this.applyForceLeft = this.getComponent(cc.RigidBody).linearVelocity.x < 0 ? false : true;
    }

    // start () {}

    update (dt) {
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
                // Turn off just the hitbox since we will destroy the whole node after we are done with the animation.
                this.node.getComponent(cc.RigidBody).enabledContactListener = false;
                this.getComponent(cc.Animation).play("Explosion");
            }
        }
        if (otherCollider.node.name === "Player") {
            // ====== TODO FIX
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.getComponent(cc.Animation).play("Explosion");
            // ======
            this.game.resetGame();
            this.game.playExplosionAnimation();
            // selfCollider.node.destroy();
                // otherCollider.node.destroy();
            }
    }

    setLaserScheduler(fireRate: number,initiateLaser: Function) {
        cc.director.getScheduler().schedule(initiateLaser, this, fireRate, false);
    }

    // Local x-pos from the center and velocity vector
    createLaser(xPos : number, velocityVector: cc.Vec2) {
        const newLaser = cc.instantiate(this.redLaser);
        // Relative to the current node. So center it.
        newLaser.setPosition(xPos, -this.node.height / 2);
        const body = newLaser.getComponent(cc.RigidBody);
         (180 / Math.PI)
        body.linearVelocity = velocityVector;
        this.node.addChild(newLaser);
        const laserObject = newLaser.getComponent('LaserRed');
        // Game from the superclass.
        laserObject.game = this.game;
    }

    // Just a hack to get the angle, need to read more about
    // the coordinate system and how angles work in cocos
    // Works for now.
    getAngle() {
        let angle = Math.atan2(this.game.player.y - this.node.y, this.game.player.x - this.node.x) * -180 / Math.PI;
        return angle - 90;
    }
    // ============== Animation trigger functions ==============
    destroySelf() {
        this.node.destroy();
    }
}
