class Angel extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(PIXI.loader.resources["images/angel.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}