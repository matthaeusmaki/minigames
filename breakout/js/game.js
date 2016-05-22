/*
 * Game script for breakout
 */

var GAME = {};

GAME.stage = {
	width: 400,
	height: 400
};

GAME.paddle = {
	width: 50,
	height: 5,
	position: {
		x: GAME.stage.width/2 - this.width/2,
		y: GAME.stage.height - this.height + 10
	}
};

GAME.init = function() {
	console.log("init breakout");
	console.log("bla: " + asPx(12));
};

GAME.createStage = function() {
	// TODO: create the stage
};

GAME.createPaddle = function() {
	// TODO: create the paddle
};