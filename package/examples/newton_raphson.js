// Find the roots of a system of two equations using the Newton-Raphson method

// Consider the following two equations:
//      x^3 + y = 1
//      y^3 - x = -1

// The solution for this system of equations is:
//      x = 1, y = 0

const {Matrix} = require('../matrix/Matrix');

// Declare the seed point
let x0 = Matrix.rand(2,1);

let n = 0; // iterations counter
let max_iters = 100; // max number of iterations
let eps = 1E-6; // minimum error for convergence
let err = 1E9; // initial error

// Matrix to store the solution at each iteration. Initialize from seed
let X = new Matrix(x0);

console.log('Solving Newton-Raphson with seed:', x0.arr);
// solve
while(err > eps && n < max_iters) {
    // Get current/old solutions
    let Xold = new Matrix([X.getColumn(n)]).T();

    // Evaluate functions at current value
    let f = new Matrix([
        [Math.pow(Xold.get(0,0), 3) + Xold.get(1,0) - 1],
        [Math.pow(Xold.get(1,0), 3) - Xold.get(0,0) + 1]
    ]);

    // Compute Jacobian
    let J = new Matrix([
        [3*Math.pow(Xold.get(0,0), 2), 1],
        [-1, 3*Math.pow(Xold.get(1,0), 2)]
    ]);

    // Compute change
    let delta = J.inv().multiply(f);

    // Compute new values
    let Xnew = Xold.sub(delta);

    // Append new values to solutions vector
    X = X.horzcat(Xnew);

    // Calculate new error. Error is equal to the max. value in the change vector
    err = delta.abs().max();

    // Print
    console.log(`Iteration ${n} -> x = ${Xnew.get(0,0).toFixed(4)}, y = ${Xnew.get(1,0).toFixed(4)} -> error = ${err.toFixed(8)}`);

    // Increment iterations
    n++;
}

if(n < max_iters) {
    console.log('\nThe solution is:')
    console.log(X.getColumn(X.shape()[1]-1));
} else {
    console.log('Max. number of iterations reached. Problem not solved');
}
