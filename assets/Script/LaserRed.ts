const {ccclass, property} = cc._decorator;

import Game from "./Game";

@ccclass
export default class LaserRed extends cc.Component {
    private playerFireSound: cc.AudioSource = null;
    private lowerBound: number = 0;
    private cvs : cc.Node = null;
    game: Game = null;

    onLoad () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
    }

    // start () {
    // }

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y < -this.lowerBound) {
                // this.node.destroy();
            }
        }
    }
    
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            otherCollider.getComponent(cc.Animation).play("Explosion");
            selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    }

    playLaserSound() {
        this.playerFireSound.play();
    }
}
