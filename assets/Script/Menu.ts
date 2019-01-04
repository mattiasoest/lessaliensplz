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

    @property(cc.Button)
    howToButton: cc.Button = null;

    @property(cc.Label)
    creditsLabel: cc.Label = null;

    @property(cc.Label)
    howToPlayLabel: cc.Label = null;

    @property(cc.Label)
    highScoreLabel: cc.Label = null;

    @property(cc.Label)
    mainTitleLabel: cc.Label = null;

    @property(cc.AudioClip)
    buttonSound: cc.AudioClip = null;

    @property(Game)
    game : Game = null;

    private isCreditsOpen: boolean = false;
    private ishowToOpen: boolean = false;
    private creditsAction: cc.Action = null;
    private howToAction: cc.Action = null;

    onLoad () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.howToButton.node.on('click', this.howToCallback, this);
        this.creditsLabel.enabled = false;
        this.creditsLabel.node.opacity = 0;
        this.howToPlayLabel.enabled = false;
        this.howToPlayLabel.node.opacity = 0;
        
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
        this.howToPlayLabel.enabled = false;
        this.game.startGame();
    }

    creditsCallback() {
        this.creditsLabel.node.on(cc.Node.EventType.TOUCH_START, () => this.infoScreenIstouched());
        this.isCreditsOpen = true;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = true;
        this.node.active = false;

        this.creditsAction = this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75),cc.delayTime(6), cc.fadeOut(0.75), 
            cc.callFunc(()=> {
            this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.isCreditsOpen = false;
            this.node.active = true
        })));
    }

    howToCallback() {
        this.howToPlayLabel.node.on(cc.Node.EventType.TOUCH_START, () => this.infoScreenIstouched());
        this.ishowToOpen = true;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.howToPlayLabel.enabled = true;
        this.node.active = false;

        this.howToAction = this.howToPlayLabel.node.runAction(cc.sequence(cc.fadeIn(0.75),cc.delayTime(6), cc.fadeOut(0.75), 
            cc.callFunc(()=> {
            this.howToPlayLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.ishowToOpen = false;
            this.node.active = true
        })));
    }

    infoScreenIstouched() {
        if (this.isCreditsOpen) {
            this.isCreditsOpen = false;
            this.creditsLabel.node.stopAction(this.creditsAction);
            this.node.active = true
            this.creditsLabel.node.opacity = 0;
            this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.creditsLabel.enabled = false;
        }
        else if (this.ishowToOpen) {
            this.ishowToOpen = false;
            this.howToPlayLabel.node.stopAction(this.howToAction);
            this.node.active = true
            this.howToPlayLabel.node.opacity = 0;
            this.howToPlayLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.howToPlayLabel.enabled = false;
        }
    }

    exitCallback() {
        cc.audioEngine.stopAll();
        cc.game.end();
    }
}
