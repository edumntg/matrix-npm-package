// Example of multiplying matrix with another matrix/constant
const mat = require('../matrix/Matrix');

describe('Testing matrix itercolumns generator', () => {
    let M;

    beforeAll(() => {
        // Initialize a 3x3 matrix
        M = new mat.Matrix([
            [5, 9, 2],
            [1, 8, 5],
            [3, 6, 4]
        ]);

    });

    test('Test correct columns returned', () => {
        const iter = M.itercolumns();
        expect(iter.next().value).toStrictEqual([5,1,3]);
        expect(iter.next().value).toStrictEqual([9,8,6]);
        expect(iter.next().value).toStrictEqual([2,5,4]);
    });

    test('Test correct Array-type returned', () => {
        for(let row of M.itercolumns()) {
            expect(row).toBeInstanceOf(Array);
        }
    });

    test('Test correct Matrix-type returned', () => {
        for(let row of M.itercolumns(as_matrix = true)) {
            expect(row).toBeInstanceOf(mat.Matrix);
        }
    });
})