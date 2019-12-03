"use strict";
const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images
PIXI.loader.
add(["images/Spaceship.png","images/explosions.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,lifeLabel,shootSound,hitSound,fireballSound;
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
		
	// #8 - Start update loop
	
	// #9 - Start listening for click events on the canvas
	
	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Verdana"
    });

    // 1 - set up 'startScene'
    // 1A - make the top start label
    let startLabel1 = new PIXI.Text("Circle Blast!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: "Verdana",
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
        fontSize: 32,
        fontFamily: "Verdana",
        fontStile: "italic",
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
        fontFamily: "Futura",
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
    let gameOverText = new PIXI.Text("Game Over!\n        :-O");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Futura",
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
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
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