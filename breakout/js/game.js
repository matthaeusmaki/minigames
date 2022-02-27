/*
 * Game script for breakout
 */

var GAME = {};
var now,
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

GAME.init = function () {
	last = timestamp();
	this.createStage();
	this.createPaddle();
	this.createBlocks();
	requestAnimationFrame(this.update);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Creation
// //////////////////////////////////////////////////////////////////////////////////////

GAME.createStage = function () {
	this.stage.model = this.createGameObject(this.stage);
};

GAME.createPaddle = function () {
	this.paddle.model = this.createGameObject(this.paddle);
	this.paddle.setX(this.stage.width / 2 - this.paddle.width / 2);
	this.paddle.setY(this.stage.height - this.paddle.height - 10);
};

GAME.createBlocks = function () {
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 10; j++) {
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

	//block.model = this.createGameObject(block);
};

GAME.createGameObject = function (obj) {
	return createElement(obj.id, obj.classes, obj.width, obj.height, obj.position);
};

// //////////////////////////////////////////////////////////////////////////////////////
// Game simulation
// //////////////////////////////////////////////////////////////////////////////////////

// Gameloop
GAME.update = function () {
	now = timestamp();
	dt = dt + Math.min(1, (now - last) / 1000);
	while (dt > step) {
		dt = dt - step;
		// TODO: simulate game with step
		GAME.updatePaddle(step);
	}
	// TODO: render game with dt
	last = now;
	requestAnimationFrame(GAME.update);
};

var paddleTestStep = 200;

// Simulation
GAME.updatePaddle = function (step) {
	this.paddle.setX(GAME.paddle.position.x + paddleTestStep * step);
	if (this.paddle.position.x <= 0 || this.paddle.position.x + this.paddle.width >= this.stage.width) {
		paddleTestStep *= -1;
	}
};