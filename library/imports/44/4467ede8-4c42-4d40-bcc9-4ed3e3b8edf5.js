"use strict";
cc._RF.push(module, '4467e3oTEJNQLzJTtPjuO31', 'CloudScroll');
// Script/CloudScroll.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CloudScroll = /** @class */ (function (_super) {
    __extends(CloudScroll, _super);
    function CloudScroll() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lowBound = -252;
        _this.resetPos = 3134;
        _this.scrollSpeed = 115;
        return _this;
    }
    // onLoad () {}
    // start () {
    // }
    CloudScroll.prototype.update = function (dt) {
        this.node.setPosition(this.node.position.x, this.node.position.y - this.scrollSpeed * dt);
        if (this.node.getPosition().y <= this.lowBound - this.node.height) {
            this.node.setPosition(this.node.position.x, this.resetPos);
        }
    };
    CloudScroll = __decorate([
        ccclass
    ], CloudScroll);
    return CloudScroll;
}(cc.Component));
exports.default = CloudScroll;

cc._RF.pop();