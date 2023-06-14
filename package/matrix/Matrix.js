"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
var assert_1 = require("assert");
var Matrix = exports.Matrix = /** @class */ (function () {
    function Matrix(m) {
        if (m instanceof Matrix) {
            this.construct_fromM(m);
        }
        else if (Array.isArray(m)) {
            this.construct_fromArr(m);
        }
        else {
            this.construct_empty();
        }
    }
    Matrix.prototype.construct_empty = function () {
        this.arr = [];
        this.nrows = 0;
        this.ncols = 0;
        return this;
    };
    Matrix.prototype.construct_fromM = function (m) {
        this.arr = __spreadArray([], m.arr, true);
        this.nrows = m.nrows;
        this.ncols = m.ncols;
        return this;
    };
    Matrix.prototype.construct_fromArr = function (arr) {
        (0, assert_1.strict)(Array.isArray(arr), "Argument must be of array type");
        // get size
        var rows = arr.length;
        var columns = Array.isArray(arr[0]) ? arr[0].length : 1;
        this.arr = __spreadArray([], arr, true);
        this.nrows = rows;
        this.ncols = columns;
        return this;
    };
    Matrix.prototype.isSquare = function () {
        return this.nrows === this.ncols;
    };
    Matrix.prototype.isSingular = function () {
        return this.det() <= Matrix.MIN_DET;
    };
    Matrix.rand = function (rows, columns) {
        // Create empty array
        var arr = [];
        // fill with rows of random values
        var row;
        for (var i = 0; i < rows; i++) {
            row = Array.from({ length: columns }, function () { return Math.random(); });
            arr.push(row.slice());
        }
        // Now create matrix
        return Matrix.fromArray(arr);
    };
    Matrix.zeros = function (rows, columns) {
        var matrix = new Matrix(null);
        matrix.nrows = rows;
        matrix.ncols = columns;
        var row = new Array(columns).fill(0);
        for (var i = 0; i < rows; i++) {
            matrix.arr.push(row.slice());
        }
        return matrix;
    };
    Matrix.prototype.ones = function (rows, columns) {
        // create a matrix of zeros
        var matrix = Matrix.zeros(rows, columns);
        // Fill with 1
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                matrix.set(i, j, 1);
            }
        }
        return matrix;
    };
    Matrix.fromArray = function (arr) {
        (0, assert_1.strict)(Array.isArray(arr), "Argument must be of array type");
        // get size
        var rows = arr.length;
        var columns = Array.isArray(arr[0]) ? arr[0].length : 1;
        // Now, create a new matrix and set parameters
        var matrix = new Matrix(null);
        matrix.arr = arr;
        matrix.nrows = rows;
        matrix.ncols = columns;
        return matrix;
    };
    Matrix.fromMatrix = function (m) {
        // get size of matrix
        var rows = m.nrows;
        var columns = m.ncols;
        // Create an empty matrix
        var matrix = Matrix.zeros(rows, columns);
        // Fill
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                matrix.set(i, j, m.get(i, j));
            }
        }
        return matrix;
    };
    Matrix.prototype.multiply = function (param) {
        if (param instanceof Matrix) {
            return this.matmul(param);
        }
        else if (typeof (param) === 'number') {
            return this.kmatmul(param);
        }
        else {
            console.log("Parameter given for multiplication is invalid");
            return null;
        }
    };
    Matrix.prototype.matmul = function (m) {
        // get shape of each matrix to validate their dimensions
        var rows1 = this.nrows;
        var cols1 = this.ncols;
        var rows2 = m.nrows;
        var cols2 = m.ncols;
        (0, assert_1.strict)(cols1 === rows2, "Invalid matrices dimensions");
        // Create empty matrix to store result
        var matrix = Matrix.zeros(rows1, cols2);
        // Now, multiply
        for (var i = 0; i < rows1; i++) {
            for (var j = 0; j < cols2; j++) {
                for (var k = 0; k < rows2; k++) {
                    matrix.set(i, j, matrix.get(i, j) + this.get(i, k) * m.get(k, j));
                }
            }
        }
        return matrix;
    };
    Matrix.row_kmatmul = function (row, k) {
        var arr = row.map(function (x) { return x * k; });
        return arr;
    };
    Matrix.prototype.kmatmul = function (k) {
        console.assert(typeof (k) === 'number', "Argument must be a constant");
        // create a copy
        var copy = Matrix.fromMatrix(this);
        // Multiply
        var rows = copy.nrows;
        for (var i = 0; i < rows; i++) {
            copy.setRow(i, Matrix.row_kmatmul(copy.getRow(i), k));
        }
        return copy;
    };
    Matrix.prototype.add = function (M) {
        // Check that both matrices have the same size
        (0, assert_1.strict)(this.shape()[0] === M.shape()[0] && this.shape()[1] === M.shape()[1], "Matrices must have the same shape");
        // Create a copy of this matrix
        var result = Matrix.fromMatrix(M);
        // Now add
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                result.set(i, j, this.get(i, j) + M.get(i, j));
            }
        }
        return result;
    };
    Matrix.prototype.sub = function (M) {
        // Check that both matrices have the same size
        (0, assert_1.strict)(this.shape()[0] === M.shape()[0] && this.shape()[1] === M.shape()[1], "Matrices must have the same shape");
        // Create a copy of this matrix
        var result = Matrix.fromMatrix(M);
        // Now add
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                result.set(i, j, this.get(i, j) - M.get(i, j));
            }
        }
        return result;
    };
    Matrix.prototype.getRow = function (rowIndex) {
        (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        return this.arr[rowIndex];
    };
    Matrix.prototype.setRow = function (rowIndex, row) {
        (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        (0, assert_1.strict)(Array.isArray(row), "Row parameter must be an array of numbers");
        (0, assert_1.strict)(this.ncols === row.length, "New row must have the same number of columns");
        // set row
        for (var i = 0; i < this.ncols; i++) {
            this.set(rowIndex, i, row[i]);
        }
        return this;
    };
    Matrix.prototype.getColumn = function (columnIndex) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        var column = [];
        // Insert values from column
        for (var i = 0; i < this.nrows; i++) {
            column.push(this.get(i, columnIndex));
        }
        return column;
    };
    Matrix.prototype.setColumn = function (columnIndex, column) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        (0, assert_1.strict)(Array.isArray(column), "Column must be aan array");
        (0, assert_1.strict)(column.length === this.nrows, "New column must have the same number of rows");
        // set column
        for (var i = 0; i < this.nrows; i++) {
            this.set(i, columnIndex, column[i]);
        }
        return this;
    };
    Matrix.prototype.set = function (row, column, value) {
        (0, assert_1.strict)(typeof (row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        (0, assert_1.strict)(typeof (column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");
        this.arr[row][column] = value;
        return this;
    };
    Matrix.prototype.get = function (row, column) {
        (0, assert_1.strict)(typeof (row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        (0, assert_1.strict)(typeof (column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");
        return this.arr[row][column];
    };
    Matrix.eye = function (size) {
        (0, assert_1.strict)(typeof (size) === 'number' && size > 0, "Param argument must be a positive number");
        // Create an empty matrix filled with zeros
        var matrix = Matrix.zeros(size, size);
        // Fill diagonal
        for (var i = 0; i < size; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    };
    Matrix.prototype.size = function () {
        return this.shape()[0] * this.shape()[1];
    };
    Matrix.prototype.shape = function () {
        return [this.nrows, this.ncols];
    };
    Matrix.prototype.det = function () {
        (0, assert_1.strict)(this.nrows === this.ncols, "Matrix is not square");
        if (this.nrows === 1) {
            return this.get(0, 0);
        }
        else if (this.nrows == 2) {
            return this.get(0, 0) * this.get(1, 1) - this.get(1, 0) * this.get(0, 1);
        }
        else {
            // Calculate determinant
            var sums = 0;
            var retInDet = 1;
            var size = this.nrows;
            for (var colDet = 0; colDet < size; colDet++) {
                // Create empty matrix of size - 1
                var innerMatrix = Matrix.zeros(size - 1, size - 1);
                for (var row = 1, rowInner = 0; row < size; row++) {
                    for (var column = 0, columnInner = 0; column < size; column++) {
                        if (column === colDet) {
                            continue;
                        }
                        innerMatrix.set(rowInner, columnInner, this.get(row, column));
                        columnInner++;
                    }
                    rowInner++;
                }
                sums += retInDet * this.get(0, colDet) * innerMatrix.det();
                retInDet *= -1;
            }
            return sums;
        }
    };
    Matrix.prototype.LU = function () {
        (0, assert_1.strict)(this.nrows === this.ncols, "Matrix must be square");
        var size = this.nrows;
        var L = Matrix.zeros(size, size);
        var U = Matrix.zeros(size, size);
        // Decomposing into Upper and Lower triangular
        var sum;
        for (var i = 0; i < size; i++) {
            for (var k = i; k < size; k++) {
                sum = 0;
                for (var j = 0; j < i; j++) {
                    sum += L.get(i, j) * U.get(j, k);
                }
                // Evaluate U(i,k)
                U.set(i, k, this.get(i, k) - sum);
            }
            for (var k = i; k < size; k++) {
                if (i === k) {
                    L.set(i, i, 1); // identity
                }
                else {
                    sum = 0;
                    for (var j = 0; j < i; j++) {
                        sum += L.get(k, j) * U.get(j, i);
                    }
                    // Evaluate L(k,i)
                    L.set(k, i, (this.get(k, i) - sum) / U.get(i, i));
                }
            }
        }
        return [L, U];
    };
    Matrix.prototype.deleteRow = function (rowIndex) {
        (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        this.arr.splice(rowIndex, 1);
        this.nrows--;
        return this;
    };
    Matrix.prototype.deleteColumn = function (columnIndex) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        var arr = [];
        for (var i = 0; i < this.nrows; i++) {
            var row = this.getRow(i);
            row.splice(columnIndex, 1);
            arr.push(row);
        }
        this.arr = arr;
        this.ncols--;
        return this;
    };
    Matrix.prototype.minor = function (i, j) {
        // Create a copy of the matrix
        var matrix = Matrix.fromMatrix(this);
        // Delete the given row and column
        matrix.deleteRow(i);
        matrix.deleteColumn(j);
        return matrix.det();
    };
    Matrix.prototype.cofactor = function (i, j) {
        //return Math.pow((-1), (row + column)) * this.minor(i, j);
        (0, assert_1.strict)(this.isSquare(), "Matrix is not square");
        return Math.pow(-1, i + j) * this.minor(i, j);
    };
    Matrix.prototype.cof = function () {
        // Generate an empty matrix
        var matrix = Matrix.zeros(this.nrows, this.ncols);
        for (var i = 0; i < this.nrows; i++) {
            var row = [];
            for (var j = 0; j < this.ncols; j++) {
                row.push(this.cofactor(i, j));
            }
            matrix.setRow(i, row);
        }
        return matrix;
    };
    Matrix.prototype.submat = function (starrow, endrow, startcol, endcol) {
        var rows = (endrow - starrow) + 1;
        var columns = (endcol - startcol) + 1;
        var matrix = Matrix.zeros(rows, columns);
        var rowi = 0;
        var coli = 0;
        for (var i = starrow; i <= endrow; i++) {
            for (var j = startcol; j <= endcol; j++) {
                matrix.set(rowi, coli, this.get(i, j));
                coli++;
            }
            rowi++;
            coli = 0;
        }
        return matrix;
    };
    Matrix.prototype.adj = function () {
        return this.cof().T();
    };
    Matrix.prototype.inv = function () {
        // inverse
        (0, assert_1.strict)(this.isSquare(), "Matrix must be square");
        (0, assert_1.strict)(!this.isSingular(), "Matrix is singular");
        return this.adj().multiply(1.0 / this.det());
    };
    Matrix.prototype.transpose = function () {
        var transposed = Matrix.zeros(this.ncols, this.nrows);
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                transposed.set(j, i, this.get(i, j));
            }
        }
        return transposed;
    };
    Matrix.prototype.T = function () {
        return this.transpose();
    };
    Matrix.prototype.abs = function () {
        // Return the same matrix but with all positive values
        var matrix = Matrix.fromMatrix(this);
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                matrix.set(i, j, Math.abs(this.get(i, j)));
            }
        }
        return matrix;
    };
    Matrix.prototype.addRow = function (row) {
        (0, assert_1.strict)(row.length === this.ncols, "New row must have the same number of columns");
        this.arr.push((row instanceof Matrix ? row.arr[0] : row));
        this.nrows++;
        return this;
    };
    Matrix.prototype.addColumn = function (column) {
        (0, assert_1.strict)(column.length === this.nrows, "New column must have the same number of rows");
        for (var i = 0; i < this.nrows; i++) {
            var value = (column instanceof Matrix ? column.get(i, 0) : column[i][0]);
            this.arr[i].push(value);
        }
        this.ncols++;
        return this;
    };
    Matrix.prototype.horzcat = function (M) {
        (0, assert_1.strict)(this.nrows === M.nrows, "Both matrices must have the same number of rows for horizontal concatenation");
        // Create a copy of the current matrix
        var matrix = Matrix.fromMatrix(this);
        // Now add the columns of the other matrix
        for (var i = 0; i < M.ncols; i++) {
            matrix.addColumn(M.getColumn(i));
        }
        return matrix;
    };
    Matrix.prototype.vertcat = function (M) {
        (0, assert_1.strict)(this.ncols === M.ncols, "Both matrices must have the same number of columns for vertical concatenation");
        // Create a copy of the current matrix
        var matrix = Matrix.fromMatrix(this);
        // Now add the rows of the other matrix
        for (var i = 0; i < M.nrows; i++) {
            matrix.addRow(M.getRow(i));
        }
        return matrix;
    };
    Matrix.prototype.equals = function (M) {
        return JSON.stringify(this) === JSON.stringify(M);
    };
    Matrix.prototype.map = function (callback) {
        var arr = __spreadArray([], this.arr, true);
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                arr[i][j] = callback(arr[i][j]);
            }
        }
        this.arr = arr;
        return this;
    };
    Matrix.prototype.apply = function (callback) {
        this.map(callback);
        return this;
    };
    Matrix.arange = function (start, end, step) {
        (0, assert_1.strict)(start > 0 && end > 0, "Invalid range");
        (0, assert_1.strict)(end > start, "Invalid range");
        (0, assert_1.strict)(step > 0, "Invalid step");
        // calculate number of elements
        var n = (end - start) / step;
        var matrix = Matrix.zeros(1, n);
        for (var i = 0; i < n; i++) {
            matrix.set(0, i, start + step * i);
        }
        return matrix;
    };
    Matrix.linspace = function (start, end, N) {
        (0, assert_1.strict)(start > 0 && end > 0, "Invalid range");
        (0, assert_1.strict)(end > start, "Invalid range");
        (0, assert_1.strict)(N > 0, "Invalid number of elements");
        // calculate step
        var step = (end - start) / (N - 1);
        // calculate number of elements
        var matrix = Matrix.zeros(1, N);
        for (var i = 0; i < N; i++) {
            matrix.set(0, i, start + step * i);
        }
        return matrix;
    };
    Matrix.prototype.reshape = function (shape) {
        (0, assert_1.strict)(Array.isArray(shape), "Invalid shape");
        (0, assert_1.strict)(shape.length > 1, "New shape must contain at least 2 dimensions");
        // Check if shape if valid
        var expectedNElements = shape.reduce(function (total, dim) { return total = total * dim; }, 1);
        var nElements = this.shape()[0] * this.shape()[1];
        (0, assert_1.strict)(nElements === expectedNElements, "New shape is impossible");
        // First, put all elements from this matrix into a vector/flattened matrix
        var flattened = this.flatten();
        // Now, create the new matrix and insert the values
        var matrix = Matrix.zeros(shape[0], shape[1]);
        var count = 0;
        for (var i = 0; i < matrix.nrows; i++) {
            for (var j = 0; j < matrix.ncols; j++) {
                matrix.set(i, j, flattened.get(0, count++));
            }
        }
        return matrix;
    };
    Matrix.prototype.flatten = function () {
        // Create new matrix of 1 row and N columns where N is equal to the number of elements in the matrix
        var matrix = Matrix.zeros(1, this.size());
        var n = 0;
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                matrix.set(0, n, this.get(i, j));
                n++;
            }
        }
        return matrix;
    };
    Matrix.prototype.ravel = function () {
        return this.flatten();
    };
    Matrix.prototype.diag = function () {
        // Return an array with the diagonal elements
        var diagonal = [];
        for (var i = 0; i < this.ncols; i++) {
            diagonal.push(this.get(i, i));
        }
        return diagonal;
    };
    Matrix.MIN_DET = 1e-9;
    return Matrix;
}());
