/**
 * Helper for testing javascript code
 */
const FAILED = "failed";
const ERROR = "error";

/**
 * Generates an output if the outcome failes
 * @param outcome : a boolean that indicates whether the test passed or failed
 * @param description : a (optional) string for the output, if the test fails
 */
function assert(outcome, description) {
	if (!outcome) {
		let err = new Error(description !== undefined ? description : "assert error");
		err.type = FAILED;
		throw err;
	}
}

function assertNot(outcome, description) {
	assert(!outcome, description);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Unittests for Vector2D functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Runs all tests
 */
function runTests() {
	let errors = 0;
	let failures = 0;
	let allTests = Object.getOwnPropertyNames(vectorTests);
	let resultList = [];
	let resultDom = document.getElementById("resultId");
	let resultListDom = document.getElementById("resultListId");
	for (let t in allTests) {
		try {
			vectorTests[allTests[t]]();
		} catch (err) {
			let testColor;
			if (err.type == FAILED) {
				failures++;
				testColor = "#ffe300";
			} else {
				errors++;
				testColor = "red";
			}
			resultList.push(allTests[t] + " has failed: " + err.message);
			console.warn(resultList[resultList.length - 1]);
			let d = document.createElement("div");
			d.innerHTML = allTests[t];
			d.style = "background-color: " + testColor + "; margin-bottom: 2px; padding: 3px;"
			resultListDom.appendChild(d);
		}
	}
	let testsTxt = allTests.length - errors - failures + "/" + allTests.length + " tests successfull";
	let failuresTxt = failures + " failures";
	let errorsTxt = errors + " errors";
	console.log(testsTxt + ", " + failuresTxt + ", " + errorsTxt);

	let color = "#00db00";
	if (errors > 0) {
		color = "red";
	} else if (failures > 0) {
		color = "#ffe300"
	}

	let div = document.createElement("div");
	div.innerHTML = testsTxt;
	div.style = "background-color: " + color + "; padding: 5px;";
	resultDom.appendChild(div);

	let div1 = document.createElement("div");
	div1.innerHTML = failuresTxt;
	resultDom.appendChild(div1);

	let div2 = document.createElement("div");
	div2.innerHTML = errorsTxt;
	resultDom.appendChild(div2);
}

let vectorTests = {
	testAssertEquals: function () {
		let a = new Vector2D(7, 4);
		let b = new Vector2D(7, 4);
		assert(equalVectors(a, b), "Vectors should be equal");
	},

	testAssertNegativeEquals: function () {
		let a = new Vector2D(-7, -4);
		let b = new Vector2D(-7, -4);
		assert(equalVectors(a, b), "Vectors should be equal");
	},

	testAssertNotEquals: function () {
		let a = new Vector2D(7, 4);
		let b = new Vector2D(8, 3);
		assertNot(equalVectors(a, b), "Vectors should not be equal");
	},

	testAssertNotEquals: function () {
		let a = new Vector2D(-7, -4);
		let b = new Vector2D(7, 4);
		assertNot(equalVectors(a, b), "Vectors should not be equal");
	},

	testAddVector: function () {
		let a = new Vector2D(1, 2);
		let b = new Vector2D(5, -3);
		let c = addVector(a, b);
		assert(c.x === 6, "x value of vector is wrong");
		assert(c.y === -1, "y value of vector is wrong");
	},

	testSubtractVector: function () {
		let a = new Vector2D(4, -3);
		let b = new Vector2D(9, 3);
		let c = subtractVector(a, b);
		assert(c.x === -5, "x value of vector is wrong");
		assert(c.y === -6, "y value of vector is wrong");
	},

	testEqualFloat: function () {
		let a = 1.258764685583332125876468558333212587646855833321258764;
		let b = 1.25865;
		assert(equalFloats(a, b), a + " should be equal to " + b);
	},

	testZeroEqualFloat: function () {
		let a = 0.0;
		let b = 0.0001;
		assert(equalFloats(a, b), a + " should be equal to " + b);
	},

	testNotEqualFloat: function () {
		let a = 1.258764685583332125876468558333212587646855833321258764;
		let b = 1.25864;
		assertNot(equalFloats(a, b), a + " should not be equal to " + b);
	},

	testNegateVector: function () {
		let a = new Vector2D(4, -5);
		let n = negateVector(a);
		assert(n.x === -4, "x value of vector is wrong");
		assert(n.y === 5, "y value of vector is wrong");
	},

	testSubtractAndNegatedVector: function () {
		let a = new Vector2D(8, 2);
		let b = new Vector2D(3, 1);
		let c = addVector(a, negateVector(b));
		assert(equalVectors(c, subtractVector(a, b)));
	},

	testMultiplyVector: function () {
		let a = new Vector2D(6, 3);
		let b = multiplyVector(a, 2);
		assert(equalFloats(b.x, 12), "x value of vector b is wrong");
		assert(equalFloats(b.y, 6), "y value of vector b is wrong");
	},

	testDivideVecor: function () {
		let a = new Vector2D(8, 4);
		let b = divideVector(a, 2);
		assert(equalFloats(b.x, 4), "x value of vector b is wrong");
		assert(equalFloats(b.y, 2), "x value of vector b is wrong");
	},

	testDivideVectorByZero: function () {
		let a = new Vector2D(1, 1);
		let b = divideVector(a, 0);
		assert(equalFloats(b.x, 0), b.x + " should be 0");
		assert(equalFloats(b.y, 0), b.y + " should be 0");
	},

	testDivideByMultiplyVector: function () {
		let a = new Vector2D(8, 4);
		let divisor = 2;
		let b = divideVector(a, divisor);
		let c = multiplyVector(a, 1 / divisor);
		assert(equalVectors(b, c), "values should be equal");
	},

	testVectorLength: function () {
		let a = new Vector2D(10, 5);
		assert(equalFloats(11.1803398875, vectorLength(a)), "Length of vector is wrong");
	},

	testVectorLengthOfNullVector: function () {
		assert(equalFloats(0, vectorLength(new Vector2D(0, 0))), "Length of null-vector is wrong");
	},

	testUnitVector: function () {
		let a = new Vector2D(10, 5);
		assert(1 != vectorLength(a), "Length of vector is wrong");
		let u = unitVector(a);
		assert(equalFloats(1, vectorLength(u)), "Length of unit vector is wrong");
	},

	testUnitVectorWithNegativValues: function () {
		let a = new Vector2D(-7, -15);
		assert(1 != vectorLength(a), "Length of vector is wrong");
		let u = unitVector(a);
		assert(equalFloats(1, vectorLength(u)), "Length of unit vector is wrong");
	},

	testUnitVectorWithNullVector: function () {
		let a = new Vector2D(0, 0);
		assert(0 === vectorLength(unitVector(a)), "Length of unit vector is wrong");
	},

	testDegreesToRadian: function () {
		assert(equalFloats(degreesToRadian(0), 0), "Wrong radian (0 degree is 0)");
		assert(equalFloats(degreesToRadian(90), Math.PI / 2), "Wrong radian (90 degree is pi/2)");
		assert(equalFloats(degreesToRadian(180), Math.PI), "Wrong radian (180 degree is pi)");
		assert(equalFloats(degreesToRadian(360), Math.PI * 2), "Wrong radian (360 degree is 2pi)");
		assert(equalFloats(degreesToRadian(405), Math.PI * 2 + Math.PI / 4), "Wrong radian (405 degree is 2pi and pi/4)");
	},
	testRadianToDegrees: function () {
		assert(equalFloats(radianToDegrees(0), 0), "Wrong radian (0 degree is 0)");
		assert(equalFloats(radianToDegrees(Math.PI / 2), 90), "Wrong radian (90 degree is pi/2)");
		assert(equalFloats(radianToDegrees(Math.PI), 180), "Wrong radian (180 degree is pi)");
		assert(equalFloats(radianToDegrees(Math.PI * 2), 360), "Wrong radian (360 degree is 2pi)");
		assert(equalFloats(radianToDegrees(Math.PI * 2 + Math.PI / 4), 405), "Wrong radian (405 degree is 2pi and pi/4)");
	},

	testRotateVector90: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 90), new Vector2D(-1, 1)), "Resulting vector is wrong");
	},
	testRotateVector90_2: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector90(v), new Vector2D(-1, 1)), "Resulting vector is wrong");
	},
	testRotateVector180: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 180), new Vector2D(-1, -1)), "Resulting vector is wrong");
	},
	testRotateVector270: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 270), new Vector2D(1, -1)), "Resulting vector is wrong");
	},
	testRotateVectorMinus90: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, -90), new Vector2D(1, -1)), "Resulting vector is wrong");
	},
	testRotateVector360: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 360), new Vector2D(1, 1)), "Resulting vector is wrong");
	},
	testRotateVector450: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 450), new Vector2D(-1, 1)), "Resulting vector is wrong");
	},
	testRotateVector0: function () {
		let v = new Vector2D(1, 1);
		assert(equalVectors(rotateVector(v, 0), new Vector2D(1, 1)), "Resulting vector is wrong");
	},

	testDotProduct0: function () {
		let a = new Vector2D(8, 2);
		let b = new Vector2D(-2, 8);
		assert(equalFloats(0, dotProduct(a, b)), "Dot product is wrong");
	},
	testDotProduct1: function () {
		let a = new Vector2D(8, 2);
		let b = new Vector2D(-5, 5);
		assert(0 > dotProduct(a, b), "Dot product is wrong");
	},
	testDotProduct2: function () {
		let a = new Vector2D(-2, 8);
		let b = new Vector2D(-5, 5);
		assert(0 < dotProduct(a, b), "Dot product is wrong");
	},

	testEnclosedAngle: function () {
		let a = new Vector2D(8, 2);
		let b = new Vector2D(-2, 8);
		assert(equalFloats(90, enclosedAngle(a, b)), "Wrong angle");
		assert(equalFloats(0, dotProduct(a, b)));
	},

	testProjectVector: function () {
		let a = new Vector2D(12, 5);
		let b = new Vector2D(5, 6);
		assert(equalVectors(projectVector(b, a), new Vector2D(6.390532544378699, 2.6627218934911245)), "Projection is wrong");
	},

	testRectangleCollision: function () {
		let a = new Rectangle(new Vector2D(1, 1), new Vector2D(4, 4));
		let b = new Rectangle(new Vector2D(2, 2), new Vector2D(5, 5));
		let c = new Rectangle(new Vector2D(6, 4), new Vector2D(4, 2));
		assert(rectanglesCollide(a, b), "Should collide");
		assert(rectanglesCollide(b, c), "Should collide");
		assertNot(rectanglesCollide(a, c), "Should not collide");
	},

	testCircleCollision: function () {
		let a = new Circle(new Vector2D(4, 4), 2);
		let b = new Circle(new Vector2D(7, 4), 2);
		let c = new Circle(new Vector2D(10, 4), 2);
		assert(circlesCollide(a, b), "Should collide");
		assert(circlesCollide(b, c), "Should collide");
		assertNot(circlesCollide(a, c), "Should not collide");
	},

	testPointCollision: function () {
		let a = new Vector2D(2, 3);
		let b = new Vector2D(2, 3);
		let c = new Vector2D(3, 4);
		assert(pointsCollide(a, b), "Should collide");
		assertNot(pointsCollide(b, c), "Should not collide");
		assertNot(pointsCollide(a, c), "Should not collide");
	},

	testParallelVectors: function () {
		let a = new Vector2D(2, 2);
		let b = new Vector2D(3, 3);
		let c = new Vector2D(1, 2);
		assert(parallelVectors(a, b), "Vectors should be parallel");
		assertNot(parallelVectors(a, c), "Vectors should not be parallel");
	},

	testLinesCollide: function () {
		let a = new Vector2D(3, 5);
		let b = new Vector2D(3, 2);
		let c = new Vector2D(8, 4);

		let down = new Vector2D(5, -1);
		let up = new Vector2D(5, 2);

		let l1 = new Line(a, down);
		let l2 = new Line(a, up);
		let l3 = new Line(b, up);
		let l4 = new Line(c, down);

		assert(linesCollide(l1, l2), "Collision expected between line l1 and l2");
		assert(linesCollide(l1, l3), "Collision expected between line l1 and l3");
		assertNot(linesCollide(l2, l3), "No Collision expected between line l2 and l3");
		assert(linesCollide(l1, l4), "Collision expected between line l1 and l4");
	},

	testSortRangeMinMax: function () {
		let r = new Range(1, 2);
		let sorted = sortRange(r);
		assert(equalFloats(r.minimum, sorted.minimum), "Minimum is wrong");
		assert(equalFloats(r.maximum, sorted.maximum), "Maximum is wrong");
	},

	testSortRangeMaxMin: function () {
		let r = new Range(6, 0);
		let sorted = sortRange(r);
		assert(equalFloats(r.minimum, sorted.maximum), "Minimum is wrong");
		assert(equalFloats(r.maximum, sorted.minimum), "Maximum is wrong");
	},

	testSegmentsCollide: function () {
		let a = new Vector2D(3, 4);
		let b = new Vector2D(11, 1);
		let c = new Vector2D(8, 4);
		let d = new Vector2D(11, 7);
		let s1 = new Segment(a, b);
		let s2 = new Segment(c, d);
		assertNot(segmentsCollide(s1, s2), "No collision between Segments expected");
	}
}