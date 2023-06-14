// Inverse of a matrix

const {Matrix} = require('js-mat');

// Create a matrix from an array
let M = new Matrix([
    [5, -2, 2, 7],
    [1, 0, 0, 3],
    [-3, 1, 5, 0],
    [3, -1, -9, 4]
]);

// Calculate its inverse and print it
console.log(M.inv());