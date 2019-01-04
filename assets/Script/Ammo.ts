import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ammo extends cc.Component {
    private lowerBound: number = 0;

    game: Game = null;
    
    // onLoad () {
    // }

    start () {
        this.lowerBound = -this.game.getMainCanvas().height * 0.62;
    }

    update (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    }
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.addAmmo();
            selfCollider.node.destroy()
        }
    }
}
