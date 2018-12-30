(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/EnemyMedium.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4a125VrSXlFmpYUFnW+uzHO', 'EnemyMedium', __filename);
// Script/EnemyMedium.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Enemy_1 = require("./Enemy");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EnemyMedium = /** @class */ (function (_super) {
    __extends(EnemyMedium, _super);
    function EnemyMedium() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyMedium.prototype.start = function () {
        this.testFunction();
    };
    EnemyMedium.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
    };
    EnemyMedium = __decorate([
        ccclass
    ], EnemyMedium);
    return EnemyMedium;
}(Enemy_1.default));
exports.default = EnemyMedium;

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
        //# sourceMappingURL=EnemyMedium.js.map
        