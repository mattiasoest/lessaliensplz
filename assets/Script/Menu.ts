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

    @property(cc.Label)
    creditsLabel: cc.Button = null;

    @property(Game)
    game : Game = null;

    onLoad () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.creditsLabel.enabled = false;
    }

    start () {
    }

    update (dt) {
    }

    // Button event callbacks
    startCallback() {
        this.creditsLabel.enabled = false;
        this.game.startGame();
    }

    creditsCallback() {
        this.creditsLabel.enabled = true;
        this.creditsLabel.node.opacity = 0;
        this.game.setMenuInteractable(false);
        this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75),cc.delayTime(2.5), cc.fadeOut(0.75)));
        this.node.runAction(cc.sequence(cc.fadeOut(0.4),cc.delayTime(3.25), cc.fadeIn(0.4),
             cc.callFunc(()=> this.game.setMenuInteractable(true))));
    }

    exitCallback() {
        cc.audioEngine.stopAll();
        cc.game.end();
    }
}
