"use strict";
const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images
// PIXI.loader.
// add(["images/Spaceship.png","images/explosions.png"]).
// on("progress",e=>{console.log(`progress=${e.progress}`)}).
// load(setup);

// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,lifeLabel,shootSound,hitSound,fireballSound,gameOverScoreLabel;
let gameOverScene;

let circles = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

function setup() {
	stage = app.stage;
    // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
	
    // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
	
    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();
	
	// #5 - Create ship
    ship = new Ship();
    gameScene.addChild(ship);
	
	// #6 - Load Sounds
    shootSound = new Howl({
        src: ['sounds/shoot.wav']
    });

    hitSound = new Howl({
        src: ['sounds/hit.mp3']
    });

    fireballSound = new Howl({
        src: ['sounds/fireball.mp3']
    });
	
    // #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();
		
	// #8 - Start update loop
    app.ticker.add(gameLoop);
	
	// #9 - Start listening for click events on the canvas
	
	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 20,
        fontFamily: 'Press Start 2P'
    });

    // 1 - set up 'startScene'
    // 1A - make the top start label
    let startLabel1 = new PIXI.Text("Circle Blast!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: 'Press Start 2P',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // 1B - make the middle start label
    let startLabel2 = new PIXI.Text("R U worthy..?");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: 'Press Start 2P',
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    // 1C - make the start game button
    let startButton = new PIXI.Text("Enter, ... if you dare!");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame is a function reference
    startButton.on("pointerover", e=>e.target.alpha = 0.7);
    startButton.on("pointerout", e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    // 2 - set up 'gameScene
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: 'Press Start 2P',
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    // 2A - make the score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    //2B - make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    // 3 - set up `gameOverScene`
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over!\n   :-O");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 42,
        fontFamily: 'Press Start 2P',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);

    // 3C - show final score
    gameOverScoreLabel = new PIXI.Text();
    gameOverScoreLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20,
        fontFamily: 'Press Start 2P',
        stroke: 0xFF0000,
        strokeThickness: 6,
        fontStyle: "italic",
    });
    gameOverScoreLabel.x = 100;
    gameOverScoreLabel.y = sceneHeight - 300;
    gameOverScene.addChild(gameOverScoreLabel);
}

function gameLoop(){
    if (paused) return;
	
	// #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
	
	// #2 - Move Ship
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    // ship.position = mousePosition;
    
    let amt = 6 *dt; // at 60 fps would move about 10% of distance per update
	
    let newX = lerp(ship.x, mousePosition.x, amt);
    let newY = lerp(ship.y, mousePosition.y, amt);
    
    // keep the ship on the screen with clamp()
    let w2 = ship.width/2;
    let h2 = ship.height/2;
    ship.x = clamp(newX, 0 + w2, sceneWidth - w2);
    ship.y = clamp(newY, 0 + h2, sceneHeight - h2);
    
    // #3 - Move Circles
    for (let c of circles) {
        c.move(dt);
        if (c.x <= c.radius || c.x >= sceneWidth - c.radius) {
            c.reflectX();
            c.move(dt);
        }
        if (c.y <= c.radius || c.y >= sceneHeight - c.radius) {
            c.reflectY();
            c.move(dt);
        }
    }
	
	// #4 - Move Bullets
    for (let b of bullets){
		b.move(dt);
	}
	
	// #5 - Check for Collisions
	for (let c of circles) {
        for (let b of bullets) {
            // #5A - circles and bullets
            if(rectsIntersect(c, b)) {
                fireballSound.play();
                createExplosion(c.x, c.y, 64, 64);
                gameScene.removeChild(c);
                c.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
            }

            if (b.y < -10) b.isAlive = false;
        }

        // #5B - circles and ship
        if (c.isAlive && rectsIntersect(c, ship)) {
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }
    }
	
	// #6 - Now do some clean up
    // get rid of dead bullets
    bullets = bullets.filter(b => b.isAlive);
    // get rid of dead circles
    circles = circles.filter(c => c.isAlive);
    // get rid of explosions
    explosions = explosions.filter(e => e.playing);
	
	// #7 - Is game over?
    if (life <= 0){
        end();
        return; // return here so we skip #8 below
    }
	
    // #8 - Load next level
    if (circles.length == 0){
        levelNum ++;
        loadLevel();
    }
    
    // #9 - Start listening for click events on the canvas
    app.view.onclick = fireBullet;
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 550;
    loadLevel();
}

function end() {
    paused = true;
    
    // clear out level
    circles.forEach(c => gameScene.removeChild(c));
    circles = [];
    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];
    explosions.forEach(e => gameScene.removeChild(e));
    explosions = [];

    gameOverScene.visible = true;
    gameScene.visible = false;
    gameOverScoreLabel.text = `Your final score: ${score}`;
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score    ${score}`;
}

function decreaseLifeBy(value) {
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life      ${life}%`;
}

function createCircles(numCircles) {
    // standard bouncing circles
    for (let i = 0; i < numCircles / 2; i++) {
        let c = new Circle(10, 0xFFFF00);
        c.x = Math.random() * (sceneWidth - 50) + 25;
        c.y = Math.random() * (sceneHeight - 400) + 25;
        circles.push(c);
        gameScene.addChild(c);
    }

    // orthogonal circles
    for (let i = 0; i < numCircles / 2; i++) {
        let c = new Circle(10, 0x00FFFF);
        c.speed = Math.random() * 100 + 100;
        if (Math.random() < 0.5) {
            c.x = Math.random() * (sceneWidth - 50) + 25;
            c.y = Math.random() * 100 + c.radius;
            c.fwd = {x: 0, y: 1};
        }
        else {
            c.x = Math.random() * 25 + c.radius;
            c.y = Math.random() * (sceneHeight - 80) - c.radius;
            c.fwd = {x: 1, y: 0};
        }
        circles.push(c);
        gameScene.addChild(c);
    }
}

function loadLevel() {
    createCircles(levelNum * 8);
	paused = false;
}

function fireBullet(e) {
    // let rect = app.view.getBoundingClientRect();
    // let mouseX = e.clientX - rect.x;
    // let mouseY = e.clientY - rect.y;
    // console.log(`${mouseX}, ${mouseY}`);
    if (paused) return;

    let offset = 10;

    if (levelNum >= 2) {
        for (let i = -1; i <= 1; i++) {
            let b = new Bullet(0xFFFFFF, ship.x + (offset * i), ship.y);
            bullets.push(b);
            gameScene.addChild(b);
        }
    }
    else {
        let b = new Bullet(0xFFFFFF, ship.x, ship.y);
        bullets.push(b);
        gameScene.addChild(b);
    }
    shootSound.play();
}

// ***RELEVANT TO MY PROJECT***
function loadSpriteSheet() {
    // the 16 animation in each row are 64x64 pixels
    // we are using the second row
    // http://pixijs.download/dev/docs/PIXI.BaseTexture.html
    let spriteSheet = PIXI.BaseTexture.fromImage("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFramse = 16;
    let textures = [];
    for (let i = 0; i < numFramse; i++) {
        // http://pixijs.download/dev/docs/PIXI.Texture.html
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * width, 64, width, height)); // change 64 to any other multiple of 64 to select row
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x , y, frameWidth, frameHeight) {
    // http://pixijs.download/dev/docs/PIXI.extras.AnimatedSprite.html
    // the animation framse are 64x64 pixels
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let expl = new PIXI.extras.AnimatedSprite(explosionTextures);
    expl.x = x - w2; // we want the explosions to appear at the center of the circle
    expl.y = y - h2;
    expl.animationSpeed = 1/2; // was 1/7, but faster explosion looks nicer
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}