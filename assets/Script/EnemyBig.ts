import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBig extends Enemy {

    private readonly FIRE_RATE = 2;
    private readonly BULLET_BURST = 1;
    private readonly LASER_INTERVAL = 0.2;
    private readonly X_ACCELERATION = 110;
    private readonly Y_SPEED = -50; 
    private readonly LASER_SPEED = 135;

    private laserSound: cc.AudioSource = null;
    private isBurstOn: boolean =  false;
    private burstTimer: number = 0;
    private numberOfBulletsFired = 0;

    start () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.hitPoints = 1;
        super.setLaserScheduler(this.FIRE_RATE, this.initiateLaser);
    }

    update (dt) {
        super.update(dt);
        super.updateShip(this.X_ACCELERATION, this.Y_SPEED, dt);

        if (this.isAllowedToFire) {
            if (this.isBurstOn) {
                this.burstTimer += dt;
                if (this.burstTimer >= this.LASER_INTERVAL && this.numberOfBulletsFired < this.BULLET_BURST) {
                    this.burstTimer = 0;
                    let angle = -37.5;
                    let offset = -20;
                    for (let i = 0; i < 7; i++) {
                        this.createLaser(offset, cc.v2(Math.sin(angle /  (180 / Math.PI)) * this.LASER_SPEED, Math.cos(angle / (180 / Math.PI)) * -this.LASER_SPEED));
                        angle += 12.5;
                        offset += 10;
                    }
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
