// Inverse of a matrix

const mat = require('../matrix/Matrix');

describe('testing inverse of a matrix functionality', () => {
    let singularM;
    let nonSingularM;
    let nonSquareM;
    let expected;
    beforeAll(() => {
        // Create a matrix from an array
        // Create a matrix from an array
        nonSingularM = new mat.Matrix([
            [5, -2, 2, 7],
            [1, 0, 0, 3],
            [-3, 1, 5, 0],
            [3, -1, -9, 4]
        ]);

        singularM = new mat.Matrix([
            [2, 1, 2],
            [1, 0, 1],
            [4, 1, 4]
        ]);

        nonSquareM = new mat.Matrix([
            [5, -2, 2, 7],
            [1, 0, 0, 3],
            [-3, 1, 5, 0]
        ]);

        expected = new mat.Matrix([
            [-0.1364, 0.8636, -0.6818, -0.4091],
            [-0.6364, 2.3636, -0.9318, -0.6591],
            [0.0455, 0.0455, -0.0227, -0.1136],
            [0.0455, 0.0455, 0.2273, 0.1364]
        ]);
    });

    test('Test inverse functionality of a singular and non-singular matrix', () => {
        // Matrix should not be singular
        expect(nonSingularM.isSingular()).toBe(false);
        expect(nonSingularM.inv().diff(expected).norm()).toBeLessThan(1E-3);
        expect(nonSingularM.inv().shape).toStrictEqual(nonSingularM.shape);

        // Expect an assertion error when trying to calculate the inverse of a singular matrix
        try {
            singularM.inv()
        } catch(error) {
            expect(error.message).toEqual("Matrix is singular");
        }

        // Expect an assertion error when matrix is not square
        try {
            nonSquareM.inv()
        } catch(error) {
            expect(error.message).toEqual("Matrix must be square");
        }
    })
})