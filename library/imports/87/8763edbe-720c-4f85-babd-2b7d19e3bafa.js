"use strict";
cc._RF.push(module, '8763e2+cgxPhbq9K30Z47r6', 'Camera');
// Script/Camera.ts

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.camera = null;
        return _this;
        // update (dt) {}
    }
    Camera.prototype.onLoad = function () {
        this.camera = this.node.getComponent(cc.Camera);
        this.node.width = 100;
        this.node.height = 100;
        console.log("WIN SIZE" + cc.winSize);
    };
    Camera.prototype.start = function () {
    };
    Camera = __decorate([
        ccclass
    ], Camera);
    return Camera;
}(cc.Component));
exports.default = Camera;

cc._RF.pop();