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

    @property(cc.Label)
    highScoreLabel: cc.Label = null;

    @property(cc.AudioClip)
    buttonSound: cc.AudioClip = null;

    @property(Game)
    game : Game = null;

    onLoad () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.creditsLabel.enabled = false;
        this.creditsLabel.node.opacity = 0;
    }

    start () {
        this.game.getMainCanvas().opacity = 0;
        this.game.getMainCanvas().runAction(cc.fadeIn(0.5));
    }

    update (dt) {
    }

    // Button event callbacks
    startCallback() {
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = false;
        this.game.startGame();
    }

    creditsCallback() {
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = true;
        // this.game.setMenuInteractable(false);
        this.node.active = false;
        this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75),cc.delayTime(2.5), cc.fadeOut(0.75), cc.callFunc(()=> this.node.active = true)));
        // this.node.runAction(cc.sequence(cc.fadeOut(0.4),cc.delayTime(3.25), cc.fadeIn(0.4),
        //      cc.callFunc(()=> this.game.setMenuInteractable(true))));
    }

    exitCallback() {
        cc.audioEngine.stopAll();
        cc.game.end();
    }
}
