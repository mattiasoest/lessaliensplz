(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Asteroid.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9acbcqEilhC0YfW02UrMAh1', 'Asteroid', __filename);
// Script/Asteroid.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Asteroid = /** @class */ (function (_super) {
    __extends(Asteroid, _super);
    function Asteroid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotationSpeed = 100;
        _this.velocity = 100;
        // LIFE-CYCLE CALLBACKS:
        _this.rotationDir = 1;
        _this.lowerBound = 0;
        _this.cvs = null;
        _this.game = null;
        return _this;
    }
    Asteroid.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
        this.node.setScale(0.3);
        this.rotationDir *= Math.random() < 0.5 ? -1 : 1;
        if (Math.random() < 0.65) {
            this.rotationSpeed *= 2;
            this.velocity *= 1.5;
        }
        else {
            this.rotationSpeed *= 4.2;
            this.velocity *= 2.2;
        }
    };
    Asteroid.prototype.start = function () {
    };
    Asteroid.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            this.node.rotation += this.rotationSpeed * dt * this.rotationDir;
            if (this.node.y <= this.lowerBound) {
                this.node.destroy();
            }
        }
    };
    Asteroid.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "LaserBlue") {
            this.game.playRockExplosion();
            selfCollider.node.destroy();
            otherCollider.node.destroy();
        }
        else if (otherCollider.node.name === "Player") {
            console.log("PLAYER ASTEROID CONTACT");
            this.game.resetGame();
            // this.game.playExplosion();
            selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    };
    Asteroid = __decorate([
        ccclass
    ], Asteroid);
    return Asteroid;
}(cc.Component));
exports.default = Asteroid;

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
        //# sourceMappingURL=Asteroid.js.map
        