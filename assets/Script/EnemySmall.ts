import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemySmall extends Enemy {

    private readonly FIRE_RATE = 1.8;
    private readonly BULLET_BURST = 5;
    private readonly LASER_INTERVAL = 0.04;
    private readonly X_ACCELERATION = 850;
    private readonly Y_SPEED = -70; 
    private readonly LASER_SPEED: number = 270;

    private laserSound: cc.AudioSource = null;
    private isBurstOn: boolean =  false;
    private burstTimer: number = 0;
    private numberOfBulletsFired = 0;

    start () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.hitPoints = 0;
        super.setLaserScheduler(this.FIRE_RATE, this.initiateLaser);
    }

    update (dt) {
        super.update(dt);
        this.node.rotation = super.getAngle();
        super.updateShip(this.X_ACCELERATION, this.Y_SPEED, dt);

        if (this.isAllowedToFire) {
            if (this.isBurstOn) {
                this.burstTimer += dt;
                if (this.burstTimer >= this.LASER_INTERVAL && this.numberOfBulletsFired < this.BULLET_BURST) {
                    this.burstTimer = 0;

                    this.game.spawnEnemyLaser(0, this.node,
                         cc.v2(Math.sin(this.node.rotation /  (-180 / Math.PI)) * this.LASER_SPEED,
                            Math.cos(this.node.rotation / (-180 / Math.PI)) * -this.LASER_SPEED));

                    this.laserSound.play();
                    this.numberOfBulletsFired++;
                }
            }
        }
    }

    initiateLaser() {
        this.isBurstOn = true;
        this.burstTimer = 0;
        this.numberOfBulletsFired = 0;
    }
}
