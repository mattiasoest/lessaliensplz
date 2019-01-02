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
        _this.game = null;
        return _this;
    }
    Menu.prototype.onLoad = function () {
        this.startButton.node.on('click', this.startCallback, this);
        this.creditsButton.node.on('click', this.creditsCallback, this);
        this.exitButton.node.on('click', this.exitCallback, this);
    };
    Menu.prototype.start = function () {
    };
    // update (dt) {}
    // Button event callbacks
    Menu.prototype.startCallback = function () {
        this.game.startGame();
    };
    Menu.prototype.creditsCallback = function () {
        this.game.startBgMusic();
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
        property(Game_1.default)
    ], Menu.prototype, "game", void 0);
    Menu = __decorate([
        ccclass
    ], Menu);
    return Menu;
}(cc.Component));
exports.default = Menu;

cc._RF.pop();