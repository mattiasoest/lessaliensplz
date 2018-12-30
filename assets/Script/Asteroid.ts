import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Asteroid extends cc.Component {
    private rotationSpeed: number = 100;
    private velocity: number = 100;
    // LIFE-CYCLE CALLBACKS:
    private rotationDir = 1;
    private lowerBound: number = 0;
    private cvs: cc.Node = null;

    game: Game = null;

    onLoad () {
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
            this.velocity *= 2.2 
        }
    }

    start () {

    }

    update (dt) {
        if (cc.isValid(this.node)) {
            this.node.rotation += this.rotationSpeed * dt * this.rotationDir;
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    }
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "LaserBlue") {
            this.game.playRockExplosion();
            selfCollider.node.destroy();
            otherCollider.node.destroy();
        }
        else if (otherCollider.node.name === "Player") {
            console.log("PLAYER ASTEROID CONTACT");
            this.game.resetGame();
            // this.game.playExplosion();
            selfCollider.node.destroy();
                // otherCollider.node.destroy();
            }
    }
}
