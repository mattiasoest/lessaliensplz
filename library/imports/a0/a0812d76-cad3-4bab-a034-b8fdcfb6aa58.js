"use strict";
cc._RF.push(module, 'a081212ytNLq6A0uP3PtqpY', 'EnemyBig');
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