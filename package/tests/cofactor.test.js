//import * as mat from '../matrix/Matrix'
const mat = require('../matrix/Matrix')

describe('testing matrix of cofactors functionality', () => {
    let M;
    let expected;
    beforeAll(() => {
        // Create a matrix from an array
        M = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        expected = new mat.Matrix([
            [2, 11, -18],
            [-24, 14, -3],
            [29, -23, 31]
        ]);
    });

    test('Matrix of cofactors should have desired size and elements', () => {
        // Compute cofactors matrix
        let cofM = M.cof();

        expect(cofM.shape).toStrictEqual([3, 3]);
        expect(expected.diff(cofM).norm()).toBeLessThan(1E-6);
    })
})