/*
 * breakout
 */

// //////////////////////////////////////////////////////////////////////////////////////
// Game Objects
// //////////////////////////////////////////////////////////////////////////////////////
let GAME = {};
let paddleTestStep = 200;
let ballStep = 200;
let now,
    dt = 0,
    last,
    step = 1 / 60;

GAME.stage = {
    id: "stageId",
    classes: "stage",
    width: 800,
    height: 600,
    position: {
        x: 0,
        y: 0
    }
};

GAME.blocks = {
    list: [],
    width: 10,
    height: 10,
    size: new Vector2D(10, 10)
};

GAME.paddle = {
    id: "paddleId",
    classes: "paddle",
    width: 50,
    height: 5,
    size: new Vector2D(50, 5),
    position: new Vector2D(0, 0),
    collisionBody: new Rectangle(new Vector2D(0, 0), 1),
    init: function (model, initX, initY) {
        this.model = model;
        this.setX(initX);
        this.setY(initY);
        this.collisionBody.origin = this.position;
        this.collisionBody.size = this.size;

    },
    setX: function (value) {
        this.position.x = value;
        this.model.style.left = asPx(value);
    },
    setY: function (value) {
        this.position.y = value;
        this.model.style.top = asPx(value);
    }
};

GAME.ball = {
    id: "ballId",
    classes: "ball",
    width: 5,
    height: 5,
    size: new Vector2D(5, 5),
    position: new Vector2D(0, 0),
    collisionBody: new Rectangle(new Vector2D(0, 0), 1),
    init: function (model, initX, initY) {
        this.model = model;
        this.setX(initX);
        this.setY(initY);
        this.collisionBody.origin = this.position;
        this.collisionBody.size = this.size;
    },
    setX: function (value) {
        this.position.x = value;
        this.model.style.left = asPx(value);
    },
    setY: function (value) {
        this.position.y = value;
        this.model.style.top = asPx(value);
    }
};

// //////////////////////////////////////////////////////////////////////////////////////
// Init
// //////////////////////////////////////////////////////////////////////////////////////

GAME.init = function () {
    last = currentTime();
    this.createStage();
    this.createPaddle();
    this.createBlocks();
    this.createBall();
    FPSinfo.createFPSbox();
    requestAnimationFrame(this.gameLoop);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Creation
// //////////////////////////////////////////////////////////////////////////////////////

GAME.createStage = function () {
    this.stage.model = this.createGameObject(this.stage);
};

GAME.createPaddle = function () {
    this.paddle.init(
        this.createGameObject(this.paddle),
        this.stage.width / 2 - this.paddle.width / 2,
        this.stage.height - this.paddle.height - 10
    );
};

GAME.createBlocks = function (id, pos) {
    let basePos = { x: 30, y: 30 };
    let gap = 5;
    // for (let i = 0; i < 49; i++) {
    for (let i = 0; i < 1; i++) {
        // for (let j = 0; j < 10; j++) {
        for (let j = 0; j < 1; j++) {
            let position = new Vector2D(
                basePos.x + i * (this.blocks.width + gap),
                basePos.y + j * (this.blocks.height + gap)
            );
            let block = {
                id: "blockId_" + i + "_" + j,
                classes: "block",
                width: this.blocks.width,
                height: this.blocks.height,
                position: {
                    x: basePos.x + i * (this.blocks.width + gap),
                    y: basePos.y + j * (this.blocks.height + gap)
                }
            }
            block.model = this.createGameObject(block);
            block.collisionBody = new Rectangle(block.position, this.blocks.size);
            this.blocks.list.push(block);
        }
    }
};

GAME.createBall = function () {
    this.ball.init(
        this.createGameObject(this.ball),
        30, //this.stage.width / 2,
        30);//this.stage.height * 2 / 3);
};

GAME.createGameObject = function (obj) {
    return createElement(obj.id, obj.classes, obj.width, obj.height, obj.position);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Game simulation
// //////////////////////////////////////////////////////////////////////////////////////

// Gameloop
GAME.gameLoop = function (timestamp) {
    dt = dt + Math.min(1, (timestamp - last) / 1000);
    last = timestamp;
    while (dt > step) {
        dt = dt - step;
        GAME.updatePaddle(step);
        GAME.updateBall(step);
        GAME.checkCollision();
    }

    FPSinfo.updateFPS(timestamp);
    requestAnimationFrame(GAME.gameLoop);
};

// Simulation
GAME.updatePaddle = function (step) {
    this.paddle.setX(GAME.paddle.position.x + paddleTestStep * step);
    if (this.paddle.position.x <= 0 || this.paddle.position.x + this.paddle.width >= this.stage.width) {
        paddleTestStep *= -1;
    }
};

GAME.updateBall = function (step) {
    this.ball.setY(GAME.ball.position.y + ballStep * step);
    // TODO: collision detection and bouncing
    if (this.ball.position.y <= 0 || this.ball.position.y + this.ball.height >= this.stage.height) {
        ballStep *= -1;
    }
};

GAME.checkCollision = function () {
    for (b of this.blocks.list) {
        if (b.id === "blockId_0_0") {
            let isColliding = rectanglesCollide(this.ball.collisionBody, b.collisionBody);
            if (isColliding) {
                b.model.style.background = randomColorCode();
                console.log("hit")
            }
        }
    }
    let result = rectanglesCollide(this.ball.collisionBody, this.paddle.collisionBody);
    if (result) {
        this.paddle.model.style.background = randomColorCode();
    }

}

function randomColorCode() {
    var makeColorCode = '0123456789ABCDEF';
    var code = '#';
    for (var count = 0; count < 6; count++) {
        code = code + makeColorCode[Math.floor(Math.random() * 16)];
    }
    return code;
}
