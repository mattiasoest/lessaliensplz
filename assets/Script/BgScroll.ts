const {ccclass, property} = cc._decorator;

@ccclass
export default class BgScroll extends cc.Component {
    
    private readonly lowBound: number = -66;
    private readonly scrollSpeed: number = 15;

    // onLoad () {}

    // start () {

    // }

    update (dt) {
        this.node.setPosition(this.node.position.x,this.node.position.y - this.scrollSpeed * dt);
        if (this.node.getPosition().y <= this.lowBound - this.node.height) {
            this.node.setPosition(this.node.position.x, this.node.position.y + this.node.height * 3);
        } 

    }
}
