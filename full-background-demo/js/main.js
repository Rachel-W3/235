"use strict";

// https://stackoverflow.com/questions/12273451/how-to-fix-delay-in-javascript-keydown
let keyState = {};
window.addEventListener('keydown', function(e) {
    keyState[e.keyCode || e.which] = true;
}, true);    
window.addEventListener('keyup', function(e) {
    keyState[e.keyCode || e.which] = false;
}, true);

// Try getting application to either fit whole screen or 
// open in a new window resized to its resolution
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

// constants
const sceneWidth = app.screen.width;
const sceneHeight = app.screen.height;
const minCoolDown = 50;

PIXI.loader.
add(["images/angel.png"]).
load(gameSetup);

// aliases
let stage;

// game variables
let startScene;
let gameScene,angel,scoreLabel,gameOverScoreLabel;
let gameOverScene;

let meteors = [];
let meteorCount;
let spawnCoolDown; // Delay (in frames) between spawning meteors
let elapsedFrames;
let score;
let levelNum;
let paused = true;

function gameSetup() {
    stage = app.stage;

    // Creating start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    // Creating the main `game` scene (invisible at start-up)
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    
    // Creating game over scene (also invisible)
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // Full screen background image
    let containerSize = {x: sceneWidth, y: sceneHeight};
    let renderer = PIXI.autoDetectRenderer(containerSize.x,containerSize.y);
    document.body.appendChild(renderer.view);

    PIXI.loader.add("images/blue-skies-background.jpg").load(function () {   
        let slide = background(containerSize, new PIXI.Sprite.fromImage("images/blue-skies-background.jpg"),'cover');        
        gameScene.addChild(slide.gameScene);
        // force resize: slide.doResize();
        renderer.render(stage);
    });
    
    createLabelsAndButtons();

    // Creating angel
    angel = new Angel(sceneWidth / 2, sceneHeight - 100);
    angel.scale.set(sceneWidth * 0.00015);
    gameScene.addChild(angel);

    // // Add keydown event listener to our document
    // document.addEventListener('keydown', onKeyDown);

    // Start update loop
    app.ticker.add(gameLoop);
}

function createLabelsAndButtons() {
    // Buttons not yet implemented
    // let buttonStyle = new PIXI.TextStyle({
    //     fill: 0xFFFFFF,
    //     fontSize: 20,
    //     fontFamily: 'Arial'
    // });
    
    // 1 - set up startscene
    let title = new PIXI.Text("FALLEN ANGEL");
    title.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 72,
        fontFamily: 'Arial',
        fontStyle: 'bold'
        
    });
    title.x = sceneWidth / 2 - title.width / 2;
    title.y = 125;
    startScene.addChild(title);

    let quote = new PIXI.Text("Fly...fly as high as you can");
    quote.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: 'Arial',
        fontStyle: 'italic'
    });
    quote.x = sceneWidth / 2 - quote.width / 2;
    quote.y = sceneHeight / 2 - 75;
    startScene.addChild(quote);

    let startLabel = new PIXI.Text("Press Space to Fly");
    startLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 48,
        fontFamily: 'Arial',
    });
    startLabel.x = sceneWidth / 2 - startLabel.width / 2;
    startLabel.y = sceneHeight / 2;
    startScene.addChild(startLabel);

    // 2 - set up 'gameScene'
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: 'Arial',
    });

    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 0;
    scoreLabel.y = 0;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    // 3 - set up 'gameOverScene'
    let gameOverText = new PIXI.Text("Game Over");
    gameOverText.style = textStyle;
    gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
    gameOverText.y = sceneHeight / 2 - gameOverText.height / 2;
    gameOverScene.addChild(gameOverText);
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    levelNum = 1;
    score = 0;
    meteorCount = 0;
    spawnCoolDown = 375;
    elapsedFrames = 0;
    angel.x = sceneWidth / 2;
    loadLevel();
}

