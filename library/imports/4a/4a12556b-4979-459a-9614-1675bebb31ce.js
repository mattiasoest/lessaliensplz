"use strict";
cc._RF.push(module, '4a125VrSXlFmpYUFnW+uzHO', 'EnemyMedium');
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