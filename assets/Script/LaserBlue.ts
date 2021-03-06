const {ccclass, property} = cc._decorator;

import Game from "./Game";

@ccclass
export default class LaserBlue extends cc.Component {
    playerFireSound: cc.AudioSource = null;
    game: Game = null;

    onLoad () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
    }

    // start () {
    // }

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y > this.game.getMainCanvas().height * 0.6) {
                this.node.destroy();
            }
        }
    }
    
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Asteroid") {
            this.game.playRockExplosion();
            this.getComponent(cc.Animation).play("Explosion");
            otherCollider.node.destroy();
        }
    }

    playLaserSound() {
        this.playerFireSound.play();
    }
}
