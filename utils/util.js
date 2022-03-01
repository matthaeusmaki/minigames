/*
 * Utility functions for games
 */

// ///////////////////////////////////////////////////////////////////
// Convert
// //////////////////////////////////////////////////////////////////

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


// ///////////////////////////////////////////////////////////////////
// Element creation
// //////////////////////////////////////////////////////////////////

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
	if (model.className == undefined || model.className === "") {
		model.style.background = color != undefined && color != null && color != "" ? color : "red";
	}
	model.style.position = "absolute";
	model.style.left = asPx(position.x);
	model.style.top = asPx(position.y);
	document.body.appendChild(model);
	return model;
}

function removeElement(element) {
	document.body.removeChild(element);
}


// ///////////////////////////////////////////////////////////////////
// FPS
// ///////////////////////////////////////////////////////////////////

/**
 * Represents a box to show the fps value.
 * fps: fps value
 * box: div model
 * startTime: start time of fps box
 * counter: counts the frames
 * createFPSbox: function creates the box
 * updateFPS: function updates the counter respectively the fps value
 */
var FPSinfo = {
	fps: 0,
	box: undefined,
	startTime: undefined,
	secondsPassed: 0,
	counter: 0,
	secondsPassed: 0,
	oldTimeStamp: 0,
	createFPSbox: function () {
		FPSinfo.box = document.createElement("div");
		FPSinfo.box.style.position = "absolute";
		FPSinfo.box.style.top = asPx(0);
		FPSinfo.box.style.left = asPx(0);
		FPSinfo.box.style.zIndex = "999";
		FPSinfo.box.id = "fps"
		FPSinfo.box.innerText = "fps: ";
		document.body.appendChild(FPSinfo.box);
		FPSinfo.startTime = new Date().getTime();
	},
	updateFPS: function (timestamp) {
		FPSinfo.secondsPassed = (timestamp - FPSinfo.oldTimeStamp) / 1000;
		FPSinfo.oldTimeStamp = timestamp;
		FPSinfo.fps = Math.round(1 / this.secondsPassed);
		FPSinfo.box.innerText = "fps: " + FPSinfo.fps;
	}
}

// ///////////////////////////////////////////////////////////////////
// Time
// //////////////////////////////////////////////////////////////////

/**
 * Get current time in milliseconds.
 * @returns {number}
 */
function currentTime() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}