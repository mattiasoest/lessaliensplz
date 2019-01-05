"use strict";
cc._RF.push(module, 'cd1abOgYhVGeqoIDDxg2Ykh', 'Game');
// Script/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.menu = null;
        _this.scoreLabel = null;
        _this.timeLabel = null;
        _this.ammoLabel = null;
        _this.newHighScoreLabel = null;
        _this.counterLabel = null;
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
        _this.highScoreSound = null;
        _this.menuMusic = null;
        _this.gameplayMusic = null;
        _this.upperBoundSound = null;
        _this.upperBound = null;
        _this.lowerBound = null;
        // CONSTANTS
        _this.BEST_TIME_KEY = "best_time";
        _this.ASTEROID_SPAWN_RATE = 1.2;
        _this.COIN_SPAWN_RATE = 1.45;
        _this.AMMO_SPAWN_RATE = 7.1;
        _this.AMMO_PER_BOX = 12;
        _this.ENEMY_SPAWN_RATE = 8;
        _this.INVINCIBLE_DURATION = 5;
        _this.MOBILE_ACC_MULTIPLIER = 2.7;
        _this.ACCELEROMETER_TILT_OFFSET = 0.32;
        _this.GAME_STATE = { PLAY: 0, MENU: 1 };
        _this.currentState = _this.GAME_STATE.MENU;
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
        _this.isUpperBoundHit = false;
        _this.isLowerBoundHit = false;
        _this.increaseOpacity = true;
        _this.isUpperBoundAnimationPlaying = false;
        _this.isLowerBoundAnimationPlaying = false;
        _this.invincibleTimer = _this.INVINCIBLE_DURATION;
        _this.boundId = -1;
        _this.justPlayedUpperBoundSound = false;
        _this.justPlayedLowerBoundSound = false;
        _this.playerObject = null;
        _this.isMobile = false;
        _this.menuMusicId = -1;
        _this.gameMusicId = -1;
        _this.camera = null;
        _this.bestTime = 0;
        // Variables for player acceleration movement
        // Gets set depending on input from the user
        _this.accLeft = false;
        _this.accRight = false;
        _this.accUp = false;
        _this.accDown = false;
        _this.xAccelerometer = 0;
        _this.yAccelerometer = 0;
        _this.player = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        var _this = this;
        this.setisMobileDevice();
        this.cvs = cc.find("Canvas");
        // Setup physics engine.
        var physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);
        this.enableStatsLabels(false);
        this.newHighScoreLabel.node.opacity = 0;
        this.coinSound = this.getComponent(cc.AudioSource);
        this.coinSound.volume = 0.45;
        this.scheduler = cc.director.getScheduler();
        this.menu.active = true;
        this.upperBound.active = false;
        this.lowerBound.active = false;
        this.resetInvincibleCounter();
        this.startBgMusic();
        this.checkLocalHighScore();
        // =========== ADD MORE CONTROLS IF WE ARE RUNNING ON A MOBILE ===========
        if (this.isMobileDevice()) {
            cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
            cc.systemEvent.setAccelerometerEnabled(true);
            this.node.on(cc.Node.EventType.TOUCH_START, function () { return _this.spawnBlueLaser(); });
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    };
    Game.prototype.startBgMusic = function () {
        this.menuMusicId = cc.audioEngine.playMusic(this.menuMusic, true);
        cc.audioEngine.setMusicVolume(0.4);
    };
    Game.prototype.update = function (dt) {
        switch (this.currentState) {
            case this.GAME_STATE.PLAY:
                this.checkTopBoundAnimation(dt);
                this.checkLowBoundAnimation(dt);
                this.time += dt;
                this.timeLabel.string = "Time: " + this.parseTime(this.time, 2);
                if (this.playerObject.isInvincible()) {
                    this.invincibleTimer -= dt;
                    this.counterLabel.string = this.parseTime(this.invincibleTimer, 0);
                    if (this.invincibleTimer < 0) {
                        this.playerObject.makeNotInvincible();
                        this.resetInvincibleCounter();
                    }
                }
                break;
            case this.GAME_STATE.MENU:
                break;
        }
    };
    Game.prototype.getMainCanvas = function () {
        return this.cvs;
    };
    Game.prototype.getPlayerObject = function () {
        return this.playerObject;
    };
    Game.prototype.getInvincibleDuration = function () {
        return this.INVINCIBLE_DURATION;
    };
    Game.prototype.getPlayerUpperBound = function () {
        return -this.cvs.height * 0.18;
    };
    Game.prototype.isPlayerAlive = function () {
        return this.isAlive;
    };
    Game.prototype.isMobileDevice = function () {
        return this.isMobile;
    };
    Game.prototype.setisMobileDevice = function () {
        this.isMobile = cc.sys.isMobile;
    };
    Game.prototype.getAccelerometerX = function () {
        return this.xAccelerometer;
    };
    Game.prototype.getAccelerometerY = function () {
        return this.yAccelerometer;
    };
    Game.prototype.isAccUp = function () {
        return this.accUp;
    };
    Game.prototype.isAccDown = function () {
        return this.accDown;
    };
    Game.prototype.isAccLeft = function () {
        return this.accLeft;
    };
    Game.prototype.isAccRight = function () {
        return this.accRight;
    };
    Game.prototype.startGame = function () {
        this.setMenuInteractable(false);
        this.menu.active = false;
        this.createPlayer();
        this.setupItemAutoGeneration();
        this.enableStatsLabels(true);
        this.scoreLabel.string = "Coins: " + this.coinScore;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
        this.setGameState(this.GAME_STATE.PLAY);
        this.upperBound.y = this.upperBound.height / 2 + this.getPlayerUpperBound() + this.player.height / 2;
        this.upperBound.active = true;
        this.upperBound.opacity = 0;
        this.lowerBound.active = true;
        this.lowerBound.opacity = 0;
    };
    Game.prototype.setMenuInteractable = function (value) {
        var buttons = this.menu.getComponentsInChildren(cc.Button);
        buttons.forEach(function (button) {
            button.interactable = value;
        });
    };
    Game.prototype.setGameState = function (state) {
        switch (state) {
            case this.GAME_STATE.MENU:
                this.menuMusicId = cc.audioEngine.playMusic(this.menuMusic, true);
                this.currentState = state;
                break;
            case this.GAME_STATE.PLAY:
                this.gameMusicId = cc.audioEngine.playMusic(this.gameplayMusic, true);
                this.currentState = state;
                break;
            default:
                throw new Error("Invalid game state: " + state);
        }
    };
    Game.prototype.resetGame = function () {
        var _this = this;
        this.resetInvincibleCounter();
        this.setGameState(this.GAME_STATE.MENU);
        this.playPlayerExplosionAnimation();
        this.player.getComponent(cc.RigidBody).enabledContactListener = false;
        this.isAlive = false;
        this.coinScore = 0;
        this.currentAmmo = this.AMMO_PER_BOX;
        this.endRandomGeneration();
        this.resetBoundEffectParameters();
        var delay = 0;
        if (this.time > this.bestTime) {
            this.bestTime = this.time;
            var timeout = 500;
            delay = timeout + 1100;
            this.menu.getComponent("Menu").highScoreLabel.string = "High score: " + this.parseTime(this.bestTime, 2);
            this.saveLocalHighScore();
            setTimeout(function () {
                cc.audioEngine.play(_this.highScoreSound, false, 1);
                // this.newHighScoreLabel.enabled = true;
                _this.newHighScoreLabel.string = "New high score: " + _this.parseTime(_this.bestTime, 2);
                _this.newHighScoreLabel.node.runAction(cc.sequence(cc.fadeIn(0.45), cc.delayTime(0.8), cc.fadeOut(0.45)));
            }, timeout);
        }
        // Let animation finish etc..
        setTimeout(function () {
            _this.node.destroyAllChildren();
            _this.enableStatsLabels(false);
            _this.time = 0;
            _this.setMenuInteractable(true);
            _this.menu.active = true;
        }, 1200 + delay);
    };
    Game.prototype.resetBoundEffectParameters = function () {
        this.isUpperBoundAnimationPlaying = false;
        this.isLowerBoundAnimationPlaying = false;
        this.justPlayedLowerBoundSound = false;
        this.justPlayedUpperBoundSound = false;
        this.upperBound.opacity = 0;
        this.lowerBound.opacity = 0;
    };
    Game.prototype.resetInvincibleCounter = function () {
        this.invincibleTimer = this.getInvincibleDuration();
        this.counterLabel.enabled = false;
    };
    Game.prototype.resetInputAcceleration = function () {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.xAccelerometer = 0;
        this.yAccelerometer = 0;
    };
    Game.prototype.hitBound = function (isUpperBound) {
        isUpperBound ? this.isUpperBoundHit = true : this.isLowerBoundHit = true;
    };
    Game.prototype.checkLocalHighScore = function () {
        var localBest = cc.sys.localStorage.getItem(this.BEST_TIME_KEY);
        if (localBest !== null) {
            this.bestTime = Number(localBest);
            this.menu.getComponent("Menu").highScoreLabel.string = "High score: " + this.parseTime(this.bestTime, 2);
        }
    };
    Game.prototype.saveLocalHighScore = function () {
        cc.sys.localStorage.setItem(this.BEST_TIME_KEY, this.bestTime);
    };
    Game.prototype.playBoundEffect = function (isUpperBound) {
        var _this = this;
        if (isUpperBound) {
            if (!this.justPlayedUpperBoundSound) {
                this.justPlayedUpperBoundSound = true;
                this.boundId = cc.audioEngine.play(this.upperBoundSound, false, 1);
                this.hitBound(isUpperBound);
                if (this.isMobileDevice()) {
                    cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.yAccelerometer > 0 ? _this.justPlayedUpperBoundSound = true : _this.justPlayedUpperBoundSound = false; });
                }
                else {
                    cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.isAccUp ? _this.justPlayedUpperBoundSound = true : _this.justPlayedUpperBoundSound = false; });
                }
            }
        }
        else {
            if (!this.justPlayedLowerBoundSound) {
                this.justPlayedLowerBoundSound = true;
                this.boundId = cc.audioEngine.play(this.upperBoundSound, false, 1);
                this.hitBound(isUpperBound);
                //=============== TODO =============== 
                if (this.isMobileDevice()) {
                    cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.yAccelerometer < 0 ? _this.justPlayedLowerBoundSound = true : _this.justPlayedLowerBoundSound = false; });
                }
                else {
                    cc.audioEngine.setFinishCallback(this.boundId, function () { return _this.isAccDown ? _this.justPlayedLowerBoundSound = true : _this.justPlayedLowerBoundSound = false; });
                }
            }
        }
    };
    Game.prototype.checkTopBoundAnimation = function (dt) {
        if (this.isUpperBoundHit) {
            this.isUpperBoundHit = false;
            if (!this.isUpperBoundAnimationPlaying) {
                this.isUpperBoundAnimationPlaying = true;
            }
        }
        else if (this.isUpperBoundAnimationPlaying) {
            if (this.increaseOpacity && this.upperBound.opacity < 220) {
                this.upperBound.opacity += 950 * dt;
            }
            else if (this.upperBound.opacity > 0) {
                this.increaseOpacity = false;
                this.upperBound.opacity -= 950 * dt;
            }
            else {
                this.upperBound.opacity = 0;
                this.increaseOpacity = true;
                this.isUpperBoundAnimationPlaying = false;
            }
        }
    };
    Game.prototype.checkLowBoundAnimation = function (dt) {
        if (this.isLowerBoundHit) {
            this.isLowerBoundHit = false;
            if (!this.isLowerBoundAnimationPlaying) {
                this.isLowerBoundAnimationPlaying = true;
            }
        }
        else if (this.isLowerBoundAnimationPlaying) {
            if (this.increaseOpacity && this.lowerBound.opacity < 220) {
                this.lowerBound.opacity += 950 * dt;
            }
            else if (this.lowerBound.opacity > 0) {
                this.increaseOpacity = false;
                this.lowerBound.opacity -= 950 * dt;
            }
            else {
                this.lowerBound.opacity = 0;
                this.increaseOpacity = true;
                this.isLowerBoundAnimationPlaying = false;
            }
        }
    };
    Game.prototype.enableStatsLabels = function (isEnabled) {
        this.scoreLabel.enabled = isEnabled;
        this.timeLabel.enabled = isEnabled;
        this.ammoLabel.enabled = isEnabled;
    };
    Game.prototype.playRockExplosion = function () {
        cc.audioEngine.play(this.rockExpSound, false, 0.8);
    };
    Game.prototype.playPlayerExplosionAnimation = function () {
        this.player.getComponent(cc.Animation).play("Explosion");
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
        if (this.coinScore >= 10) {
            this.counterLabel.enabled = true;
            this.invincibleTimer = this.getInvincibleDuration();
            this.coinScore = 0;
            this.invincibleParticleObject.startParticleEffect();
            // If the player get enough coins while already
            // invincible, just increase the timers, dont have 
            // to start anything.
            if (!this.playerObject.isInvincible()) {
                this.playerObject.makeInvincible();
            }
        }
        this.scoreLabel.string = "Coins: " + this.coinScore;
    };
    Game.prototype.addAmmo = function () {
        this.currentAmmo += this.AMMO_PER_BOX;
        cc.audioEngine.play(this.ammoPickupSound, false, 0.55);
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
    };
    Game.prototype.parseTime = function (toBeParsed, decimals) {
        return Number(Math.round(toBeParsed * 100) / 100).toFixed(decimals);
    };
    // ========== DYNAMICALLY OBJECT CREATORS ==========
    Game.prototype.createPlayer = function () {
        this.resetInputAcceleration();
        this.player = cc.instantiate(this.playerFab);
        this.node.addChild(this.player);
        this.playerObject = this.player.getComponent("Player");
        // Push reference of the game object
        this.playerObject.game = this;
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
        if (!this.isAlive) {
            return;
        }
        if (this.currentAmmo <= 0) {
            cc.audioEngine.play(this.noAmmoSound, false, 0.8);
            return;
        }
        this.currentAmmo--;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
        var newLaser = cc.instantiate(this.playerLaser);
        newLaser.setPosition(this.player.x, this.player.y + this.player.height * 0.35);
        // Leave a reference to the game object.
        var laserObject = newLaser.getComponent('LaserBlue');
        laserObject.game = this;
        var body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 475);
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
    // ========== INPUT HANDLING ==========
    Game.prototype.onKeyDown = function (event) {
        if (this.isPlayerAlive()) {
            switch (event.keyCode) {
                case cc.macro.KEY.left:
                    if (!this.playerObject.isTurnLeftAnimationPlaying()) {
                        this.playerObject.playFlySound();
                        this.playerObject.setTurnLeftAnimationPlaying(true);
                        this.playerObject.getShipAnimations().play("PlayerLeft");
                    }
                    this.accLeft = true;
                    break;
                case cc.macro.KEY.right:
                    if (!this.playerObject.isTurnRightAnimationPlaying()) {
                        this.playerObject.playFlySound();
                        this.playerObject.setTurnRightAnimationPlaying(true);
                        this.playerObject.getShipAnimations().play("PlayerRight");
                    }
                    this.accRight = true;
                    break;
                case cc.macro.KEY.up:
                    this.justPlayedLowerBoundSound = false;
                    this.accUp = true;
                    break;
                case cc.macro.KEY.down:
                    this.justPlayedUpperBoundSound = false;
                    this.accDown = true;
                    break;
                case cc.macro.KEY.space:
                    break;
                case cc.macro.KEY.back:
                    cc.audioEngine.stopAll();
                    cc.game.end();
                    break;
            }
        }
    };
    Game.prototype.onKeyUp = function (event) {
        if (this.isPlayerAlive()) {
            switch (event.keyCode) {
                case cc.macro.KEY.left:
                    this.playerObject.setTurnLeftAnimationPlaying(false);
                    this.playerObject.getShipAnimations().play("PlayerNormal");
                    this.accLeft = false;
                    break;
                case cc.macro.KEY.right:
                    this.playerObject.setTurnRightAnimationPlaying(false);
                    this.playerObject.getShipAnimations().play("PlayerNormal");
                    this.accRight = false;
                    break;
                case cc.macro.KEY.up:
                    this.accUp = false;
                    break;
                case cc.macro.KEY.down:
                    this.accDown = false;
                    break;
                case cc.macro.KEY.space:
                    this.spawnBlueLaser();
                    break;
            }
        }
    };
    Game.prototype.onDeviceMotionEvent = function (event) {
        this.xAccelerometer = event.acc.x;
        this.yAccelerometer = event.acc.y;
        // Normal player holds the device in a tilted state
        // Adjust the y for better "feel"
        this.yAccelerometer += this.ACCELEROMETER_TILT_OFFSET;
        // Cap it to 1 /  this.MOBILE_ACC_MULTIPLIER angle of the device
        if (Math.abs(this.xAccelerometer) > (1 / this.MOBILE_ACC_MULTIPLIER)) {
            this.xAccelerometer = Math.sign(this.xAccelerometer) * (1 / this.MOBILE_ACC_MULTIPLIER);
        }
        if (Math.abs(this.yAccelerometer) > (1 / this.MOBILE_ACC_MULTIPLIER)) {
            this.yAccelerometer = Math.sign(this.yAccelerometer) * (1 / this.MOBILE_ACC_MULTIPLIER);
        }
        this.xAccelerometer *= this.MOBILE_ACC_MULTIPLIER;
        this.yAccelerometer *= this.MOBILE_ACC_MULTIPLIER;
        if (this.yAccelerometer < 0) {
            this.justPlayedUpperBoundSound = false;
        }
        if (this.yAccelerometer > 0) {
            this.justPlayedLowerBoundSound = false;
        }
    };
    __decorate([
        property(cc.Node)
    ], Game.prototype, "menu", void 0);
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
        property(cc.Label)
    ], Game.prototype, "newHighScoreLabel", void 0);
    __decorate([
        property(cc.Label)
    ], Game.prototype, "counterLabel", void 0);
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
    ], Game.prototype, "highScoreSound", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "menuMusic", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "gameplayMusic", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Game.prototype, "upperBoundSound", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "upperBound", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "lowerBound", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();