/**
 * Game Logic
 */
// done: Refactoring
// done: Punktebedingung -> Punkte trigger, Kollision mit Punktetrigger

// TODO: reset
// TODO: Texturen 
// TODO: Animation (flap flap, background)
// TODO: GameLoop optimieren bzw. Performance verbessern

var isKeyDown = false;
var isRunning = false;
var isJumping = false;
	
var deltaTime = 0;
var pipeTime = 0;
	
var score = {
	count : 0,
	model : undefined,
	addPoint : function() {
		this.count++;
		this.model.innerText = this.count;
	}
};
	
var config = {
	bird : {
		fallingConst : 0.0005,
		jumpSpeed : -0.25,
	},
	pipe : {
		width : 40,
		buffer : 90,
		speed : 3,
		interval: 1500 // in milliseconds
	},
	game : {
		jump : 32, //space
		pause : 80, // p
	},
	world : {
		width: 800,
		height: 400
	},
};
	
var bird = {
	id : "bird",
	width : 25,
	height : 25,
	color : "red",
	position : {
		x : 100,
		y : 100
	},
	speed : {
		x : 0,
		y : 0
	},
	model : undefined,
	setX : function(posX) {
		this.position.x = posX;
		model.style.left = asPx(posX);
	},
	setY : function(posY) {
		this.position.y = posY;
		this.model.style.top = asPx(posY);
	}
};
	
var pipes = [];
	
function init() {
	FPSinfo.createFPSbox();
	isRunning = true;
	startTime = new Date().getTime();
	createBackground();
	createBird();
	createPipes();
	createScore();
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
	// TODO: reset
};
	
// creation
function createBackground() {
	createElement("bg", config.world.width, config.world.height, {x:0,y:0}, "grey");
};
	
function createBird() {
	bird.model = createElement(bird.id, bird.width, bird.height, bird.position, bird.color);
};
	
function createPipes() {
	var topHeight = Math.min(config.world.height - config.pipe.buffer, parseInt(Math.random() * config.world.height));
	var bottomHeight = config.world.height - topHeight - config.pipe.buffer; 
	createPipe(topHeight, 0);  // top
	createPipe(bottomHeight, config.world.height-bottomHeight); // bottom
	createScoreTrigger(config.world.height-topHeight-bottomHeight, topHeight); // trigger of score points
};
	
function createPipe(height, posY) {
	var p = {
		width: config.pipe.width,
		id : "pipe",
		height: height,
		isActive : true,
		position : {
			x : config.world.width - config.pipe.width,
			y : posY
		},
		setX : function(posX) {
			this.position.x = posX;
			this.model.style.left = asPx(posX);
		},
		setY : function(posY) {
			this.position.y = posY;
			this.model.style.top = asPx(posY);
		},
		deactivate : function() {
			this.isActive = false;
			this.model.style.display = "none";
		}
	};
	p.model = createElement(p.id, p.width, p.height, { x: p.position.x, y:p.position.y }, "green");
	pipes[pipes.length] = p;
};

function createScoreTrigger(height, posY) {
	var trigger = {
		width: 2,
		id : "trigger",
		height: height,
		isActive : true,
		position : {
			x : config.world.width,
			y : posY
		},
		setX : function(posX) {
			this.position.x = posX;
			this.model.style.left = asPx(posX);
		},
		setY : function(posY) {
			this.position.y = posY;
			this.model.style.top = asPx(posY);
		},
		deactivate : function() {
			this.isActive = false;
			this.model.style.display = "none";
		}
	};
	trigger.model = createElement("trigger", 2, height, { x: config.world.width, y:posY }, "");
	pipes[pipes.length] = trigger;
};
	
function createScore() {
	score.model = createElement("score", 50, 50, {x: config.world.width-50, y:0}, "");
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
		
		var newTime = new Date().getTime();
		deltaTime = newTime- startTime; //Math.max(16, newTime- this.GAME.startTime);
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
	}
	bird.setY(pos);
	bird.speed.y += config.bird.fallingConst * deltaTime;
};

function updatePipes() {
	for(var i = pipes.length-1; i >= 0 ; i--) {
		var p = pipes[i];
		var pos = p.position.x - config.pipe.speed;
		if (!p.isActive || pos + config.pipe.width <= 0) {
			document.body.removeChild(p.model);
			pipes.splice(i, 1);
		} else {
			p.setX(pos);
		}
	}
};

// collision detection
/* x1	x2
   +----+  y1
   |	|
   |	|
   +----+  y2
*/	
function checkCollision() {
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
			cX[2] && cY[0] || cX[2] && cY[1] || cX[2] && cY[2] ) {
			
			if (pipe.id == "trigger") {
				// add point and remove trigger
				pipe.deactivate();
				score.addPoint();
			} else {
				this.stop();
			}
		}
	}
};

// controlls
function keydown(e) {
	// console.log(e);
	if (!isKeyDown) {
		isKeyDown = true;
		if (e.which == config.game.jump) {
			jump();
		} else if (e.keyCode == config.game.pause) {
			if (isRunning) {
				pause();
			} else {
				resume();
			}
		} else if (e.keyCode == 13) {
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
function createElement(id, width, height, position, color) {
	var model = document.createElement("div");
	model.className += id;
	model.style.width = asPx(width);
	model.style.height = asPx(height);
	model.style.background = color != "" ? color : "transparent";
	model.style.position = "absolute";
	model.style.left = asPx(position.x);
	model.style.top = asPx(position.y);
	document.body.appendChild(model);
	return model;
}

var FPSinfo = {
	fps : 0,
	box : undefined,
	startTime : undefined,
	counter : 0,
	createFPSbox : function() {
		box = document.createElement("div");
		box.style.position = "absolute";
		box.style.top = asPx(10);
		box.style.left = asPx(10);
		box.style.border = "1px solid black";
		box.style.backgroundColor = "white";
		box.style.zIndex = "999";
		box.style.opacity = "0.5";
		box.id = "fps"
		box.innerText = "fps: ";
		document.body.appendChild(box);
		this.startTime = new Date().getTime();
	},
	updateFPS : function() {
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
