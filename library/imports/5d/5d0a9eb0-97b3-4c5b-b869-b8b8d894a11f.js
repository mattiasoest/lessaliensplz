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
        _this.creditsLabel = null;
        _this.buttonSound = null;
        _this.game = null;
        return _this;
    }
    Menu.prototype.onLoad = function () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
        this.creditsLabel.enabled = false;
    };
    Menu.prototype.start = function () {
    };
    Menu.prototype.update = function (dt) {
    };
    // Button event callbacks
    Menu.prototype.startCallback = function () {
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = false;
        this.game.startGame();
    };
    Menu.prototype.creditsCallback = function () {
        var _this = this;
        cc.audioEngine.play(this.buttonSound, false, 0.8);
        this.creditsLabel.enabled = true;
        this.creditsLabel.node.opacity = 0;
        // this.game.setMenuInteractable(false);
        this.node.active = false;
        this.creditsLabel.node.runAction(cc.sequence(cc.fadeIn(0.75), cc.delayTime(2.5), cc.fadeOut(0.75), cc.callFunc(function () { return _this.node.active = true; })));
        // this.node.runAction(cc.sequence(cc.fadeOut(0.4),cc.delayTime(3.25), cc.fadeIn(0.4),
        //      cc.callFunc(()=> this.game.setMenuInteractable(true))));
    };
    Menu.prototype.exitCallback = function () {
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.buttonSound, false, 0.8);
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
        property(cc.Label)
    ], Menu.prototype, "creditsLabel", void 0);
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