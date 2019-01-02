const {ccclass, property} = cc._decorator;

@ccclass
export default class InvincibleEffect extends cc.Component {

    private particles: cc.ParticleSystem = null;

    onLoad () {
        this.particles = this.node.getComponent(cc.ParticleSystem);
    }
    
    setDuration(duration: number) {
        this.particles.duration = duration;
    }

    startParticleEffect() {
        this.particles.resetSystem();
    }
}
