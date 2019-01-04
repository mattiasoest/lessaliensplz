const {ccclass, property} = cc._decorator;

import Game from "./Game";

@ccclass
export default class LaserRed extends cc.Component {
    private playerFireSound: cc.AudioSource = null;
    private lowerBound: number = 0;
    private leftBound : number = 0;
    private rightBound: number = 0; 
    private upperBound: number = 0;


    private cvs : cc.Node = null;
    game: Game = null;

    onLoad () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height;
        this.leftBound = -this.cvs.width;
        this.rightBound = this.cvs.width;
        this.upperBound = this.cvs.height;
    }

    // start () {
    // }

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.isOutOfBounds()) {
                this.node.destroy();
            }
        }
    }

    isOutOfBounds() {
        return this.node.y < this.lowerBound || this.node.y > this.upperBound ||
            this.node.x < this.leftBound || this.node.x > this.rightBound;
    }
    
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            selfCollider.node.destroy();
            let isAlive = this.game.isPlayerAlive();
            if (!this.game.getPlayerObject().isInvincible() && isAlive) {
                this.game.resetGame();
            }
        }
    }

    playLaserSound() {
        this.playerFireSound.play();
    }
}
