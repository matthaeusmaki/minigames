/**
 * This script contains functions to work with vectors.
 * It based on the book "2D Game Collision Detection" by Thomas Schwarzl
 */
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Vector2D and helper functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 /**
  * 2D-Vector prototype. Initialize with new
  * @param x : x coordinate
  * @param y : y coordinate
  */
 function Vector2D(x, y) {
	this.x = x;
	this.y = y;
}
 
 /**
  * Returns a new Vector2D which contains the sum of 2 Vector2D
  * @param v1 : first 2D vector
  * @param v2 : second 2D vector
  * @return Vector2D
  */
function addVector(v1, v2) {
	return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

/**
 *	Returns a new Vector2D which contains the difference of 2 Vector2D
 * @param v1 : first 2d vector
 * @param v2 : second 2d vector
 * @return Vector2D
 */
function subtractVector(v1, v2) {
	return new Vector2D(v1.x - v2.x, v1.y - v2.y);
}

/**
 * Returns a new Vector2D which negated
 * @param v : Vector2D
 * @return Vector2D
 */
function negateVector(v) {
	return new Vector2D(-v.x, -v.y);
}

/**
 *	Returns a new Vector2D which the vecor v multiplied by a scalar
 * @param v : Vector2D to multiply
 * @param scalar : float to multiply with
 * @return Vector2D
 */
function multiplyVector(v, scalar) {
	return new Vector2D(v.x * scalar, v.y * scalar);
}

/**
 *	Returns a new Vector2D which is the divided vector v by an divisor
 * @param v : Vector2D to divide
 * @param divisor : float to divide with
 * @return Vector2D
 */
function divideVector(v, divisor) {
	if (divisor == 0) {
		return new Vector2D(0,0); // the vector points nowhere
	}
	return new Vector2D(v.x / divisor, v.y / divisor);
}

/**
 *	Returns the length of the vector v
 * @param v : Vector2D
 * @return float
 */
function vectorLength(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 *	Returns the unified vector of v
 * @param v : Vector2D to unify
 * @return Vector2D
 */
function unitVector(v) {
	var length = vectorLength(v);
	if (length > 0) {
		return divideVector(v, length);
	}
	return v;
}

// Rotation

/**
 * Converts a degrees to radian
 * @param degrees : float
 * @return float
 */
function degreesToRadian(degrees) { 
	return degrees * Math.PI / 180.0;
}

/**
 * Converts a radian to degrees
 * @param radian : float
 * @return float
 */
function radianToDegrees(radian) {
	return radian * 180.0 / Math.PI;
}

/**
 * Returns a rotated Vector2D
 * @param v : Vector2D to rotate
 * @param degrees : rotate by this angle (not radian)
 * @return Vector2D
 */
function rotateVector(v, degrees) {
	var rad = degreesToRadian(degrees);
	var sine = Math.sin(rad);
	var cosine = Math.cos(rad);
	return new Vector2D(v.x * cosine - v.y * sine, v.x * sine + v.y * cosine);
}

/**
 * Returns the dot product of 2 Vector2D.
 * @param v1: Vector2D
 * @param v2: Vector2D
 * @return float
 */
function dotProduct(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Returns angle between two vectors
 * @param v1 : Vector2D
 * @param v2 : Vector2D
 * @return float
 */
function enclosedAngle(v1, v2) {
	var unitV1 = unitVector(v1);
	var unitV2 = unitVector(v2);
	var dp = dotProduct(unitV1, unitV2);
	return radianToDegrees(Math.acos(dp));
}

// Projection

/**
 * Returns a Vector2D which is the result of projecting a vector onto another
 * @param project : Vector2D to project
 * @param onto : Vector2D to project  onto
* @return Vector2D 
 */
function projectVector(project, onto) {
	var d = dotProduct(onto, onto);
	if (d > 0) {
		var dp = dotProduct(project, onto);
		return multiplyVector(onto, dp / d);
	}
	return onto;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Shapes
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

