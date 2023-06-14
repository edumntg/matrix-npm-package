// Example of multiplying matrix with another matrix/constant
const {Matrix} = require('js-mat');

// Initialize a 3x3 matrix
let M1 = new Matrix([
    [5, 9, 2],
    [1, 8, 5],
    [3, 6, 4]
]);

// Initialize a 3x4 matrix
let M2 = new Matrix([
    [7, 5, -3, 12],
    [8, -1, 0, 4],
    [-9, -3, 0, -1]
]);

// Multiply
let result = M1.multiply(M2); // should be of size 3x4
console.log(result);