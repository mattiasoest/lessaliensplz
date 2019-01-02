import InvincibleEffect from "./InvincibleEffect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    // CONSTANTS
    private readonly ASTEROID_SPAWN_RATE: number = 1.5;
    private readonly COIN_SPAWN_RATE: number = 1.55;
    private readonly AMMO_SPAWN_RATE: number = 7.1;
    private readonly AMMO_PER_BOX: number = 8;
    private readonly ENEMY_SPAWN_RATE: number = 8;
    private readonly INVINCIBLE_DURATION: number = 5;
    private readonly GAME_STATE = { PLAY : 0, MENU : 1 }

    currentState = this.GAME_STATE.MENU;

    // NORMAL INSTANCE VARIABLES
    private currentAmmo: number = this.AMMO_PER_BOX;
    private coinScore: number = 0;
    private coinSound: cc.AudioSource = null;
    private time: number = 0;
    private gravity: number = -70;
    private cvs: cc.Node = null;
    private scheduler : cc.Scheduler = null;
    private invincibleParticleObject: InvincibleEffect = null;
    private isAlive = true;
    private isBoundHit = false;
    private increaseOpacity = true;
    private isBoundAnimationPlaying: boolean = false;
    private boundTimer = 0;
    player: cc.Node = null;
    

    @property(cc.Node)
    menu: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    ammoLabel: cc.Label = null;

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
    boomSound: cc.AudioClip = null;

    @property(cc.Node)
    upperBound: cc.Node = null;


    onLoad () {
        this.cvs =  cc.find("Canvas");
        // Setup physics engine.
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);

        // this.createPlayer();

        this.enableLabels(false);
        this.coinSound = this.getComponent(cc.AudioSource);
        this.scheduler = cc.director.getScheduler();
        this.menu.active = true;
        this.upperBound.active = false;
    }

    start () {
    }

    update (dt) {
        switch (this.currentState) {
            case this.GAME_STATE.PLAY:
                this.checkTopBoundAnimation(dt);
                this.time+= dt;
                this.timeLabel.string = "Time: " + this.parseTime(this.time); 
                break;
            case this.GAME_STATE.MENU:
                break;
        }
           
    }

    startGame() {
        // ==========================================
        // ACTUALLY RESETS EVERYTHING...... 
        // cc.director.loadScene('Gameplay');
        this.createPlayer();
        // this.menu.enabled = false;
        this.menu.active = false;
        // buttonNodes.forEach((node => node.enabled = false));
        this.setupItemAutoGeneration();

        this.enableLabels(true);
        this.scoreLabel.string = "Coins: " + this.coinScore;
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;

        this.currentState = this.GAME_STATE.PLAY;
        this.upperBound.y = this.upperBound.height / 2 + this.getPlayerUpperBound() + this.player.height / 2;
        this.upperBound.active = true;
        this.upperBound.opacity = 0;
    }

    // ============================== TODO ========================================
    resetGame() {
        console.log("ONCE!");
        this.currentState = this.GAME_STATE.MENU;
        this.player.getComponent(cc.RigidBody).enabledContactListener = false;
        this.isAlive = false;
        this.coinScore = 0;
        this.currentAmmo = this.AMMO_PER_BOX;
        this.playBoomSound();
        this.endRandomGeneration();
        this.upperBound.opacity = 0;

        // Let animation finish etc..
        setTimeout(() => {
            this.node.destroyAllChildren();

            // this.currentState = this.GAME_STATE.PLAY;
            this.enableLabels(false);
            this.time = 0;
            this.menu.active = true;
            }, 2000);
        }

    hitBound() {        
        this.isBoundHit = true;    
    }

    checkTopBoundAnimation(dt) {
        if (this.isBoundHit) {
            this.isBoundHit = false;
            if (!this.isBoundAnimationPlaying) {
                this.isBoundAnimationPlaying = true;
            }
        }
        else if (this.isBoundAnimationPlaying) {
            if (this.increaseOpacity && this.upperBound.opacity < 220) {
                this.upperBound.opacity += 700 * dt;
            }
            else if(this.upperBound.opacity > 0) {
                this.increaseOpacity = false;
                this.upperBound.opacity -= 700 * dt;
            }
            else {
                this.upperBound.opacity = 0;
                this.increaseOpacity = true;
                this.isBoundAnimationPlaying = false;
            }
        }
    }

    enableLabels(isEnabled: boolean) {
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

    playBoomSound() {
        cc.audioEngine.play(this.boomSound, false, 0.5);
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
        if (this.coinScore >= 5) {
            this.coinScore = 0;
            this.invincibleParticleObject.startParticleEffect();
            this.player.getComponent("PlayerControl").makeInvincible();
        }
        this.scoreLabel.string = "Coins: " + this.coinScore;
    }

    addAmmo() {
        this.currentAmmo += this.AMMO_PER_BOX;
        cc.audioEngine.play(this.ammoPickupSound, false, 1);
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
    }

    parseTime(toBeParsed: number) {
        return Number(Math.round(toBeParsed * 100) / 100).toFixed(2);
    }

    // ========== DYNAMICALLY OBJECT CREATORS ==========

    createPlayer() {
        this.player = cc.instantiate(this.playerFab);
        this.node.addChild(this.player);
        // Push reference of the game object
        this.player.getComponent('PlayerControl').game = this;
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
        if (this.currentAmmo <= 0) {
            cc.audioEngine.play(this.noAmmoSound, false, 1);
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
        body.linearVelocity = cc.v2(0, 450);
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

    getInvincibleDuration() {
        return this.INVINCIBLE_DURATION;
    }

    getPlayerUpperBound() {
        return -this.cvs.height * 0.125;
    }


    isPlayerAlive() {
        return this.isAlive;
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
}
