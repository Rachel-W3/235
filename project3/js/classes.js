class Angel extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(PIXI.loader.resources["images/angel.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}

// Need to change sprite to meteor
class Meteor extends PIXI.Graphics {
    constructor(radius, color = 0xFF0000, x = 0, y = 0) {
        super();
        this.beginFill(color);
        this.drawCircle(0, 0, radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;

        //variables
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }

    move(dt = 1/60) {
        this.y += this.y * this.speed * dt;
    }
}