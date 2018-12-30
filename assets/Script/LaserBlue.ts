const {ccclass, property} = cc._decorator;

import Game from "./Game";

@ccclass
export default class LaserBlue extends cc.Component {
    playerFireSound: cc.AudioSource = null;
    game: Game = null;

    onLoad () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
    }

    start () {

    }

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y > cc.find("Canvas").height / 2) {
                console.log("LASER DESTOEYED");
                this.node.destroy();
            }
        }
    }

    playLaserSound() {
        this.playerFireSound.play();
    }

}
