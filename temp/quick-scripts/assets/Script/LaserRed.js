(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/LaserRed.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb9297UDt5L2prdvvPL0ZxT', 'LaserRed', __filename);
// Script/LaserRed.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LaserRed = /** @class */ (function (_super) {
    __extends(LaserRed, _super);
    function LaserRed() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerFireSound = null;
        _this.lowerBound = 0;
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.upperBound = 0;
        _this.cvs = null;
        _this.game = null;
        return _this;
    }
    LaserRed.prototype.onLoad = function () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height;
        this.leftBound = -this.cvs.width;
        this.rightBound = this.cvs.width;
        this.upperBound = this.cvs.height;
    };
    // start () {
    // }
    LaserRed.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.isOutOfBounds()) {
                this.node.destroy();
            }
        }
    };
    LaserRed.prototype.isOutOfBounds = function () {
        return this.node.y < this.lowerBound || this.node.y > this.upperBound ||
            this.node.x < this.leftBound || this.node.x > this.rightBound;
    };
    LaserRed.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "Player") {
            this.game.playRockExplosion();
            this.game.resetGame();
            otherCollider.getComponent(cc.Animation).play("Explosion");
            selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    };
    LaserRed.prototype.playLaserSound = function () {
        this.playerFireSound.play();
    };
    LaserRed = __decorate([
        ccclass
    ], LaserRed);
    return LaserRed;
}(cc.Component));
exports.default = LaserRed;

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
        //# sourceMappingURL=LaserRed.js.map
        