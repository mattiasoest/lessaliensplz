import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    private lowerBound: number = 0;
    private leftBound: number = 0;
    private rightBound: number = 0;
    private cvs: cc.Node = null;

    private hitPoints: number = 1;

    @property(cc.Prefab)
    redLaser: cc.Prefab = null;

    game: Game = null;

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
    }

    // start () {}

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y <= this.lowerBound) {
                console.log("ENEMY DESTROYED SUPER CLASS");
                this.node.destroy();
            }
            else {
                 // X-Screen bounds
                if (this.node.x <= this.leftBound - 30 || this.node.x >= this.rightBound +30) {
                    console.log("INVERT");
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
            console.log("PLAYER ASTEROID CONTACT");
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

    testFunction() {
        console.log("FROM SUPER CLASS");   
    }

    // ============== Animation trigger functions ==============
    destroySelf() {
        this.node.destroy();
    }
}
