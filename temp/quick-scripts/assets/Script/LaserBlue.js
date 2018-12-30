(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/LaserBlue.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '57af1WCawNKqa1Z6WuIFHUH', 'LaserBlue', __filename);
// Script/LaserBlue.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LaserBlue = /** @class */ (function (_super) {
    __extends(LaserBlue, _super);
    function LaserBlue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.playerFireSound = null;
        _this.game = null;
        return _this;
    }
    LaserBlue.prototype.onLoad = function () {
        this.playerFireSound = this.getComponent(cc.AudioSource);
    };
    LaserBlue.prototype.start = function () {
    };
    LaserBlue.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y > cc.find("Canvas").height / 2) {
                console.log("LASER DESTOEYED");
                this.node.destroy();
            }
        }
    };
    LaserBlue.prototype.playLaserSound = function () {
        this.playerFireSound.play();
    };
    LaserBlue = __decorate([
        ccclass
    ], LaserBlue);
    return LaserBlue;
}(cc.Component));
exports.default = LaserBlue;

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
        //# sourceMappingURL=LaserBlue.js.map
        