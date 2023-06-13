# js-mat
JavaScript library for representation and mathematical operations using matrix

# Usage
Create a matrix of random values:
```
var M = Matrix.rand(3,3); // create a 3x3 matrix
```

Create a null matrix:
```
var M = Matrix.zeros(2,5); // create a 2x5 null matrix
```

Create a matrix of ones:
```
var M = Matrix.ones(2,2) // create a 2x2 matrix of ones
```

Create an identity matrix:
```
var I = Matrix.eye(4); // identity matrix of size 4x4
```

Create a matrix from a 2D array:
```
var M = Matrix.fromArray([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]);
```

Create a matrix from another matrix
```
var M1 = Matrix.rand(3,6);
var M2 = Matrix.fromMatrix(M1); // equal to M1
```

# Operations
Addition:
```
var M1 = Matrix.fromArray([
    [12,7,9],
    [5,-2,3]
]);
var M2 = Matrix.fromArray([
    [-3.6, 0, 5.4],
    [-12,-2,7]
]);

var result = M1.add(M2);
// [8.4, 7, 14.4]
// [-7, -4, -10]
```

Substraction:
```
var M1 = Matrix.fromArray([
    [12,7,9],
    [5,-2,3]
]);
var M2 = Matrix.fromArray([
    [-3.6, 0, 5.4],
    [-12,-2,7]
]);

var result = M1.subs(M2);
// [15.6, 7.0, 3.6]
// [17.0, 0, -4.0]
```

Multiplication:
```
// Multiply two matrices
var M1 = Matrix.fromArray([
    [1, 2, 9],
    [-3, 7, 1]
]);

var M2 = Matrix.fromArray([
    [-5, 1],
    [3, 12],
    [1, 1]
]);

var result = M1.multiply(M2);
// [10, 34]
// [37, 82]
```

```
// Multiply a matrix by a constant
var M1 = Matrix.fromArray([
    [1, 2, 9],
    [-3, 7, 1]
]);

var result = M1.multiply(5);
// [5, 10, 45]
// [-15, 35, 5]
```

Determinant:
```
var M = Matrix.fromArray([
]);
```