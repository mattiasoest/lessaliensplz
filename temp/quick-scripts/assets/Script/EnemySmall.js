(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/EnemySmall.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dc655HX+1dNh4HIwbFFoZOl', 'EnemySmall', __filename);
// Script/EnemySmall.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemySmall = /** @class */ (function (_super) {
    __extends(EnemySmall, _super);
    function EnemySmall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemySmall.prototype.start = function () {
        this.testFunction();
    };
    EnemySmall.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
    };
    EnemySmall = __decorate([
        ccclass
    ], EnemySmall);
    return EnemySmall;
}(Enemy_1.default));
exports.default = EnemySmall;

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
        //# sourceMappingURL=EnemySmall.js.map
        