import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    private coinSpeed: number = 125;
    private cvs: cc.Node = null;
    private lowerBound: number = 0;
    private hitBoxOffset: number = 15;

    private manager: cc.CollisionManager = cc.director.getCollisionManager();
    game: Game = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
    }

    start () {

    }

    update (dt) {
        // If it has not been destroyed and cocos trying to free its memory.
        if (cc.isValid(this.node)) {
            this.node.y -= this.coinSpeed * dt;
            let player = this.game.player;
            // This is an ugly hack for the collision detection
            // Tried to adjust  parameters until it had a good feel. 
            // Wanted to do oldschool collision before I started using the physics engine
            // So the Coin objects are currently NOT hooked up to the physics engine
            if (this.game.isPlayerAlive() && this.node.y - this.hitBoxOffset * 2 < player.y - player.height / 2 &&
                                                 this.node.y + this.hitBoxOffset > player.y - player.height * 1.5) {
                if (this.node.x < player.x + player.width && this.node.x > player.x - player.width) {
                    this.game.updateCoinScore();
                    this.node.destroy();
                }
            }

            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }

    }
}
