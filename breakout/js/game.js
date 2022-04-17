/*
 * breakout
 */

// //////////////////////////////////////////////////////////////////////////////////////
// Game Objects
// //////////////////////////////////////////////////////////////////////////////////////
let GAME = {};
let paddleDirection = 0;
const paddleSpeed = 500;
let ballStep = 200;
let stageWidth = 800;
let stageHeight = 600;
let now,
    dt = 0,
    last,
    step = 1 / 60,
    isPause = false;

GAME.stage = {
    id: "stageId",
    classes: "stage",
    width: stageWidth,
    height: stageHeight,
    walls: [
        {
            // top
            collisionBody: new Rectangle(new Vector2D(0, -10), new Vector2D(stageWidth, 10)),
            onCollision: function () { console.log("top"); }
        },
        {
            // right
            collisionBody: new Rectangle(new Vector2D(stageWidth, 0), new Vector2D(10, stageHeight)),
            onCollision: function () { console.log("left"); }
        },
        {
            // bottom
            collisionBody: new Rectangle(new Vector2D(0, stageHeight), new Vector2D(stageWidth, 10)),
            onCollision: function () { GAME.lose(); }
        },
        {
            // left
            collisionBody: new Rectangle(new Vector2D(-10, 0), new Vector2D(10, stageHeight)),
            onCollision: function () { console.log("right"); }
        }
    ],
    position: {
        x: 0,
        y: 0
    }
};

GAME.blocks = {
    list: [],
    width: 20,
    height: 20,
    gap: 5,
    columns: 30,
    rows: 10,
    size: new Vector2D(0, 0)
};

GAME.paddle = {
    id: "paddleId",
    classes: "paddle",
    width: 50,
    height: 5,
    size: new Vector2D(0, 0),
    position: new Vector2D(0, 0),
    collisionBody: new Rectangle(new Vector2D(0, 0), 1),
    direction: new Vector2D(0, 0),
    init: function (model, initX, initY) {
        this.model = model;
        this.setX(initX);
        this.setY(initY);
        this.collisionBody.origin = this.position;
        this.size = new Vector2D(this.width, this.height);
        this.collisionBody.size = this.size;
    },
    setX: function (value) {
        this.position.x = value;
        this.model.style.left = asPx(value);
    },
    setY: function (value) {
        this.position.y = value;
        this.model.style.top = asPx(value);
    },
    onCollision: function () {
        this.model.style.background = randomColorCode();
    }
};

