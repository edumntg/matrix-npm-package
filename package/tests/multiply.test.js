// Example of multiplying matrix with another matrix/constant
const mat = require('../matrix/Matrix');

describe('Testing matrix multiplication functionality', () => {
    let M1;
    let M2;
    let k;
    let expected1;
    let expected2;
    beforeAll(() => {
        // Initialize a 3x3 matrix
        M1 = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

        // Initialize a 3x4 matrix
        M2 = new mat.Matrix([
            [7, 5, -3, 12],
            [8, -1, 0, 4],
            [-9, -3, 0, -1]
        ]);

        k = 2;

        expected1 = new mat.Matrix([
            [89, 10, -15, 94],
            [26, -18, -3, 39],
            [33, -3, -9, 56]
        ]);

        expected2 = new mat.Matrix([
            [10, 18, 4],
            [2, 16, 10],
            [6, 12, 8]
        ]);
    });

    test('Test correct values after matrix multiplication', () => {
        let M12 = M1.multiply(M2);
        expect(M12.diff(expected1).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after matrix multiplication', () => {
        let M12 = M1.multiply(M2);
        expect(M12.shape).toStrictEqual([3, 4]);
    });

    test('Test correct values after scalar multiplication', () => {
        let M1k = M1.multiply(k);
        expect(M1k.diff(expected2).norm()).toBeLessThan(1E-6);
    });

    test('Test correct size after scalar multiplication', () => {
        let M1k = M1.multiply(k);
        expect(M1k.shape).toStrictEqual(M1.shape);
    });

    test('Test correct error message when shapes does not match', () => {
        try {
            M2.multiply(M1);
        } catch(error) {
            expect(error.message).toEqual("Invalid matrices dimensions. Got [3,4]x[3,3]");
        }
    });
})