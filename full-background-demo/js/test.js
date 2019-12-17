const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    // width: 1280,
    // height: 720,
    backgroundColor: 0x1f79b9
});

document.body.appendChild(app.view);

// Listen for window resize events
window.addEventListener('resize', resize);

// Resize function window
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();

const bgImage = PIXI.Texture.from("images/blue-skies-background.jpg");

const sky = new PIXI.TilingSprite(
    bgImage,
    app.screen.width,
    app.screen.height,
);
app.stage.addChild(sky);

app.ticker.add(() => {
    sky.tilePosition.y += 1;
});

// var containerSize = {x:800,y:600};

// var renderer = PIXI.autoDetectRenderer(containerSize.x,containerSize.y);
// document.body.appendChild(renderer.view);

// var stage = new PIXI.Container();
// var container = new PIXI.Container();

// stage.addChild(container);

// PIXI.loader.add("images/blue-skies-background.jpg").load(function () {   
//     var slide = background(containerSize, new PIXI.Sprite.fromImage("images/blue-skies-background.jpg"),'cover');        
//     container.addChild(slide.container);
//     // force resize: slide.doResize();
//     renderer.render(stage);
// });