GAME.ball = {
    id: "ballId",
    classes: "ball",
    width: 5,
    height: 5,
    size: new Vector2D(0, 0),
    position: new Vector2D(0, 0),
    collisionBody: new Rectangle(new Vector2D(0, 0), 1),
    direction: new Vector2D(ballStep, ballStep),
    init: function (model, initX, initY) {
        this.model = model;
        this.setX(initX);
        this.setY(initY);
        this.collisionBody.origin = this.position;
        this.size = new Vector2D(this.width, this.height);
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

GAME.keyMap = {
    // ARROW_LEFT
    37: {
        keydown: function () {
            paddleDirection = -1;
        },
        keyup: function () {
            paddleDirection = 0;
        }
    },
    // ARROW_RIGHT
    39: {
        keydown: function () {
            paddleDirection = 1;
        },
        keyup: function () {
            paddleDirection = 0;
        }
    },
    32: {
        keydown: function () {
            isPause = !isPause;
        }
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
        this.stage.height - this.paddle.height - 30
    );
};

GAME.createBlocks = function (id, pos) {
    let basePos = { x: 30, y: 30 };
    for (let i = 0; i < this.blocks.columns; i++) {
        for (let j = 0; j < this.blocks.rows; j++) {
            let position = new Vector2D(
                basePos.x + i * (this.blocks.width + this.blocks.gap),
                basePos.y + j * (this.blocks.height + this.blocks.gap)
            );
            let block = {
                id: "blockId_" + i + "_" + j,
                classes: "block",
                width: this.blocks.width,
                height: this.blocks.height,
                position: {
                    x: basePos.x + i * (this.blocks.width + this.blocks.gap),
                    y: basePos.y + j * (this.blocks.height + this.blocks.gap)
                }
            }
            block.size = new Vector2D(this.blocks.width, this.blocks.height);
            block.model = this.createGameObject(block);
            block.model.style.background = randomColorCode();
            block.collisionBody = new Rectangle(block.position, block.size);

            block.onCollision = function () {
                let index;
                for (b in GAME.blocks.list) {
                    if (GAME.blocks.list[b].id === this.id) {
                        index = b;
                        break;
                    }
                }
                GAME.blocks.list.splice(index, 1);
                removeElement(this.model);
            };
            this.blocks.list.push(block);
        }
    }
};

GAME.createBall = function () {
    this.ball.init(
        this.createGameObject(this.ball),
        this.stage.width / 2,
        this.stage.height * 2 / 3);
};

GAME.createGameObject = function (obj) {
    return createElement(obj.id, obj.classes, obj.width, obj.height, obj.position);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Game simulation
// //////////////////////////////////////////////////////////////////////////////////////

// Gameloop
GAME.gameLoop = function (timestamp) {
    if (isPause) {
        dt = 0;
    } else {
        dt = dt + Math.min(1, (timestamp - last) / 1000);
    }
    last = timestamp;
    while (dt > step) {
        dt = dt - step;
        GAME.updatePaddle(step);
        GAME.updateBall(step);
        GAME.checkWinState();
    }

    FPSinfo.updateFPS(timestamp);
    requestAnimationFrame(GAME.gameLoop);
};

// Simulation
GAME.updatePaddle = function (step) {
    let pos = GAME.paddle.position.x + paddleSpeed * paddleDirection * step
    this.paddle.setX(Math.max(0, Math.min(pos, this.stage.width - this.paddle.width)));
};

GAME.updateBall = function (step) {
    this.ball.setX(this.ball.position.x + this.ball.direction.x * step);
    this.ball.setY(this.ball.position.y + this.ball.direction.y * step);

    if (this.ball.position.y <= 0 || this.ball.position.y + this.ball.height >= this.stage.height) {
        ballStep *= -1;
    }
    let collidingObject = this.checkCollision();
    if (collidingObject) {
        this.ball.direction = this.calculateDirection(this.ball.direction, this.ball.collisionBody, collidingObject.collisionBody);
        collidingObject.onCollision();
    }
};

GAME.checkCollision = function () {
    // collision with paddle
    let isCollidingPaddle = rectanglesCollide(this.ball.collisionBody, this.paddle.collisionBody);
    if (isCollidingPaddle) {
        return this.paddle;
    }

    // collision with stage walls
    for (w of this.stage.walls) {
        let isColliding = rectanglesCollide(this.ball.collisionBody, w.collisionBody);
        if (isColliding) {
            return w;
        }
    }

    // collision with blocks
    for (b of this.blocks.list) {
        let isColliding = rectanglesCollide(this.ball.collisionBody, b.collisionBody);
        if (isColliding) {
            return b;
        }
    }

    return null;
};

GAME.calculateDirection = function (originDirection, ball, collidingObject) {
    let left = greaterOrEqualFloats(ball.origin.x, collidingObject.origin.x + collidingObject.size.x);
    let right = lessOrEqualFloats(ball.origin.x, collidingObject.origin.x);
    let top = lessOrEqualFloats(ball.origin.y, collidingObject.origin.y);
    let bottom = greaterOrEqualFloats(ball.origin.y, collidingObject.origin.y + collidingObject.size.y);

    return new Vector2D(
        originDirection.x * (left || right ? -1 : 1),
        originDirection.y * (top || bottom ? -1 : 1)
    );
};

GAME.checkWinState = function () {
    // win state
    if (this.blocks.list.length == 0) {
        this.win();
    }
};

GAME.win = function () {
    console.log("Game Over! You won!");
};

GAME.lose = function () {
    console.log("Game Over! You lose!")
    isPause = true;
    let element = document.createElement("div");
    element.innerHTML = "GAME OVER";
    element.id = "gameOverId";
    element.className = "gameOver";
    element.style.position = "absolute";
    element.style.top = "3em";
    element.style.left = "2.3em";
    element.style.fontSize = "4.5em";
    document.body.appendChild(element);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Helper
// //////////////////////////////////////////////////////////////////////////////////////

function randomColorCode() {
    var makeColorCode = '0123456789ABCDEF';
    var code = '#';
    for (var count = 0; count < 6; count++) {
        code = code + makeColorCode[Math.floor(Math.random() * 16)];
    }
    return code;
}