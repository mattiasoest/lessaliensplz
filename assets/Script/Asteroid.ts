import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Asteroid extends cc.Component {
    private rotationSpeed: number = 100;
    private rotationDir = 1;
    private lowerBound: number = 0;
    private leftBound: number = 0;
    private rightBound: number = 0;
    private cvs: cc.Node = null;

    game: Game = null;

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
        this.leftBound = -this.cvs.width / 2 - 40;
        this.rightBound = this.cvs.width / 2 + 40;
        this.node.setScale(0.3);
        this.rotationDir *= Math.random() < 0.5 ? -1 : 1;
    }

    // start () {}

    update (dt) {
        if (cc.isValid(this.node)) {
            this.node.rotation += this.rotationSpeed * dt * this.rotationDir;
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
            else {
                // X-Screen bounds
                if (this.node.x <= this.leftBound || this.node.x >= this.rightBound) {
                this.node.getComponent(cc.RigidBody);
                // Invert x-velocity so it bounces back
                let body = this.node.getComponent(cc.RigidBody);
                body.linearVelocity = cc.v2(body.linearVelocity.x * -1, body.linearVelocity.y);
                }
            }
        }
    }
    onBeginContact(contact, selfCollider, otherCollider) {
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
            this.game.playRockExplosion();
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            let isAlive = this.game.isPlayerAlive();
            if (!this.game.player.getComponent("PlayerControl").isInvincible() && isAlive) {
                // otherCollider.getComponent(cc.RigidBody).enabledContactListener = false;
                this.game.resetGame();
            }
            else {
                this.getComponent(cc.Animation).play("ExplosionLarger");
            }
        }
    }

    // ============== Animation trigger functions ==============
    destroySelf() {
        this.node.destroy();
    }
    selfScale() {
        this.node.setScale(1.4);
    }
}
