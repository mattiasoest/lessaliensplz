(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cd1abOgYhVGeqoIDDxg2Ykh', 'Game', __filename);
// Script/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // CONSTANTS
        _this.ASTEROID_SPAWN_RATE = 1.5;
        _this.COIN_SPAWN_RATE = 1.55;
        _this.AMMO_SPAWN_RATE = 7.1;
        _this.AMMO_PER_BOX = 8;
        _this.ENEMY_SPAWN_RATE = 8;
        _this.INVINCIBLE_DURATION = 5;
        _this.GAME_STATE = { PLAY: 0, MENU: 1 };
        _this.currentState = _this.GAME_STATE.PLAY;
        // NORMAL INSTANCE VARIABLES
        _this.currentAmmo = _this.AMMO_PER_BOX;
        _this.coinScore = 0;
        _this.coinSound = null;
        _this.time = 0;
        _this.gravity = -70;
        _this.cvs = null;
        _this.scheduler = null;
        _this.invincibleParticleObject = null;
        _this.isAlive = true;
        _this.player = null;
        _this.scoreLabel = null;
        _this.timeLabel = null;
        _this.ammoLabel = null;
        _this.coin = null;
        _this.playerFab = null;
        _this.playerLaser = null;
        _this.redLaser = null;
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
        this.createPlayer();
        this.coinSound = this.getComponent(cc.AudioSource);
        this.scheduler = cc.director.getScheduler();
        // Setup auto-generation of objects dynamically during gameplay
        this.setupItemAutoGeneration();
    };
    Game.prototype.start = function () { };
    Game.prototype.update = function (dt) {
        switch (this.currentState) {
            case this.GAME_STATE.PLAY:
                this.time += dt;
                this.timeLabel.string = "Time: " + this.parseTime(this.time);
                break;
            case this.GAME_STATE.MENU:
                break;
        }
    };
    // ============================== TODO ========================================
    Game.prototype.resetGame = function () {
        var _this = this;
        console.log("ONCE!");
        this.currentState = this.GAME_STATE.MENU;
        this.player.getComponent(cc.RigidBody).enabledContactListener = false;
        this.isAlive = false;
        this.coinScore = 0;
        this.currentAmmo = this.AMMO_PER_BOX;
        this.playBoomSound();
        this.endRandomGeneration();
        // Let animation finish etc..
        setTimeout(function () {
            _this.node.destroyAllChildren();
            // ==========================================
            // ACTUALLY RESETS EVERYTHING...... 
            // cc.director.loadScene('Gameplay');
            _this.setupItemAutoGeneration();
            _this.createPlayer();
            _this.currentState = _this.GAME_STATE.PLAY;
            _this.time = 0;
            // Update the labels aswell, so we render w/ the new data
            _this.scoreLabel.string = "Coins: " + _this.coinScore;
            _this.ammoLabel.string = "Ammo: " + _this.currentAmmo;
        }, 2000);
    };
    Game.prototype.playRockExplosion = function () {
        cc.audioEngine.play(this.rockExpSound, false, 0.8);
    };
    Game.prototype.playPlayerExplosionAnimation = function () {
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
        if (this.coinScore >= 5) {
            this.coinScore = 0;
            this.invincibleParticleObject.startParticleEffect();
            this.player.getComponent("PlayerControl").makeInvincible();
        }
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
    Game.prototype.createPlayer = function () {
        this.player = cc.instantiate(this.playerFab);
        this.node.addChild(this.player);
        // Push reference of the game object
        this.player.getComponent('PlayerControl').game = this;
        this.invincibleParticleObject = this.player.getChildByName("Particles").getComponent("InvincibleEffect");
        this.invincibleParticleObject.setDuration(this.INVINCIBLE_DURATION);
        this.isAlive = true;
    };
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
    Game.prototype.spawnEnemyLaser = function (xOffset, node, velocityVector) {
        var newLaser = cc.instantiate(this.redLaser);
        // Relative to the current node. So center it.
        newLaser.setPosition(node.x + xOffset, node.y - node.height / 2);
        var body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = velocityVector;
        // Set the bullets parent to the game object 
        // So they survive even if the enemy is killed
        // Gets destroyed later by its own laser logic
        this.node.addChild(newLaser);
        var laserObject = newLaser.getComponent('LaserRed');
        // Game from the superclass.
        laserObject.game = this;
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
    Game.prototype.getInvincibleDuration = function () {
        return this.INVINCIBLE_DURATION;
    };
    Game.prototype.isPlayerAlive = function () {
        return this.isAlive;
    };
    Game.prototype.setupItemAutoGeneration = function () {
        this.setCoinScheduler();
        this.setAsteroidScheduler();
        this.setAmmoScheduler();
        this.setEnemyScheduler();
        // Spawn 1 set of each item without delay
        this.spawnRandomEnemy();
        this.spawnAmmo();
        this.spawnAsteroid();
        this.spawnCoin();
    };
    Game.prototype.endRandomGeneration = function () {
        this.scheduler.unschedule(this.spawnCoin, this);
        this.scheduler.unschedule(this.spawnAsteroid, this);
        this.scheduler.unschedule(this.spawnAmmo, this);
        this.scheduler.unschedule(this.spawnRandomEnemy, this);
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
        property(cc.Prefab)
    ], Game.prototype, "playerFab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "playerLaser", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "redLaser", void 0);
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
        