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

    @property(cc.Label)
    mainTitleLabel: cc.Label = null;

    @property(cc.AudioClip)
    buttonSound: cc.AudioClip = null;

    @property(Game)
    game : Game = null;

    private isCreditsRunning: boolean = false;
    private creditsAction: cc.Action = null;

    onLoad () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.creditsLabel.enabled = false;
        this.creditsLabel.node.opacity = 0;
        
    }

    start () {
        this.mainTitleLabel.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.9),cc.delayTime(0.3), cc.fadeOut(0.9))));
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
        this.creditsLabel.node.on(cc.Node.EventType.TOUCH_START, () => this.creditsIsTouched());
        this.isCreditsRunning = true;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = true;
        this.node.active = false;

        this.creditsAction = this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75),cc.delayTime(5), cc.fadeOut(0.75), 
            cc.callFunc(()=> {
            this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.isCreditsRunning = false;
            this.node.active = true
        })));

    }

    creditsIsTouched() {
        if (this.isCreditsRunning) {
            this.creditsLabel.node.stopAction(this.creditsAction);
            this.node.active = true
            this.creditsLabel.node.opacity = 0;
            this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
        }
    }

    exitCallback() {
        cc.audioEngine.stopAll();
        cc.game.end();
    }
}
