import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ammo extends cc.Component {
    private lowerBound: number = 0;
    private cvs: cc.Node = null;

    game: Game = null;
    onLoad () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
    }

    // start () {
    // }

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
