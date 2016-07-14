/**
 * Helper for testing javascript code
 */
var FAILED = "failed";
var ERROR = "error";
 
/**
 * Generates an output if the outcome failes
 * @param outcome : a boolean that indicates whether the test passed or failed
 * @param description : a (optional) string for the output, if the test fails
 */
 function assert(outcome, description) {
	 if (!outcome) {
		var err = new Error(description !== undefined ? description : "assert error");
		err.type = FAILED;
		throw err;
	 }
 }
 
 /**
 * Returns true if float f1 and float f2 are equal with an tolerance of 1.0/8192.0, false otherwise
 * @param f1 : float
 * @param f2 : float
 * @return boolean
 */
function equalFloats(f1, f2) {
	var threshold = 1.0 / 8192.0;
	return Math.abs(f1 - f2) < threshold;
}

/**
 *	If Vector2D v1 is the same as Vector2D v2, this function does nothing. Otherwise it throws an error.
 * @param v1 : Vector2D
 * @param v2 : Vector2D
 * @return boolean
 */
function assertEqualVectors(v1, v2) {
	assert(equalFloats(v1.x, v2.x));
	assert(equalFloats(v1.y, v2.y));
}
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Unittests for Vector2D functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Runs all tests
 */
function runTests() {
	var errors = 0;
	var failed = 0;
	var allTests = Object.getOwnPropertyNames(vectorTests);
	for (var t in allTests) {
		try {
			vectorTests[allTests[t]]();			
		} catch (err) {
			if (err.type == FAILED) {
				failed++;
			} else {
				errors++;				
			}
			console.warn(allTests[t] + " has failed: " + err.message);
		}
	}
	return allTests.length-errors + "/" + allTests.length + " tests successfull, " + failed + " failures, " + errors + " errors";
}
 
var vectorTests =  {
	testAssertEquals : function() {
		var a = new Vector2D(7, 4);
		var b = new Vector2D(3, -3);
		var c = addVector(a, negateVector(b));
		assertEqualVectors(c, subtractVector(a, b), "Vectors should be equal"); 
	},
	
	testAddVector : function() {
		var a = new Vector2D(1, 2);
		var b = new Vector2D(5, -3);
		var c = addVector(a, b);
		assert(equalFloats(c.x, 6), "x value of vector is wrong");
		assert(equalFloats(c.y, -1), "y value of vector is wrong");
	},
	
	testNegateVector : function() {
		var a = new Vector2D(4, -5);
		var n = negateVector(a);
		assert(equalFloats(n.x, -4), "x value of vector is wrong");
		assert(equalFloats(n.y, 5), "y value of vector is wrong");
	},
	
	testSubtractVector : function() {
		var a = new Vector2D(4, -3);
		var b = new Vector2D(9, 3);
		var c = subtractVector(a, b);
		assert(equalFloats(c.x, -5), "x value of vector is wrong");
		assert(equalFloats(c.y, -6), "y value of vector is wrong");
	},
	
	testMultiplyVector : function() {
		var a = new Vector2D(6,3);
		var b = multiplyVector(a, 2);
		assert(equalFloats(b.x, 12), "x value of vector b is wrong");
		assert(equalFloats(b.y, 6), "y value of vector b is wrong");
	},
	
	testDivideVecor : function() {
		var a = new Vector2D(8, 4);
		var b = divideVector(a, 2);
		assert(equalFloats(b.x, 4), "x value of vector b is wrong");
		assert(equalFloats(b.y, 2), "x value of vector b is wrong");
	},
	
	testDivideVectorByZero : function() {
		var a = new Vector2D(1,1);
		assert(divideVector(a, 0));
	},
	
	testVectorLength : function() {
		var a = new Vector2D(10, 5);
		assert(equalFloats(11.1803398875, vectorLength(a)), "Length of vector is wrong");
	},
	
	testVectorLengthOfNullVector : function() {
		assert(equalFloats(0, vectorLength(new Vector2D(0,0))), "Lencht of null vector is wrong");
	},
	
	testUnitVector : function() {
		var a = new Vector2D(10, 5);
		assert(1 < vectorLength(a), "Length of vector is wrong");
		var u = unitVector(a);
		assert(equalFloats(1, vectorLength(u)), "Length of unit vector is wrong");
	}
}