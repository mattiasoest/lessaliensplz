(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/EnemyBig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a081212ytNLq6A0uP3PtqpY', 'EnemyBig', __filename);
// Script/EnemyBig.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemyBig = /** @class */ (function (_super) {
    __extends(EnemyBig, _super);
    function EnemyBig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyBig.prototype.start = function () {
        this.testFunction();
    };
    EnemyBig.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
    };
    EnemyBig = __decorate([
        ccclass
    ], EnemyBig);
    return EnemyBig;
}(Enemy_1.default));
exports.default = EnemyBig;

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
        //# sourceMappingURL=EnemyBig.js.map
        