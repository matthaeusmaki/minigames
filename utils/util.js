/*
 * Utility functions for games
 */

/*
 * Gets a int-value and returns a px-value
 */
function asPx(value) {
	return value + "px";
}

/*
 * Parsing a px-value and returns its int-value
 */
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

/*
 * Represents a box to show the fps value.
 * fps: fps value
 * box: div model
 * startTime: start time of fps box
 * counter: counts the frames
 * createFPSbox: function creates the box
 * updateFPS: function updates the counter respectively the fps value
 */
var FPSinfo = {
	fps : 0,
	box : undefined,
	startTime : undefined,
	counter : 0,
	createFPSbox : function() {
		box = document.createElement("div");
		box.style.position = "absolute";
		box.style.top = asPx(10);
		box.style.left = asPx(config.world.width-60);
		box.style.border = "1px solid black";
		box.style.zIndex = "999";
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