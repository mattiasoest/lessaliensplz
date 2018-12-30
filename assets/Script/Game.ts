const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    // CONSTANTS
    private readonly ASTEROID_SPAWN_RATE: number = 1.9;
    private readonly COIN_SPAWN_RATE: number = 4;
    private readonly AMMO_SPAWN_RATE: number = 2.5;
    private readonly AMMO_PER_BOX: number = 4;

    // NORMAL INSTANCE VARIABLES
    private currentAmmo: number = 2;
    private coinScore: number = 0;
    private coinSound: cc.AudioSource = null;
    private ammoPickupSound: cc.AudioSource = null;
    private time: number = 0;
    private gravity: number = -70;
    private cvs: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    ammoLabel: cc.Label = null;

    @property(cc.Prefab)
    coin: cc.Prefab = null

    @property(cc.Node)
    player: cc.Node = null

    @property(cc.Prefab)
    playerLaser: cc.Prefab = null

    @property(cc.Prefab)
    asteroid: cc.Prefab = null

    @property(cc.Prefab)
    playerAmmo: cc.Prefab = null

    onLoad () {
        this.cvs =  cc.find("Canvas");
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);


        this.coinSound = this.getComponent(cc.AudioSource);
        // Push reference of the game object
        this.player.getComponent('PlayerControl').game = this;

        // Setup auto-generation of objects dynamically during gameplay
        this.setCoinScheduler();
        this.setAsteroidScheduler();
        this.setAmmocheduler();
    }

    start () {
        this.spawnAmmo();
        this.spawnAsteroid();
        this.spawnCoin();
    }

    update (dt) {
        this.time+= dt;
        this.timeLabel.string = "Time: " + this.parseTime(this.time);
    }

    generateRandomPos() {
        let randomX = Math.random() * this.cvs.width / 2;
        // set sign value
        randomX *= this.generateRandomSign();
        return new cc.Vec2(randomX, this.cvs.height);
    }

    generateRandomSign() {
        return Math.random() <= 0.5 ? -1 : 1;
    }

    updateCoinScore() {
        this.coinScore++;
        this.coinSound.play();
        this.scoreLabel.string = "Coins: " + this.coinScore;
    }

    addAmmo() {
        this.currentAmmo += this.AMMO_PER_BOX;
        // this.ammoPickupSound.play();
        this.ammoLabel.string = "Ammo: " + this.currentAmmo;
    }

    parseTime(toBeParsed: number) {
        return Number(Math.round(toBeParsed * 100) / 100).toFixed(2);
    }

    // ========== DYNAMICALLY OBJECT CREATORS ==========
    spawnCoin() {
        const newCoin = cc.instantiate(this.coin);
        this.node.addChild(newCoin);
        newCoin.setPosition(this.generateRandomPos());

        // Leave a reference to the game object.
        newCoin.getComponent('Coin').game = this;
    }

    spawnBlueLaser() {
        const newLaser = cc.instantiate(this.playerLaser);
        newLaser.setPosition(this.player.x, this.player.y - this.player.height);

        // Leave a reference to the game object.
        const laserObject = newLaser.getComponent('LaserBlue');
        laserObject.game = this;

        const body = newLaser.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 350);
        this.node.addChild(newLaser);
        laserObject.playLaserSound();
        if (this.currentAmmo > 0) {
            this.currentAmmo--;
        }
    }

    spawnAsteroid() {
        const newAsteroid = cc.instantiate(this.asteroid);
        this.node.addChild(newAsteroid);
        let pos = this.generateRandomPos();
        pos.x *= 0.77;
        newAsteroid.setPosition(pos);

        const body = newAsteroid.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(20 * this.generateRandomSign(), -220)
        // Leave a reference to the game object.
        newAsteroid.getComponent('Asteroid').game = this;
    }

    spawnAmmo() {
        const newAmmoBox = cc.instantiate(this.playerAmmo);
        this.node.addChild(newAmmoBox);
        newAmmoBox.setPosition(this.generateRandomPos());
        const body = newAmmoBox.getComponent(cc.RigidBody)
        body.linearVelocity = cc.v2(0, -95)
        // Leave a reference to the game object.
        newAmmoBox.getComponent('Ammo').game = this;
    }

    // ========== SCHEDULERS ==========
    setCoinScheduler() {
        cc.director.getScheduler().schedule(this.spawnCoin, this, this.COIN_SPAWN_RATE, false);
    }

    setAsteroidScheduler() {
        cc.director.getScheduler().schedule(this.spawnAsteroid, this, this.ASTEROID_SPAWN_RATE, false);
    }

    setAmmocheduler() {
        cc.director.getScheduler().schedule(this.spawnAmmo, this, this.AMMO_SPAWN_RATE, false);
    }
}
