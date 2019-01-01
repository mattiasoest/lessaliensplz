(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Enemy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1abedOjLYFGuJMK6/BE15jr', 'Enemy', __filename);
// Script/Enemy.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lowerBound = 0;
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.cvs = null;
        _this.hitPoints = 1;
        _this.redLaser = null;
        _this.game = null;
        return _this;
    }
    Enemy.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        this.lowerBound = -this.cvs.height * 0.62;
        this.leftBound = -this.cvs.width / 2;
        this.rightBound = this.cvs.width / 2;
    };
    // start () {}
    Enemy.prototype.update = function (dt) {
        if (cc.isValid(this.node)) {
            if (this.node.y <= this.lowerBound) {
                console.log("ENEMY DESTROYED SUPER CLASS");
                this.node.destroy();
            }
            else {
                // X-Screen bounds
                if (this.node.x <= this.leftBound - 30 || this.node.x >= this.rightBound + 30) {
                    console.log("INVERT");
                    this.node.getComponent(cc.RigidBody);
                    // Invert x-velocity so it bounces back
                    var body = this.node.getComponent(cc.RigidBody);
                    body.linearVelocity = cc.v2(body.linearVelocity.x * -1, body.linearVelocity.y);
                }
            }
        }
    };
    Enemy.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === "LaserBlue") {
            this.game.playRockExplosion();
            otherCollider.node.destroy();
            if (this.hitPoints > 0) {
                this.hitPoints--;
            }
            else {
                // Turn off just the hitbox since we will destroy the whole node after we are done with the animation.
                this.node.getComponent(cc.RigidBody).enabledContactListener = false;
                this.getComponent(cc.Animation).play("Explosion");
            }
        }
        if (otherCollider.node.name === "Player") {
            console.log("PLAYER ASTEROID CONTACT");
            // ====== TODO FIX
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.getComponent(cc.Animation).play("Explosion");
            // ======
            this.game.resetGame();
            this.game.playExplosionAnimation();
            // selfCollider.node.destroy();
            // otherCollider.node.destroy();
        }
    };
    Enemy.prototype.testFunction = function () {
        console.log("FROM SUPER CLASS");
    };
    // ============== Animation trigger functions ==============
    Enemy.prototype.destroySelf = function () {
        this.node.destroy();
    };
    __decorate([
        property(cc.Prefab)
    ], Enemy.prototype, "redLaser", void 0);
    Enemy = __decorate([
        ccclass
    ], Enemy);
    return Enemy;
}(cc.Component));
exports.default = Enemy;

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
        //# sourceMappingURL=Enemy.js.map
        