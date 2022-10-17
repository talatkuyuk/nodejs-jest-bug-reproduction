const httpMocks = require('node-mocks-http');
const assert  = require('node:assert/strict')

class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

const auth = async (req, res, next) => {
	return new Promise((resolve, reject) => {
		if (!req.header('Authorization'))
			reject(new Error("No Auth Token"));
		resolve();
	})
	.then(() => next())
	.catch((error) => {next(error)});
};


test('should return ApiError if Authorization Header is absent', async () => {
	const req = httpMocks.createRequest();
	const res = httpMocks.createResponse();
	const next = jest.fn();

	// I did't set the Authorization Header of the request intentionally,
	// in order the Auth function to catch the error and call the next(error)

	await auth(req, res, next);

	const expectedError = new ApiError("No Auth Token");

	expect(next).toHaveBeenCalledWith(expectedError);
	// IT PASSED ! THIS IS A PROBLEM !
	// Actually, it should have been like below and shouldn't have passed:
	// Expected: [ApiError: No Auth Token]
	// Received: [Error: No Auth token]
	// This does not make sense since the ApiError instance is not the same with the Error instance!
});

it('should return fail correctly if the wrong error type is asserted', async () => {
  // This test fails correctly as it should
	const req = httpMocks.createRequest();
	const res = httpMocks.createResponse();
	const next = jest.fn();

	// I did't set the Authorization Header of the request intentionally,
	// in order the Auth function to catch the error and call the next(error)

	await auth(req, res, next);

	const expectedError = new ApiError("No Auth Token");
  const firstArg = next.mock.calls[0][0]
  assert.deepStrictEqual(firstArg, expectedError)
});

