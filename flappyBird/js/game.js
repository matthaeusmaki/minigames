/**
 * Game Logic
 */

var isKeyDown = false;
var isRunning = false;
var isJumping = false;

var deltaTime = 0;
var pipeTime = 0;

var tapToStart;

var gameLoop;

var score = {
	count: 0,
	model: undefined,
	width: 30,
	height: 30,
	addPoint: function () {
		this.count++;
		this.model.innerText = this.count;
	}
};

var config = {
	bird: {
		fallingConst: 0.0005,
		jumpSpeed: -0.25,
	},
	pipe: {
		width: 40,
		buffer: 90,
		speed: 3,
		interval: 1500, // in milliseconds
		minDistanceToBorder: 35 // minimum distance to border 
	},
	game: {
		jump: [32, 1] //space, mouseleft
	},
	world: {
		width: 800,
		height: 400
	},
};

var bird = {
	id: "bird",
	styleClass: "bird",
	width: 25,
	height: 25,
	rotation: 0,
	position: {
		x: 100,
		y: 100
	},
	speed: {
		x: 0,
		y: 0
	},
	model: undefined,
	setX: function (posX) {
		this.position.x = posX;
		model.style.left = asPx(posX);
	},
	setY: function (posY) {
		this.position.y = posY;
		this.model.style.top = asPx(posY);
	},
	setStyleClass: function (styleClass) {
		this.styleClass = styleClass;
		this.model.className = styleClass;
	},
	rotate: function (deg) {
		this.rotation = deg;
		this.model.style.transform = "rotate(" + deg + "deg)";
	}
};

var background = {
	layer: []
};

var pipes = [];

function init() {
	FPSinfo.createFPSbox();
	createBackground();
	createBird();
	createStartOverlay();
	pause();
};

function start() {
	reset();
	removeElement(tapToStart);
	createPipes();
	createScore();
	resume();
	startTime = new Date().getTime();
	gameLoop = setInterval(update, 16);
};

function pause() {
	isRunning = false;
};
function resume() {
	isRunning = true;
};
function stop() {
	isRunning = false;
	createStartOverlay();
	tapToStart.innerText = score.count + " points, " + tapToStart.innerText;
};

function reset() {
	isKeyDown = false;
	isRunning = false;
	isJumping = false;
	deltaTime = 0;
	pipeTime = 0;
	bird.position.x = 100;
	bird.position.y = 100;
	score.count = 0;
	if (pipes != undefined && pipes.length > 0) {
		for (var i = pipes.length - 1; i >= 0; --i) {
			removeElement(pipes[i].model);
		}
		pipes.length = 0;
	}
	if (gameLoop != undefined) {
		clearInterval(gameLoop);
	}
};

// creation
function createStartOverlay() {
	var width = 250;
	var height = 75;
	tapToStart = createElement("", "tap-to-start overlay", width, height, { x: config.world.width / 2 - width / 2, y: config.world.height / 2 - height / 2 });
	tapToStart.innerText = "Tap to start";
};

function createBackground() {
	background.layer.push(createElement("bg0", "bg-layer-0", config.world.width, 50, { x: 0, y: config.world.height })); // ground
	background.layer.push(createElement("bg1", "bg-layer-1", config.world.width, 80, { x: 0, y: config.world.height - 50 })); // hedges
	background.layer.push(createElement("bg2", "bg-layer-2", config.world.width, config.world.height, { x: 0, y: 0 })); // sky and clouds
};

function createBird() {
	bird.model = createElement(bird.id, bird.styleClass, bird.width, bird.height, bird.position);
};

function createPipes() {
	var randomHeight = parseInt(Math.random() * (config.world.height - config.pipe.buffer));
	var topHeight = Math.min(Math.max(config.pipe.minDistanceToBorder, randomHeight), config.world.height - config.pipe.minDistanceToBorder - config.pipe.buffer);
	var bottomHeight = config.world.height - topHeight - config.pipe.buffer;
	createPipe(topHeight, 0, true);  // top
	createPipe(bottomHeight, config.world.height - bottomHeight, false); // bottom
	createScoreTrigger(config.world.height - topHeight - bottomHeight, topHeight); // trigger of score points
};

