"use strict";
cc._RF.push(module, '5d0a96wl7NMW7hpuLjYlKEf', 'Menu');
// Script/Menu.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("./Game");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startButton = null;
        _this.creditsButton = null;
        _this.exitButton = null;
        _this.howToButton = null;
        _this.creditsLabel = null;
        _this.howToPlayLabel = null;
        _this.highScoreLabel = null;
        _this.mainTitleLabel = null;
        _this.buttonSound = null;
        _this.game = null;
        _this.isCreditsOpen = false;
        _this.ishowToOpen = false;
        _this.creditsAction = null;
        _this.howToAction = null;
        return _this;
    }
    Menu.prototype.onLoad = function () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.howToButton.node.on('click', this.howToCallback, this);
        this.creditsLabel.enabled = false;
        this.creditsLabel.node.opacity = 0;
        this.howToPlayLabel.enabled = false;
        this.howToPlayLabel.node.opacity = 0;
    };
    Menu.prototype.start = function () {
        this.mainTitleLabel.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.9), cc.delayTime(0.3), cc.fadeOut(0.9))));
    };
    Menu.prototype.update = function (dt) {
    };
    // Button event callbacks
    Menu.prototype.startCallback = function () {
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = false;
        this.howToPlayLabel.enabled = false;
        this.game.startGame();
    };
    Menu.prototype.creditsCallback = function () {
        var _this = this;
        this.creditsLabel.node.on(cc.Node.EventType.TOUCH_START, function () { return _this.infoScreenIstouched(); });
        this.isCreditsOpen = true;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = true;
        this.node.active = false;
        this.creditsAction = this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75), cc.delayTime(6), cc.fadeOut(0.75), cc.callFunc(function () {
            _this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
            _this.isCreditsOpen = false;
            _this.node.active = true;
        })));
    };
    Menu.prototype.howToCallback = function () {
        var _this = this;
        this.howToPlayLabel.node.on(cc.Node.EventType.TOUCH_START, function () { return _this.infoScreenIstouched(); });
        this.ishowToOpen = true;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.howToPlayLabel.enabled = true;
        this.node.active = false;
        this.howToAction = this.howToPlayLabel.node.runAction(cc.sequence(cc.fadeIn(0.75), cc.delayTime(6), cc.fadeOut(0.75), cc.callFunc(function () {
            _this.howToPlayLabel.node.off(cc.Node.EventType.TOUCH_START);
            _this.ishowToOpen = false;
            _this.node.active = true;
        })));
    };
    Menu.prototype.infoScreenIstouched = function () {
        if (this.isCreditsOpen) {
            this.isCreditsOpen = false;
            this.creditsLabel.node.stopAction(this.creditsAction);
            this.node.active = true;
            this.creditsLabel.node.opacity = 0;
            this.creditsLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.creditsLabel.enabled = false;
        }
        else if (this.ishowToOpen) {
            this.ishowToOpen = false;
            this.howToPlayLabel.node.stopAction(this.howToAction);
            this.node.active = true;
            this.howToPlayLabel.node.opacity = 0;
            this.howToPlayLabel.node.off(cc.Node.EventType.TOUCH_START);
            this.howToPlayLabel.enabled = false;
        }
    };
    Menu.prototype.exitCallback = function () {
        cc.audioEngine.stopAll();
        cc.game.end();
    };
    __decorate([
        property(cc.Button)
    ], Menu.prototype, "startButton", void 0);
    __decorate([
        property(cc.Button)
    ], Menu.prototype, "creditsButton", void 0);
    __decorate([
        property(cc.Button)
    ], Menu.prototype, "exitButton", void 0);
    __decorate([
        property(cc.Button)
    ], Menu.prototype, "howToButton", void 0);
    __decorate([
        property(cc.Label)
    ], Menu.prototype, "creditsLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Menu.prototype, "howToPlayLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Menu.prototype, "highScoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Menu.prototype, "mainTitleLabel", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Menu.prototype, "buttonSound", void 0);
    __decorate([
        property(Game_1.default)
    ], Menu.prototype, "game", void 0);
    Menu = __decorate([
        ccclass
    ], Menu);
    return Menu;
}(cc.Component));
exports.default = Menu;

cc._RF.pop();