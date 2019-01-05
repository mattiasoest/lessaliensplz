"use strict";
cc._RF.push(module, '9a9196hALZDXKrGjO42rDx6', 'BgScroll');
// Script/BgScroll.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BgScroll = /** @class */ (function (_super) {
    __extends(BgScroll, _super);
    function BgScroll() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lowBound = -130;
        _this.scrollSpeed = 50;
        return _this;
    }
    // onLoad () {}
    // start () {
    // }
    BgScroll.prototype.update = function (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y - this.scrollSpeed * dt);
        if (this.node.getPosition().y <= this.lowBound - this.node.height) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this.node.height * 3);
        }
    };
    BgScroll = __decorate([
        ccclass
    ], BgScroll);
    return BgScroll;
}(cc.Component));
exports.default = BgScroll;

cc._RF.pop();