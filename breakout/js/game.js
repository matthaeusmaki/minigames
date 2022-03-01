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
	height: 10
};

GAME.paddle = {
	id: "paddleId",
	classes: "paddle",
	width: 50,
	height: 5,
	position: {
		x: 0,
		y: 0
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
	position: {
		x: 0,
		y: 0
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
	this.paddle.position.x = this.stage.width / 2 - this.paddle.width / 2;
	this.paddle.position.y = this.stage.height - this.paddle.height - 10;
	this.paddle.model = this.createGameObject(this.paddle);
};

GAME.createBlocks = function () {
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 10; j++) {
			this.createBlock("block_" + i + "_" + j, { x: i, y: j });
		}
	}
};

GAME.createBlocks = function (id, pos) {
	let basePos = { x: 30, y: 30 };
	let gap = 5;
	for (let i = 0; i < 49; i++) {
		for (let j = 0; j < 10; j++) {
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
			this.blocks.list.push(block);
		}
	}
};

GAME.createBall = function () {
	this.ball.position.x = this.stage.width / 2;
	this.ball.position.y = this.stage.height * 2 / 3;
	this.ball.model = this.createGameObject(this.ball);
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