import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemySmall extends Enemy {

    private readonly FIRE_RATE = 0.5;
    private readonly BULLET_BURST = 4;
    private readonly LASER_INTERVAL = 0.25;

    private miniLaser: cc.AudioSource = null;

    start () {
        this.miniLaser = this.getComponent(cc.AudioSource);
        this.setLaserScheduler();
    }

    update (dt) {
        super.update(dt);
    }

    fireLaser() {
        // cc.director.getScheduler().schedule(this.createLaser, this, this.FIRE_RATE, false);
        this.createLaser();
    }

    setLaserScheduler() {
        cc.director.getScheduler().schedule(this.fireLaser, this, this.FIRE_RATE, false);
    }

    createLaser() {
        const newLaser = cc.instantiate(this.redLaser);
        // Relative to the current node. So center it.
        newLaser.setPosition(0, -this.node.height / 2);
        const body = newLaser.getComponent(cc.RigidBody);
        
        body.linearVelocity = cc.v2(0, -285);
        this.node.addChild(newLaser);
        const laserObject = newLaser.getComponent('LaserRed');
        // Game from the superclass.
        laserObject.game = this.game;
        this.miniLaser.play();
    }
}
