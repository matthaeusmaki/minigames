/*
 * Game script for breakout
 */

var GAME = {};
var now,
	dt = 0,
	last,
	step = 1/60;


GAME.stage = {
	width: 400,
	height: 400
};

GAME.paddle = {
	id: "paddleId",
	width: 50,
	height: 5,
	position: {
		x: 0,
		y: 0
	},
	setX: function(value) {
		this.position.x = value;
		this.model.style.left = asPx(value);
	},
	setY: function(value) {
		this.position.y = value;
		this.model.style.top = asPx(value);
	}
};

GAME.init = function() {
	last = timestamp();
	GAME.createPaddle();
	requestAnimationFrame(GAME.update);
};

GAME.createStage = function() {
	// TODO: create the stage
};

GAME.createPaddle = function() {
	GAME.paddle.model = createElement(GAME.paddle.id, "", GAME.paddle.width, GAME.paddle.height, GAME.paddle.position, "green");
	GAME.paddle.setX(GAME.stage.width/2 - GAME.paddle.width/2);
	GAME.paddle.setY(GAME.stage.height - GAME.paddle.height + 10);
};

// Gameloop
GAME.update = function() {
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
GAME.updatePaddle = function(step) {
	GAME.paddle.setX(GAME.paddle.position.x + paddleTestStep*step);
	if (GAME.paddle.position.x >= GAME.stage.width || GAME.paddle.position.x <= 0) {
		paddleTestStep *= -1;
	}
};