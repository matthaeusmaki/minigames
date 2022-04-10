/**
 * This script contains functions to work with vectors.
 * It based on the book "2D Game Collision Detection" by Thomas Schwarzl
 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Vector2D and helper functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 2D-Vector prototype. Initialize with new
 * @param {float} x : x coordinate
 * @param {float} y : y coordinate
 */
function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Returns a new Vector2D which contains the sum of 2 Vector2D
 * @param {Vector2D} a : first 2D vector
 * @param {Vector2D} b : second 2D vector
 * @returns {Vector2D} sum of two vectors
 */
function addVector(a, b) {
    return new Vector2D(a.x + b.x, a.y + b.y);
}

/**
 *    Returns a new Vector2D which contains the difference of 2 Vector2D
 * @param {Vector2D} a : first 2d vector
 * @param {Vector2D} b : second 2d vector
 * @return {Vector2D} difference of two vectors
 */
function subtractVector(a, b) {
    return new Vector2D(a.x - b.x, a.y - b.y);
}

/**
* Returns true if float f1 and float f2 are equal with an tolerance of 1.0/8192.0, false otherwise
* @param {float} f1 : float
* @param {float} f2 : float
* @return {boolean} true if f1 and f2 are equal
*/
function equalFloats(f1, f2) {
    var threshold = 0.0001220703125; // 1.0 / 8192.0;
    return Math.abs(f1 - f2) < threshold;
}

/**
 *    If Vector2D a is the same as Vector2D b, this function returns true. Otherwise false.
 * @param {Vector2D} a : Vector2D
 * @param {Vector2D} b : Vector2D
 * @return {boolean} true if a and b are equal
 */
function equalVectors(a, b) {
    return equalFloats(a.x, b.x) && equalFloats(a.y, b.y);
}

/**
 * Returns a new Vector2D which negated
 * @param {Vector2D} v : Vector2D
 * @return {Vector2D} new negated Vector
 */
function negateVector(v) {
    return new Vector2D(-v.x, -v.y);
}

/**
 * Returns a new Vector2D which the vector v multiplied by a scalar
 * @param v : Vector2D to multiply
 * @param scalar : float to multiply with
 * @return Vector2D
 */
function multiplyVector(v, scalar) {
    return new Vector2D(v.x * scalar, v.y * scalar);
}

/**
 * Returns a new Vector2D which is the divided vector v by an divisor.
 * If the divisor is 0 the returned value is a 0-vecotor (x:0, y:0). Pointing nowhere.
 * @param v : Vector2D to divide
 * @param divisor : float to divide with
 * @return Vector2D
 */
function divideVector(v, divisor) {
    if (divisor == 0) {
        return new Vector2D(0, 0); // the vector points nowhere
    }
    return new Vector2D(v.x / divisor, v.y / divisor);
}

/**
 * Returns the length of the vector v
 * @param v : Vector2D
 * @return float
 */
function vectorLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 *    Returns the unified vector of v
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
 * Returns a rotated Vector2D.
 * Positive degrees rotate counterclockwise.
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
 * Returns a Vector2D rotated by 90 degree
 * @param v : Vector2D
 * @return Vector2D
 */
function rotateVector90(v) {
    return new Vector2D(-v.y, v.x);
}

/**
 * Returns the dot product of 2 Vector2D.
 * @param v1: Vector2D
 * @param v2: Vector2D
 * @return float
 */
function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y;
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
//    Shapes
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Line prototype
* @param {Vector2D} base : Vector2D
* @param {Vector2D} direction : Vector2D
*/
function Line(base, direction) {
    this.base = base;
    this.direction = direction;
}

/**
 * Linesegment prototype
 * @param {Vector2D} point1 : Vector2D
 * @param {Vector2D} point2 : Vector2D
 */
function Segment(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
}

/**
 * Circle prototype
 * @param {Vector2D} center : Vector2D
 * @param {float} radius : float
 */
