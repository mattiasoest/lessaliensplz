import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    // Keys for acceleration movement
    private accLeft: boolean = false;
    private accRight: boolean = false;
    private accUp: boolean = false;
    private accDown: boolean = false;

    // X / Y bounds for the player
    private leftBound: number = 0;
    private rightBound: number = 0;
    private upperBound: number = 0;
    private lowerBound: number = 0;

    private xSpeed: number = 0;
    private ySpeed: number = 0;

    private cvs: cc.Node  = null;

    game : Game = null;
    // Constants
    private readonly X_ACCELERATION: number = 3200;
    private readonly Y_ACCELERATION: number = 1800;
    private readonly MAX_SPEED: number = 200;
    private readonly DAMP: number = 0.8;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cvs = cc.find("Canvas");
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
        this.upperBound = 0;
        this.lowerBound = this.node.height / 2 -this.cvs.height / 2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    // start () {
    // }

    update (dt) {
        // === X-AXIS ===
        if (this.accLeft) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        } else if (this.accRight) {
            this.xSpeed += this.X_ACCELERATION * dt;
        }
        this.node.x += this.xSpeed * dt;
        this.xSpeed *= this.DAMP;

        // X-Screen bounds
        if (this.node.x <= this.leftBound) {
            this.node.x = this.leftBound;
        }
        else if (this.node.x >= this.rightBound) {
            this.node.x = this.rightBound;
        }

        // === Y-AXIS ===
        if (this.accDown) {
            this.ySpeed -= this.Y_ACCELERATION * dt;
        } else if (this.accUp) {
            this.ySpeed += this.Y_ACCELERATION * dt;
        }
        // cap the speed
        // if (Math.abs(this.xSpeed) > this.maxSpeed) {
        //     console.log("MAXLOOOL");
        //     this.xSpeed = Math.sign(this.xSpeed);
        // }
        this.node.y += this.ySpeed * dt;
        this.ySpeed *= this.DAMP;

        // Y-Screen bounds
        if (this.node.y <= this.lowerBound) {
            this.node.y = this.lowerBound;
        }
        else if (this.node.y >= this.upperBound) {
            this.node.y = this.upperBound;
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.accLeft = true;
                break;
            case cc.macro.KEY.right:
                this.accRight = true;
                break;
            case cc.macro.KEY.up:
                this.accUp = true;
                break;
            case cc.macro.KEY.down:
                this.accDown = true;
                break;
            case cc.macro.KEY.space:
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
            case cc.macro.KEY.up:
                this.accUp = false;
                break;
            case cc.macro.KEY.down:
                this.accDown = false;
                break;
            case cc.macro.KEY.space:
                this.game.spawnBlueLaser();
                break;
        }
    }
}