function gameLoop() {
    getUserInput();
    if (paused) return;

    // // Calculating delta time
    // let dt = 1/app.ticker.FPS;
    // if (dt > 1/12) dt = 1/12;
    
    
    // Keeping angel within screen
    let currentX = angel.x;
    // let currentY = angel.y;
    angel.x = clamp(currentX, 0 + angel.width / 2, sceneWidth - angel.width / 2);
    // Since vertical movement is not yet implemented, this isn't needed
    // angel.y = clamp(currentY, 0 + angel.height / 2, sceneHeight - angel.height);
    
    // Spawn meteor if enough time has passed
    if(elapsedFrames > spawnCoolDown) {
        spawnMeteor();
        // Reset frame counter
        elapsedFrames = 0;
    }
    else {
        elapsedFrames += app.ticker.deltaTime;
    }
    
    // Move meteors
    for (let m of meteors) {
        m.move();
    }
    
    // If all meteors for the level have fallen
    // level up
    if (meteorCount >= 5 * levelNum) {
        levelNum++;
        console.log("level: " + levelNum);
        loadLevel();
    }

    // Collision detection
    for(let m of meteors) {
        if(m.isAlive && rectsIntersect(m, angel)) {
            if (angel.isVulnerable) {
                end();
                return;
            }
            else {
                gameScene.removeChild(m);
                m.isAlive = false;
            }
        }
    }

    // Cleaning up
    meteors = meteors.filter(m => m.isAlive);

    increaseScoreBy(angel.speed);
}

function loadLevel() {
    // For each level...
    // Max meteors to pass through increases by 10 (see level up)
    // Counter resets
    meteorCount = 0;
    if(spawnCoolDown > minCoolDown) {
        spawnCoolDown = (spawnCoolDown * 0.8).toFixed(2); // cool-down time is reduced by 20%
    }
    let newSpeed = angel.speed * Math.pow(1.2, levelNum - 1);
    if (newSpeed < angel.maxSpeed) angel.speed = newSpeed; // angel speed increases (score increases faster)
    paused = false;
}

function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Height: ${score.toFixed(2)}m`;
}

function spawnMeteor() {
    meteorCount++;
    let m = new Meteor(sceneHeight * 0.1, 0, 0);
    let offsetX = Math.floor(m.width / 2);
    let offsetY = Math.floor(m.height / 2);
    let randomX = getRandom(0 + offsetX, sceneWidth - offsetX);
    m.x = randomX;
    m.y = -offsetY;
    let newSpeed = m.speed + (levelNum - 1);
    if(newSpeed < m.maxSpeed) {
        m.speed = newSpeed;
    }
    // Meteors always spawn from the top
    meteors.push(m);
    gameScene.addChild(m);
    // console.log(meteors.length + ", " + meteorCount + ", " + spawnCoolDown + ", " + m.speed + ", " + angel.speed);
}

function end() {
    paused = true;
    // clear out level
    meteors.forEach(m => gameScene.removeChild(m));
    meteors = [];

    gameOverScene.visible = true;
    gameScene.visible = false;
}

function getUserInput() {
    // Shift = 16
    // Holding shift reduces movement speed for better accuracy
    let distance = 10;
    if(keyState[16]) {
        distance = 5;
    }
    // Left arrow = 37
    // A = 65
    if (keyState[37] || keyState[65]){
        angel.position.x -= distance;
    }    
    // Right = 39
    // D = 68
    if (keyState[39] || keyState[68]){
        angel.position.x += distance;
    }
    // Space key = 32
    if (keyState[32] && startScene.visible) {
        startGame();
    }
}

// #region Function graveyard
// // https://codepen.io/SkuliOskarsson/pen/ZbJKVW
// function onKeyDown(key) {
//     // A Key is 65
//     // Left arrow is 37
//     if (key.keyCode == 65 || key.keyCode == 37) {
//         if (angel.position.x != 0) {
//             angel.position.x -= 10;
//         }
//     }

//     // D Key is 68
//     // Right arrow is 39
//     if (key.keyCode == 68 || key.keyCode == 39) {
//         if (angel.position.x != sceneWidth) {
//             angel.position.x += 10;
//         }
//     }

//     // Space key is 32
//     if (key.keyCode == 32 && startScene.visible) {
//         startGame();
//     }
// }
// #endregion