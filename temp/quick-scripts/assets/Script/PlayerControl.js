(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/PlayerControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5876eqkI9FAZ4iTPktPRGg4', 'PlayerControl', __filename);
// Script/PlayerControl.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PlayerControl = /** @class */ (function (_super) {
    __extends(PlayerControl, _super);
    function PlayerControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Keys for acceleration movement
        _this.accLeft = false;
        _this.accRight = false;
        _this.accUp = false;
        _this.accDown = false;
        // X / Y bounds for the player
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.upperBound = 0;
        _this.lowerBound = 0;
        _this.xSpeed = 0;
        _this.ySpeed = 0;
        _this.cvs = null;
        _this.game = null;
        // Constants
        _this.X_ACCELERATION = 3200;
        _this.Y_ACCELERATION = 1800;
        _this.MAX_SPEED = 200;
        _this.DAMP = 0.8;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    PlayerControl.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
        this.upperBound = 0;
        this.lowerBound = this.node.height / 2 - this.cvs.height / 2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    };
    // start () {
    // }
    PlayerControl.prototype.update = function (dt) {
        // === X-AXIS ===
        if (this.accLeft) {
            this.xSpeed -= this.X_ACCELERATION * dt;
        }
        else if (this.accRight) {
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
        }
        else if (this.accUp) {
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
    };
    PlayerControl.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
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
    };
    PlayerControl.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
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
    };
    PlayerControl = __decorate([
        ccclass
    ], PlayerControl);
    return PlayerControl;
}(cc.Component));
exports.default = PlayerControl;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PlayerControl.js.map
        