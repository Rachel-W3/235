var containerSize = {x:800,y:600};

var renderer = PIXI.autoDetectRenderer(containerSize.x,containerSize.y);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var container = new PIXI.Container();

stage.addChild(container);

PIXI.loader.add("images/blue-skies-background.jpg").load(function () {   
    var slide = background(containerSize, new PIXI.Sprite.fromImage("images/blue-skies-background.jpg"),'cover');        
    container.addChild(slide.container);
    // force resize: slide.doResize();
    renderer.render(stage);
});