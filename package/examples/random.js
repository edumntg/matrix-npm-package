// Create a matrix filled with random numbers
const {Matrix} = require('js-mat');

// Matrix filled with random numbers from 0 and 1
let M = Matrix.rand(5, 8);
console.log(M);

// Matrix filled with random numbers from 0 to 20
M = Matrix.rand(5,8).multiply(20);
console.log(M);