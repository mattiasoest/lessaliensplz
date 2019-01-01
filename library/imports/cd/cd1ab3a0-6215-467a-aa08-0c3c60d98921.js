"use strict";
cc._RF.push(module, 'cd1abOgYhVGeqoIDDxg2Ykh', 'Game');
// Script/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // CONSTANTS
        _this.ASTEROID_SPAWN_RATE = 1.5;
        _this.COIN_SPAWN_RATE = 2;
        _this.AMMO_SPAWN_RATE = 7.1;
        _this.AMMO_PER_BOX = 8;
        _this.ENEMY_SPAWN_RATE = 8;
        // NORMAL INSTANCE VARIABLES
        _this.currentAmmo = _this.AMMO_PER_BOX;
        _this.coinScore = 0;
        _this.coinSound = null;
        _this.time = 0;
        _this.gravity = -70;
        _this.cvs = null;
        _this.scheduler = null;
        _this.scoreLabel = null;
        _this.timeLabel = null;
        _this.ammoLabel = null;
        _this.coin = null;
        _this.player = null;
        _this.playerLaser = null;
        _this.asteroid = null;
        _this.bigEnemy = null;
        _this.medEnemy = null;
        _this.smallEnemy = null;
        _this.playerAmmo = null;
        _this.noAmmoSound = null;
        _this.ammoPickupSound = null;
        _this.rockExpSound = null;
        _this.boomSound = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        this.cvs = cc.find("Canvas");
        // Setup physics engine.
        var physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);
        this.coinSound = this.getComponent(cc.AudioSource);
        // Push reference of the game object
        this.player.getComponent('PlayerControl').game = this;
        this.scheduler = cc.director.getScheduler();
        // Setup auto-generation of objects dynamically during gameplay
        this.setCoinScheduler();
        this.setAsteroidScheduler();
        this.setAmmoScheduler();
        this.setEnemyScheduler();
    };
    Game.prototype.start = function () {
        this.spawnRandomEnemy();
        this.spawnAmmo();
        this.spawnAsteroid();
        this.spawnCoin();
    };
    Game.prototype.update = function (dt) {
        this.time += dt;
        this.timeLabel.string = "Time: " + this.parseTime(this.time);
    };
    Game.prototype.resetGame = function () {
        this.playBoomSound();
        this.coinScore = 0;
        this.currentAmmo = this.AMMO_PER_BOX;
        this.time = 0;
        // Update the labels aswell, so we render w/ the new data
        this.scoreLabel.string = "Coins: " + this.coinScore;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
        this.timeLabel.string = "Time: " + this.time;
        // ACTUALLY RESETS EVERYTHING...... 
        // cc.director.loadScene('Gameplay');
    };
    Game.prototype.playRockExplosion = function () {
        cc.audioEngine.play(this.rockExpSound, false, 0.8);
    };
    Game.prototype.playExplosionAnimation = function () {
        this.player.getComponent(cc.Animation).play("Explosion");
    };
    Game.prototype.playBoomSound = function () {
        cc.audioEngine.play(this.boomSound, false, 0.5);
    };
    Game.prototype.generateRandomPos = function () {
        var randomX = Math.random() * this.cvs.width / 2;
        // set sign value
        randomX *= this.generateRandomSign();
        return cc.v2(randomX, this.cvs.height * 0.62);
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
        cc.audioEngine.play(this.ammoPickupSound, false, 1);
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
        if (this.currentAmmo <= 0) {
            cc.audioEngine.play(this.noAmmoSound, false, 1);
            return;
        }
        this.currentAmmo--;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
        var newLaser = cc.instantiate(this.playerLaser);
        newLaser.setPosition(this.player.x, this.player.y - this.player.height);
        // Leave a reference to the game object.
        var laserObject = newLaser.getComponent('LaserBlue');
        laserObject.game = this;
        var body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 450);
        this.node.addChild(newLaser);
        laserObject.playLaserSound();
    };
    Game.prototype.spawnAsteroid = function () {
        var newAsteroid = cc.instantiate(this.asteroid);
        this.node.addChild(newAsteroid);
        var pos = this.generateRandomPos();
        pos.x *= 0.77;
        newAsteroid.setPosition(pos);
        var body = newAsteroid.getComponent(cc.RigidBody);
        var yVel = -50 + Math.random() * -220;
        var xVel = (Math.random() + 1) * 20 * this.generateRandomSign();
        body.linearVelocity = cc.v2(xVel, yVel);
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
    Game.prototype.spawnRandomEnemy = function () {
        var newEnemy = null;
        var random = Math.random();
        if (random < 0.33) {
            newEnemy = cc.instantiate(this.smallEnemy);
            newEnemy.getComponent('EnemySmall').game = this;
        }
        else if (random <= 0.67) {
            newEnemy = cc.instantiate(this.medEnemy);
            newEnemy.getComponent('EnemyMedium').game = this;
        }
        else {
            newEnemy = cc.instantiate(this.bigEnemy);
            newEnemy.getComponent('EnemyBig').game = this;
        }
        this.node.addChild(newEnemy);
        newEnemy.setPosition(this.generateRandomPos());
    };
    // ========== SCHEDULERS ==========
    Game.prototype.setCoinScheduler = function () {
        this.scheduler.schedule(this.spawnCoin, this, this.COIN_SPAWN_RATE, false);
    };
    Game.prototype.setAsteroidScheduler = function () {
        this.scheduler.schedule(this.spawnAsteroid, this, this.ASTEROID_SPAWN_RATE, false);
    };
    Game.prototype.setAmmoScheduler = function () {
        this.scheduler.schedule(this.spawnAmmo, this, this.AMMO_SPAWN_RATE, false);
    };
    Game.prototype.setEnemyScheduler = function () {
        this.scheduler.schedule(this.spawnRandomEnemy, this, this.ENEMY_SPAWN_RATE, false);
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
    ], Game.prototype, "bigEnemy", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "medEnemy", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "smallEnemy", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "playerAmmo", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "noAmmoSound", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "ammoPickupSound", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "rockExpSound", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "boomSound", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();