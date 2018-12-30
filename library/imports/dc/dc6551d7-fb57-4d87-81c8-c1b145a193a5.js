"use strict";
cc._RF.push(module, 'dc655HX+1dNh4HIwbFFoZOl', 'EnemySmall');
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