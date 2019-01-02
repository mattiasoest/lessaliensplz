import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {


    @property(cc.Button)
    startButton: cc.Button = null;

    @property(cc.Button)
    creditsButton: cc.Button = null;

    @property(cc.Button)
    exitButton: cc.Button = null;

    @property(Game)
    game : Game = null;

    onLoad () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
    }

    // start () {}

    // update (dt) {}

    // Button event callbacks
    startCallback() {
        this.game.startGame();

    }

    creditsCallback() {

    }

    exitCallback() {
        cc.audioEngine.stopAll();
        cc.game.end();
    }
}
