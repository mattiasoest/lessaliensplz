import InvincibleEffect from "./InvincibleEffect";
import Player from "./Player";
import Menu from "./Menu";
import { GameEvent } from "./GameEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(Menu)
    menu: Menu = null;

    @property(cc.Node)
    statsNode: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    ammoLabel: cc.Label = null;

    @property(cc.Label)
    newHighScoreLabel: cc.Label = null;

    @property(cc.Label)
    counterLabel: cc.Label = null;

    @property(cc.Prefab)
    coin: cc.Prefab = null;

    @property(cc.Prefab)
    playerFab: cc.Prefab = null;

    @property(cc.Prefab)
    playerLaser: cc.Prefab = null;

    @property(cc.Prefab)
    redLaser: cc.Prefab = null;

    @property(cc.Prefab)
    asteroid: cc.Prefab = null;

    @property(cc.Prefab)
    bigEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    medEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    smallEnemy: cc.Prefab = null;

    @property(cc.Prefab)
    playerAmmo: cc.Prefab = null;

    @property(cc.AudioClip)
    noAmmoSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    ammoPickupSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    rockExpSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    highScoreSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    menuMusic: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameplayMusic: cc.AudioClip = null;

    @property(cc.AudioClip)
    upperBoundSound: cc.AudioClip = null;

    @property(cc.Node)
    upperBound: cc.Node = null;

    @property(cc.Node)
    lowerBound: cc.Node = null;

    // CONSTANTS
    private readonly BEST_TIME_KEY = "best_time";
    private readonly ASTEROID_SPAWN_RATE: number = 1.2;
    private readonly COIN_SPAWN_RATE: number = 1.45;
    private readonly AMMO_SPAWN_RATE: number = 7.1;
    private readonly AMMO_PER_BOX: number = 12;
    private readonly ENEMY_SPAWN_RATE: number = 8;
    private readonly INVINCIBLE_DURATION: number = 5;
    private readonly MOBILE_ACC_MULTIPLIER = 2.7;
    private readonly ACCELEROMETER_TILT_OFFSET: number = 0.32;
    public readonly GAME_STATE = { PLAY : 0, MENU : 1 }

    currentState = this.GAME_STATE.MENU;

    // NORMAL INSTANCE VARIABLES
    private currentAmmo: number = this.AMMO_PER_BOX;
    private coinScore: number = 0;
    private coinSound: cc.AudioSource = null;
    private time: number = 0;
    private gravity: number = -70;
    private cvs: cc.Node = null;
    private scheduler: cc.Scheduler = null;
    private invincibleParticleObject: InvincibleEffect = null;
    private isAlive = true;
    private isUpperBoundHit = false;
    private isLowerBoundHit = false;
    private increaseOpacity = true;
    private isUpperBoundAnimationPlaying: boolean = false;
    private isLowerBoundAnimationPlaying: boolean = false;
    private invincibleTimer: number = this.INVINCIBLE_DURATION;
    private boundId = -1;
    private justPlayedUpperBoundSound: boolean = false;
    private justPlayedLowerBoundSound: boolean = false;
    private playerObject: Player = null;
    private isMobile: boolean = false;
    private menuMusicId: number = -1;
    private gameMusicId: number = -1;
    private camera: cc.Camera = null;
    private bestTime: number = 0;

    // Variables for player acceleration movement
    // Gets set depending on input from the user
    private accLeft: boolean = false;
    private accRight: boolean = false;
    private accUp: boolean = false;
    private accDown: boolean = false;
    private xAccelerometer: number = 0;
    private yAccelerometer: number = 0;

    player: cc.Node = null;

    onLoad () {
        this.setisMobileDevice();
        this.cvs = cc.find("Canvas");
        // Setup physics engine.
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);

        // this.enableStatsLabels(false);
        this.newHighScoreLabel.node.opacity = 0;
        this.coinSound = this.getComponent(cc.AudioSource);
        this.coinSound.volume = 0.45;
        this.scheduler = cc.director.getScheduler();
        this.upperBound.active = false;
        this.lowerBound.active = false;
        this.resetInvincibleCounter();
        this.startBgMusic();
        this.checkLocalHighScore();

        this.menu.node.on(GameEvent.START_GAME, this.startGame, this);
        
        // =========== ADD MORE CONTROLS IF WE ARE RUNNING ON A MOBILE ===========
        if (this.isMobileDevice()) {
            cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
            cc.systemEvent.setAccelerometerEnabled(true);
            this.node.on(cc.Node.EventType.TOUCH_START, () => this.spawnBlueLaser());
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    startBgMusic() {
        this.menuMusicId = cc.audioEngine.playMusic(this.menuMusic, true);
        cc.audioEngine.setMusicVolume(0.4);
    }

    update (dt) {
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
    }

    getMainCanvas() {
        return this.cvs;
    }

    getPlayerObject() {
        return this.playerObject;
    }
    getInvincibleDuration() {
        return this.INVINCIBLE_DURATION;
    }

    getPlayerUpperBound() {
        return -this.cvs.height * 0.18;
    }

    isPlayerAlive() {
        return this.isAlive;
    }

    isMobileDevice() {
        return this.isMobile;
    }

    setisMobileDevice() {
        this.isMobile = cc.sys.isMobile;
    }

    getAccelerometerX() {
        return this.xAccelerometer
    }

    getAccelerometerY() {
        return this.yAccelerometer
    }

    isAccUp() {
        return this.accUp
    }

    isAccDown() {
        return this.accDown;
    }

    isAccLeft() {
        return this.accLeft
    }

    isAccRight() {
        return this.accRight;
    }

    startGame() {
        this.statsNode.active = true,
        this.setMenuInteractable(false);
        this.menu.node.active = false
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
    }

    setMenuInteractable(value: boolean) {
        let buttons = this.menu.getComponentsInChildren(cc.Button);
        buttons.forEach(button => {
            button.interactable = value;
        });
    }

    setGameState(state: number) {
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
    }

    resetGame() {
        this.resetInvincibleCounter();
        this.setGameState(this.GAME_STATE.MENU);
        this.playPlayerExplosionAnimation();
        this.player.getComponent(cc.RigidBody).enabledContactListener = false;
        this.isAlive = false;
        this.coinScore = 0;
        this.currentAmmo = this.AMMO_PER_BOX;
        this.endRandomGeneration();
        this.resetBoundEffectParameters()

        let delay = 0;
        if (this.time > this.bestTime) {
            this.bestTime = this.time;
            let timeout = 500;
            delay = timeout + 1100;
            this.menu.highScoreLabel.string = "High score: " + this.parseTime(this.bestTime, 2);
            this.saveLocalHighScore();
            setTimeout(() => {
                cc.audioEngine.play(this.highScoreSound, false, 1);
                // this.newHighScoreLaぶっとnel.enabled = true;
                this.newHighScoreLabel.string = "New high score: " + this.parseTime(this.bestTime, 2);
                this.newHighScoreLabel.node.runAction(cc.sequence(cc.fadeIn(0.45),cc.delayTime(0.8), cc.fadeOut(0.45)));
                
            }, timeout);
        }

        // Let animation finish etc..
        setTimeout(() => {
            this.node.destroyAllChildren();
            this.enableStatsLabels(false);
            this.time = 0;
            this.setMenuInteractable(true);
            this.menu.node.active = true;
        }, 1200 + delay);
    }

    resetBoundEffectParameters() {
        this.isUpperBoundAnimationPlaying = false;
        this.isLowerBoundAnimationPlaying = false;
        this.justPlayedLowerBoundSound = false;
        this.justPlayedUpperBoundSound = false;
        this.upperBound.opacity = 0;
        this.lowerBound.opacity = 0;
    }

    resetInvincibleCounter() {
        this.invincibleTimer = this.getInvincibleDuration();
        this.counterLabel.enabled = false;
    }

    resetInputAcceleration() {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.xAccelerometer = 0;
        this.yAccelerometer = 0;
    }
    
    hitBound(isUpperBound: boolean) {
        isUpperBound ? this.isUpperBoundHit = true : this.isLowerBoundHit = true;       
    }

    checkLocalHighScore() {
        let localBest = cc.sys.localStorage.getItem(this.BEST_TIME_KEY);
        if (localBest !== null) {
            this.bestTime = Number(localBest);
            this.menu.highScoreLabel.string = "High score: " + this.parseTime(this.bestTime, 2);
        }
    }

    saveLocalHighScore() {
        cc.sys.localStorage.setItem(this.BEST_TIME_KEY, this.bestTime);
    }

    playBoundEffect(isUpperBound: boolean) {
        if (isUpperBound) {
            if (!this.justPlayedUpperBoundSound) {
                this.justPlayedUpperBoundSound = true;
                this.boundId = cc.audioEngine.play(this.upperBoundSound, false, 1);
                this.hitBound(isUpperBound);
                    if (this.isMobileDevice()) {
                        cc.audioEngine.setFinishCallback(this.boundId,
                            () => this.yAccelerometer > 0 ? this.justPlayedUpperBoundSound = true : this.justPlayedUpperBoundSound = false);
                    }
                    else {
                        cc.audioEngine.setFinishCallback(this.boundId,
                            () => this.isAccUp ? this.justPlayedUpperBoundSound = true : this.justPlayedUpperBoundSound = false);
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
                        cc.audioEngine.setFinishCallback(this.boundId,
                            () => this.yAccelerometer < 0 ? this.justPlayedLowerBoundSound = true : this.justPlayedLowerBoundSound = false);
                    }
                    else {
                        cc.audioEngine.setFinishCallback(this.boundId,
                            () => this.isAccDown ? this.justPlayedLowerBoundSound = true : this.justPlayedLowerBoundSound = false);
                    }
                }
            }
    }

    checkTopBoundAnimation(dt: number) {
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
            else if(this.upperBound.opacity > 0) {
                this.increaseOpacity = false;
                this.upperBound.opacity -= 950 * dt;
            }
            else {
                this.upperBound.opacity = 0;
                this.increaseOpacity = true;
                this.isUpperBoundAnimationPlaying = false;
            }
        }
    }

    checkLowBoundAnimation(dt: number) {
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
            else if(this.lowerBound.opacity > 0) {
                this.increaseOpacity = false;
                this.lowerBound.opacity -= 950 * dt;
            }
            else {
                this.lowerBound.opacity = 0;
                this.increaseOpacity = true;
                this.isLowerBoundAnimationPlaying = false;
            }
        }
    }

    enableStatsLabels(isEnabled: boolean) {
        this.scoreLabel.enabled = isEnabled;
        this.timeLabel.enabled = isEnabled;
        this.ammoLabel.enabled = isEnabled;
    }

    playRockExplosion() {
        cc.audioEngine.play(this.rockExpSound, false, 0.8);
    }

    playPlayerExplosionAnimation() {
        this.player.getComponent(cc.Animation).play("Explosion");
    }

    generateRandomPos() {
        let randomX = Math.random() * this.cvs.width / 2;
        // set sign value
        randomX *= this.generateRandomSign();
        return cc.v2(randomX, this.cvs.height * 0.62);
    }

    generateRandomSign() {
        return Math.random() <= 0.5 ? -1 : 1;
    }

    updateCoinScore() {
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
    }

    addAmmo() {
        this.currentAmmo += this.AMMO_PER_BOX;
        cc.audioEngine.play(this.ammoPickupSound, false, 0.55);
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
    }

    parseTime(toBeParsed: number, decimals: number) {
        return Number(Math.round(toBeParsed * 100) / 100).toFixed(decimals);
    }

    // ========== DYNAMICALLY OBJECT CREATORS ==========
    createPlayer() {
        this.resetInputAcceleration();
        this.player = cc.instantiate(this.playerFab);
        this.node.addChild(this.player);
        this.playerObject = this.player.getComponent("Player");
        // Push reference of the game object
        this.playerObject.game = this;
        this.invincibleParticleObject = this.player.getChildByName("Particles").getComponent("InvincibleEffect");
        this.invincibleParticleObject.setDuration(this.INVINCIBLE_DURATION);
        this.isAlive = true;
    }

    spawnCoin() {
        const newCoin = cc.instantiate(this.coin);
        this.node.addChild(newCoin);
        newCoin.setPosition(this.generateRandomPos());

        // Leave a reference to the game object.
        newCoin.getComponent('Coin').game = this;
    }

    spawnBlueLaser() {
        if (!this.isAlive) {
            return;
        }
        if (this.currentAmmo <= 0) {
            cc.audioEngine.play(this.noAmmoSound, false, 0.8);
            return;
        }
        this.currentAmmo--;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
        const newLaser = cc.instantiate(this.playerLaser);
        newLaser.setPosition(this.player.x, this.player.y + this.player.height * 0.35);

        // Leave a reference to the game object.
        const laserObject = newLaser.getComponent('LaserBlue');
        laserObject.game = this;

        const body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 475);
        this.node.addChild(newLaser);
        laserObject.playLaserSound();
    }

    spawnEnemyLaser(xOffset: number, node: cc.Node, velocityVector: cc.Vec2) {
        const newLaser = cc.instantiate(this.redLaser);
        // Relative to the current node. So center it.
        newLaser.setPosition(node.x + xOffset, node.y -node.height / 2);
        const body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = velocityVector;
        // Set the bullets parent to the game object 
        // So they survive even if the enemy is killed
        // Gets destroyed later by its own laser logic
        this.node.addChild(newLaser);
        const laserObject = newLaser.getComponent('LaserRed');
        // Game from the superclass.
        laserObject.game = this;
    }

    spawnAsteroid() {
        const newAsteroid = cc.instantiate(this.asteroid);
        this.node.addChild(newAsteroid);
        let pos = this.generateRandomPos();
        pos.x *= 0.77;
        newAsteroid.setPosition(pos);

        const body = newAsteroid.getComponent(cc.RigidBody)
        const yVel = -50 + Math.random() * -220;
        let xVel = (Math.random() + 1) * 20  * this.generateRandomSign();
        body.linearVelocity = cc.v2(xVel , yVel);
        // Leave a reference to the game object.
        newAsteroid.getComponent('Asteroid').game = this;
    }

    spawnAmmo() {
        const newAmmoBox = cc.instantiate(this.playerAmmo);
        this.node.addChild(newAmmoBox);
        newAmmoBox.setPosition(this.generateRandomPos());
        const body = newAmmoBox.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, -95);
        // Leave a reference to the game object.
        newAmmoBox.getComponent('Ammo').game = this;
    }

    spawnRandomEnemy() {
        let newEnemy = null;
        const random = Math.random();
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
    }

    setupItemAutoGeneration() {
        this.setCoinScheduler();
        this.setAsteroidScheduler();
        this.setAmmoScheduler();
        this.setEnemyScheduler();

        // Spawn 1 set of each item without delay
        this.spawnRandomEnemy();
        this.spawnAmmo();
        this.spawnAsteroid();
        this.spawnCoin();
    }

    endRandomGeneration() {
        this.scheduler.unschedule(this.spawnCoin, this);
        this.scheduler.unschedule(this.spawnAsteroid, this);
        this.scheduler.unschedule(this.spawnAmmo, this);
        this.scheduler.unschedule(this.spawnRandomEnemy, this);
    }

    // ========== SCHEDULERS ==========
    setCoinScheduler() {
        this.scheduler.schedule(this.spawnCoin, this, this.COIN_SPAWN_RATE, false);
    }

    setAsteroidScheduler() {
        this.scheduler.schedule(this.spawnAsteroid, this, this.ASTEROID_SPAWN_RATE, false);
    }

    setAmmoScheduler() {
        this.scheduler.schedule(this.spawnAmmo, this, this.AMMO_SPAWN_RATE, false);
    }

    setEnemyScheduler() {
        this.scheduler.schedule(this.spawnRandomEnemy, this, this.ENEMY_SPAWN_RATE, false);
    }

    // ========== INPUT HANDLING ==========
    onKeyDown(event: cc.Event.EventKeyboard) {
        
        if (this.isPlayerAlive()) {
            switch(event.keyCode) {
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
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (this.isPlayerAlive()) {
            switch(event.keyCode) {
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
    }

    onDeviceMotionEvent(event: any) {
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
        if (this.yAccelerometer > 0 ) {
            this.justPlayedLowerBoundSound = false;
        }
    }
}
