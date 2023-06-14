// Compute the cofactor matrix
const {Matrix} = require('js-mat');

// Create a matrix from an array
let M = new Matrix([
    [5, 9, 2],
    [1, 8, 5],
    [3, 6, 4]
]);

// Calculate its inverse and print it
console.log(M.cof());