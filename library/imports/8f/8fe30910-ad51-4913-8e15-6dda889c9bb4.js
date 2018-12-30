"use strict";
cc._RF.push(module, '8fe30kQrVFJE44VbdqInJu0', 'Coin');
// Script/Coin.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.coinSpeed = 125;
        _this.cvs = null;
        _this.lowerBound = 0;
        _this.hitboxRadius = 12;
        _this.manager = cc.director.getCollisionManager();
        _this.game = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    Coin.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.manager.enabled = true;
        this.manager.enabledDebugDraw = true;
        this.manager.enabledDrawBoundingBox = true;
        this.lowerBound = -this.cvs.height * 0.62;
    };
    Coin.prototype.start = function () {
    };
    Coin.prototype.update = function (dt) {
        // If it has not been destroyed and cocos trying to free its memory.
        if (cc.isValid(this.node)) {
            this.node.y -= this.coinSpeed * dt;
            // Not been picked up by the player
            // if (this.getPlayerDistance() < this.hitbox) {
            var player = this.game.player;
            // This is an ugly hack for the collision detection
            // Tried to adjust  parameters until it had a good feel. 
            // Wanted to do oldschool collision before I started using the physics engine
            // So the Coin objects are NOT hooked up to the physics engine
            if (this.node.y - this.hitboxRadius / 2 < player.y - player.height / 2 && this.node.y + this.hitboxRadius > player.y - player.height * 1.5) {
                if (this.node.x < player.x + player.width && this.node.x > player.x - player.width) {
                    this.game.updateCoinScore();
                    this.node.destroy();
                }
            }
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    };
    Coin = __decorate([
        ccclass
    ], Coin);
    return Coin;
}(cc.Component));
exports.default = Coin;

cc._RF.pop();