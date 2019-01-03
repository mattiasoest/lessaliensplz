import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBig extends Enemy {

    private readonly FIRE_RATE = 2;
    private readonly X_ACCELERATION = 110;
    private readonly Y_SPEED = -45; 
    private readonly LASER_SPEED = 130;
    
    private isFireTriggered: boolean = false;
    private laserSound: cc.AudioSource = null;

    start () {
        this.laserSound = this.getComponent(cc.AudioSource);
        this.laserSound.volume = 0.6;
        this.hitPoints = 1;
        super.setLaserScheduler(this.FIRE_RATE, this.initiateLaser);
    }

    update (dt) {
        super.update(dt);
        super.updateShip(this.X_ACCELERATION, this.Y_SPEED, dt);

        if (this.isAllowedToFire) {
            if (this.isFireTriggered) {
                this.isFireTriggered = false;
                let angle = -37.5;
                let offset = -20;
                for (let i = 0; i < 7; i++) {
                    this.game.spawnEnemyLaser(offset, this.node, cc.v2(Math.sin(angle /  (180 / Math.PI)) * this.LASER_SPEED,
                                         Math.cos(angle / (180 / Math.PI)) * -this.LASER_SPEED));
                    angle += 12.5;
                    offset += 10;
                }
                this.laserSound.play();
            }
        }
    }

    initiateLaser() {
        this.isFireTriggered = true;
    }
}