function Circle(center, radius) {
    this.center = center;
    this.radius = radius;
}

/**
 * Rectangle prototype
 * @param {Vector2D} origin : Vector2D
 * @param {Vector2D} size : Vector2D
 */
function Rectangle(origin, size) {
    this.origin = origin;
    this.size = size;
}

/**
 * Oriented rectangle prototype
 * @param {Vector2D} center : center of the rectangle
 * @param {Vector2D} halfExtend : half the size
 * @param {float} rotation : rotation angle 
 */
function OrientedRectangle(center, halfExtend, rotation) {
    this.center = center;
    this.halfExtend = halfExtend;
    this.rotation = rotation;
}

function RangeMinMax(min, max) {
    this.minimum = min;
    this.maximum = max;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Collision
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// rectangle-rectangle

/**
 * Checking overlapping values
 * @param minA : float
 * @param maxA : float
 * @param minB : float
 * @param maxB : float
 * @return boolean
 */
function overlapping(minA, maxA, minB, maxB) {
    return minB <= maxA && minA <= maxB;
}

/**
 * Checking rectangle intersection
 * @param a : Rectangle
 * @param b : Rectangle
 * @return boolean
 */
function rectanglesCollide(a, b) {
    var aLeft = a.origin.x;
    var aRight = aLeft + a.size.x;
    var bLeft = b.origin.x;
    var bRight = bLeft + b.size.x;

    var aBottom = a.origin.y;
    var aTop = aBottom + a.size.y;
    var bBottom = b.origin.y;
    var bTop = bBottom + b.size.y;

    return overlapping(aLeft, aRight, bLeft, bRight) && overlapping(aBottom, aTop, bBottom, bTop);
}

// circle-circle

/**
 * Checking circle intersection
 * @param a : Circle
 * @param b : Circle
 * @return boolean
 */
function circlesCollide(a, b) {
    var radiusSum = a.radius + b.radius;
    var distance = subtractVector(a.center, b.center);
    return vectorLength(distance) <= radiusSum;
}

// point-point

/**
 * Checking point intersection
 * @param a : Vector2D
 * @param b : Vector2D
 * @return boolean
 */
function pointsCollide(a, b) {
    return equalVectors(a, b);
}

// line-line

/**
 * Returns true if two Vector2D are parallel, false otherwise
 * @param a
 * @param b
 * @return boolean
 */
function parallelVectors(a, b) {
    var na = rotateVector90(a)
    return equalFloats(0, dotProduct(na, b));
}

/**
 * Returns true if two Lines are equivalent.
 * @param a
 * @param b
 * @return boolean
 */
function equivalentLines(a, b) {
    if (!parallelVectors(a.direction, b.direction)) {
        return false;
    }
    var d = subtractVector(a.base, b.base);
    return parallelVectors(d, a.direction);
}

/**
 * Returns true if two Lines collide, false otherwise
 * @param a
 * @param b
 * @return boolean
 */
function linesCollide(a, b) {
    if (parallelVectors(a.direction, b.direction)) {
        return equivalentLines(a, b);
    } else {
        return true;
    }
}

// linesegment-linesegment

/**
 * Returns true if both end points of a Line are on the same side of an given axis.
 * @param a : Line
 * @param s : Segment
 * @return boolean
 */
function onOneSide(axis, s) {
    var d1 = subtractVector(s.point1, axis.base);
    var d2 = subtractVector(s.point2, axis.base);
    var n = rotateVector90(axis.direction);
    // if the dot product is 0, the endpoints are on the axis. This means "not separating"
    return dotProduct(n, d1) * dotProduct(n, d2) > 0;
}

/**
 * Sorts the minimum and maximum of a Range
 * @param r : Range
 * @return Range
 */
function sortRange(r) {
    if (r.minimum > r.maximum) {
        return new RangeMinMax(r.maximum, r.minimum);
    }
    return r;
}

/**
 * Projects a Segment onto the given Vector2D
 * @param s : Segment
 * @param onto : Vector2D
 * @return Range
 */
function projectSegment(s, onto) {
    var ontoUnit = unitVector(onto);
    var r = new RangeMinMax(
        dotProduct(ontoUnit, s.point1),
        dotProduct(ontoUnit, s.point2)
    );
    return sortRange(r);
}

/**
 *
 * @param a : Range
 * @param b : Range
 * @return boolean
 */
function overlappingRanges(a, b) {
    return overlapping(a.minimum, a.maximum, b.minimum, b.maximum);
}

/**
 * Checks collision between two Segments
 * @param {Segment} a : Segment
 * @param {Segment} b : Segment
 * @return {boolean}
 */
function segmentsCollide(a, b) {
    var axisA = new Line(a.point1, subtractVector(a.point2, a.point1));
    if (onOneSide(axisA, b)) {
        return false;
    }
    var axisB = new Line(b.point1, subtractVector(b.point2, b.point1));
    if (onOneSide(axisB, a)) {
        return false;
    }
    if (parallelVectors(axisA.direction, axisB.direction)) {
        var rangeA = projectSegment(a, axisA.direction);
        var rangeB = projectSegment(a, axisB.direction);
        return overlappingRanges(rangeA, rangeB);
    } else {
        return true;
    }
}

// oriented-rectangle - oriented-rectangle

/**
 * TODO
 * @param {RangeMinMax} a 
 * @param {RangeMinMax} b 
 * @returns {RangeMinMax}
 */
function rangeHull(a, b) {
    return new RangeMinMax(
        a.minimum < b.minimum ? a.minimum : b.minimum,
        a.maximum > b.maximum ? a.maximum : b.maximum
    );
}

/**
 * TODO
 * @param {OrientedRectangle} r 
 * @param {number} nr 
 * @returns {Segment}
 */
function orientedRectangleEdge(r, nr) {
    let a = new Vector2D(r.halfExtend.x, r.halfExtend.y);
    let b = new Vector2D(r.halfExtend.x, r.halfExtend.y);

    switch (nr % 4) {
        case 0:
            a.x = -a.x;
            break;
        case 1:
            b.y = -b.y;
            break;
        case 2:
            a.y = -a.y;
            b = negateVector(b);
            break;
        default:
            a = negateVector(a);
            b.x = -b.x;
            break;
    }
    a = rotateVector(a, r.rotation);
    a = addVector(a, r.center);

    b = rotateVector(b, r.rotation);
    b = addVector(b, r.center);

    return new Segment(a, b);
}

/**
 * TODO
 * @param {Segment} axis 
 * @param {OrientedRectangle} r 
 * @returns {boolean}
 */
function separatingAxisForOrientedRectangle(axis, r) {
    let rEdge0 = orientedRectangleEdge(r, 0);
    let rEdge2 = orientedRectangleEdge(r, 2);
    let n = subtractVector(axis.point1, axis.point2);

    let axisRange = projectSegment(axis, n);
    let r0Range = projectSegment(rEdge0, n);
    let r2Range = projectSegment(rEdge2, n);
    let rProjection = rangeHull(r0Range, r2Range);

    return !overlappingRanges(axisRange, rProjection);
}

/**
 * TODO
 * @param {OrientedRectangle} a 
 * @param {OrientedRectangle} b 
 * @returns {boolean}
 */
function orientedRectanglesCollide(a, b) {
    let edge = orientedRectangleEdge(a, 0);
    if (separatingAxisForOrientedRectangle(edge, b)) {
        return false;
    }
    edge = orientedRectangleEdge(a, 1);
    if (separatingAxisForOrientedRectangle(edge, b)) {
        return false;
    }
    edge = orientedRectangleEdge(b, 0);
    if (separatingAxisForOrientedRectangle(edge, a)) {
        return false;
    }
    edge = orientedRectangleEdge(b, 1);
    return !separatingAxisForOrientedRectangle(edge, a);
}