function createPipe(height, posY, isTop) {
	var p = {
		width: config.pipe.width,
		id: "pipe",
		styleClass: "pipe",
		height: height,
		isActive: true,
		bottomOffset: 10,
		isTop: isTop,
		position: {
			x: config.world.width - config.pipe.width,
			y: posY
		},
		setX: function (posX) {
			this.position.x = posX;
			this.model.style.left = asPx(posX);
			// this.modelBody.style.left = asPx(posX + p.bottomOffset/2);
		},
		setY: function (posY) {
			this.position.y = posY;
			this.model.style.top = asPx(posY);
			// this.modelBody.style.top = asPx(posY);
		},
		deactivate: function () {
			this.isActive = false;
			this.model.style.display = "none";
			// this.modelBody.style.display = "none";
		}

	};
	// p.modelBody = createElement(p.id+"Body", p.width-p.bottomOffset, p.height, { x: p.position.x + p.bottomOffset/2, y:p.position.y });
	p.model = createElement(p.id, p.styleClass, p.width, p.height, { x: p.position.x, y: p.position.y });
	pipes[pipes.length] = p;
};

function createScoreTrigger(height, posY) {
	var trigger = {
		width: 2,
		id: "trigger",
		styleClass: "trigger",
		height: height,
		isActive: true,
		position: {
			x: config.world.width,
			y: posY
		},
		setX: function (posX) {
			this.position.x = posX;
			this.model.style.left = asPx(posX);
		},
		setY: function (posY) {
			this.position.y = posY;
			this.model.style.top = asPx(posY);
		},
		deactivate: function () {
			this.isActive = false;
			this.model.style.display = "none";
		}
	};
	trigger.model = createElement(trigger.id, trigger.styleClass, 2, height, { x: config.world.width, y: posY }, "");
	pipes[pipes.length] = trigger;
};

function createScore() {
	score.model = createElement("score", "score overlay", score.width, score.height, { x: 10, y: 10 });
	score.model.innerText = score.count;
};

// simulation
function update() {
	if (isRunning) {
		if (pipeTime >= config.pipe.interval) {
			createPipes();
			pipeTime = 0;
		}
		updateBird();
		updatePipes();
		checkCollision();
		updateBackground();

		var newTime = new Date().getTime();
		deltaTime = newTime - startTime; //Math.max(16, newTime- this.GAME.startTime);
		startTime = newTime;
		pipeTime += deltaTime;

		FPSinfo.updateFPS();
	}
};

function updateBird() {
	var pos = Math.max(0, Math.min(bird.position.y + bird.speed.y * deltaTime, config.world.height - bird.height));
	if (isJumping && pos > 0) {
		isJumping = false;
		bird.speed.y = config.bird.jumpSpeed;
		bird.rotate(-30);
	} else {
		if (bird.rotation < 30) {
			bird.rotate(bird.rotation + 1.5);
		}
	}

	if (bird.speed.y < 0) {
		bird.setStyleClass("bird-1");
	} else {
		bird.setStyleClass("bird");
	}

	bird.setY(pos);
	bird.speed.y += config.bird.fallingConst * deltaTime;
};

function updatePipes() {
	for (var i = pipes.length - 1; i >= 0; i--) {
		var p = pipes[i];
		var pos = p.position.x - config.pipe.speed;
		if (!p.isActive || pos + config.pipe.width <= 0) {
			removeElement(p.model)
			pipes.splice(i, 1);
		} else {
			p.setX(pos);
		}
	}
};

