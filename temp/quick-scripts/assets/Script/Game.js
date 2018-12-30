(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b2626S8HNdFw6z1S05i96WS', 'Game', __filename);
// Script/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // CONSTANTS
        _this.ASTEROID_SPAWN_RATE = 1.9;
        _this.COIN_SPAWN_RATE = 4;
        _this.AMMO_SPAWN_RATE = 2.5;
        _this.AMMO_PER_BOX = 4;
        // NORMAL INSTANCE VARIABLES
        _this.currentAmmo = 2;
        _this.coinScore = 0;
        _this.coinSound = null;
        _this.ammoPickupSound = null;
        _this.time = 0;
        _this.gravity = -70;
        _this.cvs = null;
        _this.scoreLabel = null;
        _this.timeLabel = null;
        _this.ammoLabel = null;
        _this.coin = null;
        _this.player = null;
        _this.playerLaser = null;
        _this.asteroid = null;
        _this.playerAmmo = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        var physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);
        this.coinSound = this.getComponent(cc.AudioSource);
        // Push reference of the game object
        this.player.getComponent('PlayerControl').game = this;
        // Setup auto-generation of objects dynamically during gameplay
        this.setCoinScheduler();
        this.setAsteroidScheduler();
        this.setAmmocheduler();
    };
    Game.prototype.start = function () {
        this.spawnAmmo();
        this.spawnAsteroid();
        this.spawnCoin();
    };
    Game.prototype.update = function (dt) {
        this.time += dt;
        this.timeLabel.string = "Time: " + this.parseTime(this.time);
    };
    Game.prototype.generateRandomPos = function () {
        var randomX = Math.random() * this.cvs.width / 2;
        // set sign value
        randomX *= this.generateRandomSign();
        return new cc.Vec2(randomX, this.cvs.height);
    };
    Game.prototype.generateRandomSign = function () {
        return Math.random() <= 0.5 ? -1 : 1;
    };
    Game.prototype.updateCoinScore = function () {
        this.coinScore++;
        this.coinSound.play();
        this.scoreLabel.string = "Coins: " + this.coinScore;
    };
    Game.prototype.addAmmo = function () {
        this.currentAmmo += this.AMMO_PER_BOX;
        // this.ammoPickupSound.play();
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
    };
    Game.prototype.parseTime = function (toBeParsed) {
        return Number(Math.round(toBeParsed * 100) / 100).toFixed(2);
    };
    // ========== DYNAMICALLY OBJECT CREATORS ==========
    Game.prototype.spawnCoin = function () {
        var newCoin = cc.instantiate(this.coin);
        this.node.addChild(newCoin);
        newCoin.setPosition(this.generateRandomPos());
        // Leave a reference to the game object.
        newCoin.getComponent('Coin').game = this;
    };
    Game.prototype.spawnBlueLaser = function () {
        var newLaser = cc.instantiate(this.playerLaser);
        newLaser.setPosition(this.player.x, this.player.y - this.player.height);
        // Leave a reference to the game object.
        var laserObject = newLaser.getComponent('LaserBlue');
        laserObject.game = this;
        var body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 350);
        this.node.addChild(newLaser);
        laserObject.playLaserSound();
        if (this.currentAmmo > 0) {
            this.currentAmmo--;
        }
    };
    Game.prototype.spawnAsteroid = function () {
        var newAsteroid = cc.instantiate(this.asteroid);
        this.node.addChild(newAsteroid);
        var pos = this.generateRandomPos();
        pos.x *= 0.77;
        newAsteroid.setPosition(pos);
        var body = newAsteroid.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(20 * this.generateRandomSign(), -220);
        // Leave a reference to the game object.
        newAsteroid.getComponent('Asteroid').game = this;
    };
    Game.prototype.spawnAmmo = function () {
        var newAmmoBox = cc.instantiate(this.playerAmmo);
        this.node.addChild(newAmmoBox);
        newAmmoBox.setPosition(this.generateRandomPos());
        var body = newAmmoBox.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, -95);
        // Leave a reference to the game object.
        newAmmoBox.getComponent('Ammo').game = this;
    };
    // ========== SCHEDULERS ==========
    Game.prototype.setCoinScheduler = function () {
        cc.director.getScheduler().schedule(this.spawnCoin, this, this.COIN_SPAWN_RATE, false);
    };
    Game.prototype.setAsteroidScheduler = function () {
        cc.director.getScheduler().schedule(this.spawnAsteroid, this, this.ASTEROID_SPAWN_RATE, false);
    };
    Game.prototype.setAmmocheduler = function () {
        cc.director.getScheduler().schedule(this.spawnAmmo, this, this.AMMO_SPAWN_RATE, false);
    };
    __decorate([
        property(cc.Label)
    ], Game.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Game.prototype, "timeLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Game.prototype, "ammoLabel", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "coin", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "player", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "playerLaser", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "asteroid", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "playerAmmo", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

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
        //# sourceMappingURL=Game.js.map
        