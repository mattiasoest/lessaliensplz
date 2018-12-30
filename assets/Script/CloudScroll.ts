const {ccclass, property} = cc._decorator;

@ccclass
export default class CloudScroll extends cc.Component {

    private readonly lowBound: number = -252;
    private readonly resetPos: number = 3134;
    private readonly scrollSpeed: number = 115;

    // onLoad () {}

    // start () {
    // }

    update (dt) {
        this.node.setPosition(this.node.position.x,this.node.position.y - this.scrollSpeed * dt);
        if (this.node.getPosition().y <= this.lowBound - this.node.height) {
            this.node.setPosition(this.node.position.x, this.resetPos);
        } 

    }
}
