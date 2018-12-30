import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemySmall extends Enemy {

    start () {
        this.testFunction();
    }

    update (dt) {
        super.update(dt);
    }
}
