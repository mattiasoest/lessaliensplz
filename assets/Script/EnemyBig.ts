import Enemy from "./Enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBig extends Enemy {

    start () {
        this.testFunction();
    }

    update (dt) {
        super.update(dt);
    }
}