// collision detection
/* x1	x2
   +-----+  y1
   |		|
   |    	|
   +-----+  y2
*/
function checkCollision() {
	// check collision top/bottom
	if (bird.position.y <= 0 || bird.position.y + bird.height >= config.world.height) {
		stop();
	} else {
		var birdX1 = bird.position.x;
		var birdX2 = birdX1 + bird.width;
		var birdY1 = bird.position.y;
		var birdY2 = birdY1 + bird.height;

		for (var i = 0; i < pipes.length; i++) {
			var pipe = pipes[i];

			var pipeX1 = pipe.position.x;
			var pipeX2 = pipeX1 + pipe.width;
			var pipeY1 = pipe.position.y;
			var pipeY2 = pipeY1 + pipe.height;

			var cX = [
				pipeX1 <= birdX2 && pipeX2 > birdX2,
				pipeX1 <= birdX1 && pipeX2 >= birdX2,
				pipeX2 >= birdX1 && pipeX1 < birdX1
			];

			var cY = [
				pipeY2 >= birdY1 && pipeY2 < birdY2,
				pipeY1 <= birdY2 && pipeY2 > birdY2,
				pipeY1 <= birdY1 && pipeY2 >= birdY2
			];

			if (cX[0] && cY[0] || cX[0] && cY[1] || cX[0] && cY[2] ||
				cX[1] && cY[0] || cX[1] && cY[1] || cX[1] && cY[2] ||
				cX[2] && cY[0] || cX[2] && cY[1] || cX[2] && cY[2]) {

				if (pipe.id == "trigger") {
					// add point and remove trigger
					pipe.deactivate();
					score.addPoint();
				} else {
					stop();
				}
			}
		}
	}

};

function updateBackground() {
	var paralaxDifference = 1;
	for (var i = 0; i < background.layer.length; i++) {
		var bg = background.layer[i];
		if (Math.abs(asNum(bg.style.backgroundPosition)) >= config.world.width) {
			bg.style.backgroundPosition = asPx(0) + " 0";
		} else {
			bg.style.backgroundPosition = asPx(asNum(bg.style.backgroundPosition) - config.pipe.speed / (i + paralaxDifference)) + " 0";
		}
	}
};

// controlls
function keydown(e) {
	// console.log(e);
	if (!isKeyDown) {
		isKeyDown = true;
		if (e.which == config.game.jump[0] || e.which == config.game.jump[1]) {
			if (isRunning) {
				jump();
			} else {
				start();
				jump();
			}
			// } else if (e.keyCode == 13) {
			// debug input
		}
	}
};

function keyup(e) {
	if (isKeyDown) {
		isKeyDown = false;
	}
};

function jump() {
	isJumping = true;
};


////////////////////////////////////////////
// utilities
////////////////////////////////////////////

function asPx(value) {
	return value + "px";
}

function asNum(value) {
	if (value == undefined || value == "") {
		return 0;
	}
	return parseInt(value.replace("px", ""));
}

/**
 * Creates a div, adds it to body and returns it.
 * id : className
 * width : width of div
 * height : height of div
 * position : object with x and y value
 * color : color or background-image of div
 */
function createElement(id, styleClass, width, height, position, color) {
	var model = document.createElement("div");
	model.id = id;
	model.className += styleClass;
	model.style.width = asPx(width);
	model.style.height = asPx(height);
	model.style.background = color != "" ? color : "transparent";
	model.style.position = "absolute";
	model.style.left = asPx(position.x);
	model.style.top = asPx(position.y);
	document.body.appendChild(model);
	return model;
}

function removeElement(element) {
	document.body.removeChild(element);
}


var FPSinfo = {
	fps: 0,
	box: undefined,
	startTime: undefined,
	counter: 0,
	createFPSbox: function () {
		box = document.createElement("div");
		box.style.position = "absolute";
		box.style.top = asPx(10);
		box.style.left = asPx(config.world.width - 60);
		box.style.border = "1px solid black";
		box.style.zIndex = "999";
		box.id = "fps"
		box.innerText = "fps: ";
		document.body.appendChild(box);
		this.startTime = new Date().getTime();
	},
	updateFPS: function () {
		this.counter++;
		var now = new Date().getTime();
		if (now - this.startTime > 1000) {
			this.startTime = now;
			this.fps = this.counter;
			box.innerText = "fps: " + this.fps;
			this.counter = 0;
		}
	}
}
