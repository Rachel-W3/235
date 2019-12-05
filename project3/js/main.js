"use strict";
// Try getting application to either fit whole screen or 
// open in a new window resized to its resolution
const app = new PIXI.Application({
    width: 1280,
    height: 720,
    backgroundColor: 0x1f79b9
}); 
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

PIXI.loader.
add(["images/angel.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(gameSetup);

// aliases
let stage;

// game variables
let startScene;
let gameScene,angel,scoreLabel,gameOverScoreLabel;
let gameOverScene;

let meteors = [];
let score = 0;
let levelNum = 1;
let paused = true;

function gameSetup() {
    stage = app.stage;

    // Creating start scene
    // startScene = new PIXI.Container();
    // stage.addChild(startScene);

    // Creating the main `game` scene (invisible at start-up)
    gameScene = new PIXI.Container();

    // gameScene.visible = false;
    stage.addChild(gameScene);

    createLabelsAndButtons();

    // Creating game over scene (also invisible)
    // gameOverScene = new PIXI.Container();
    // gameOverScene.visible = false;
    // stage.addChild(gameOverScene);

    // Creating angel
    angel = new Angel(sceneWidth / 2, sceneHeight - 100);
    gameScene.addChild(angel);

    // Start update loop
    app.ticker.add(gameLoop);

    // Add keydown event listener to our document
    document.addEventListener('keydown', onKeyDown);
}

function createLabelsAndButtons() {
    // 2 - set up 'gameScene
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: 'Arial',
    });

    // 2A - make the score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 0;
    scoreLabel.y = 0;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);
}

function gameLoop() {
    //if (paused) return;

    // Calculating delta time
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt = 1/12;
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Height: ${score}m`;
}

// https://codepen.io/SkuliOskarsson/pen/ZbJKVW
function onKeyDown(key) {
    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
        if (angel.position.x != 0) {
            angel.position.x -= 10;
        }
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
        if (angel.position.x != sceneWidth) {
            angel.position.x += 10;
        }
    }
}