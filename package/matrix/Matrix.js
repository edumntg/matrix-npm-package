"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
var assert_1 = require("assert");
var Matrix = /** @class */ (function () {
    function Matrix() {
        this.arr = [];
        this.nrows = 0;
        this.ncols = 0;
    }
    Matrix.prototype.isSquare = function () {
        return this.nrows === this.ncols;
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
        var matrix = new Matrix();
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
        var matrix = new Matrix();
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
        var arr = row.arr.map(function (x) { return x * k; });
        return Matrix.fromArray([arr]);
    };
    Matrix.prototype.kmatmul = function (k) {
        console.assert(typeof (k) === 'number', "Argument must be a constant");
        // create a copy
        var copy = Matrix.fromMatrix(this);
        // Multiply
        var rows = copy.nrows;
        for (var i = 0; i < rows; i++) {
            copy.setrow(i, Matrix.row_kmatmul(copy.getRow(i), k));
        }
        return copy;
    };
    Matrix.prototype.getRow = function (rowIndex) {
        (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        return Matrix.fromArray(this.arr[rowIndex]);
    };
    Matrix.prototype.setrow = function (rowIndex, row) {
        (0, assert_1.strict)(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        (0, assert_1.strict)(row instanceof Matrix, "Row parameter must be a Matrix");
        // set row
        for (var i = 0; i < this.ncols; i++) {
            this.set(rowIndex, i, row.get(0, i));
        }
    };
    Matrix.prototype.getColumn = function (columnIndex) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        var column = Matrix.zeros(this.nrows, 1);
        // Insert values from column
        for (var i = 0; i < this.nrows; i++) {
            column.set(i, 0, this.get(i, columnIndex));
        }
        return Matrix.fromMatrix(column);
    };
    Matrix.prototype.setcolumn = function (columnIndex, column) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        (0, assert_1.strict)(column instanceof Matrix, "Column must be a Matrix object");
        // set column
        for (var i = 0; i < this.nrows; i++) {
            this.set(i, columnIndex, column.get(i, 0));
        }
    };
    Matrix.prototype.set = function (row, column, value) {
        (0, assert_1.strict)(typeof (row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        (0, assert_1.strict)(typeof (column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");
        this.arr[row][column] = value;
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
    };
    Matrix.prototype.deleteColumn = function (columnIndex) {
        (0, assert_1.strict)(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        var arr = [];
        for (var i = 0; i < this.nrows; i++) {
            var row = this.getRow(i).arr;
            row.splice(columnIndex, 1);
            arr.push(row);
        }
        this.arr = arr;
        this.ncols--;
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
    Matrix.prototype.cofactorMatrix = function () {
        // Generate an empty matrix
        var matrix = Matrix.zeros(this.nrows, this.ncols);
        for (var i = 0; i < this.nrows; i++) {
            var row = [];
            for (var j = 0; j < this.ncols; j++) {
                row.push(this.cofactor(i, j));
            }
            console.log(Matrix.fromArray(row));
            matrix.setrow(i, Matrix.fromArray([row]));
        }
        return matrix;
    };
    Matrix.prototype.submatrix = function (starrow, endrow, startcol, endcol) {
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
    Matrix.prototype.adjoint = function () {
        return this.cofactorMatrix().T();
    };
    Matrix.prototype.inv = function () {
        // inverse
        (0, assert_1.strict)(this.isSquare(), "Matrix must be square");
        (0, assert_1.strict)(this.det() !== 0, "Matrix is singular");
        return this.adjoint().multiply(1.0 / this.det());
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
        (0, assert_1.strict)((row instanceof Matrix ? row.arr[0] : row).length === this.ncols, "New row must have the same number of columns");
        this.arr.push((row instanceof Matrix ? row.arr[0] : row));
        this.nrows++;
    };
    Matrix.prototype.addColumn = function (column) {
        (0, assert_1.strict)((column instanceof Matrix ? column.arr : column).length === this.nrows, "New column must have the same number of rows");
        for (var i = 0; i < this.nrows; i++) {
            var value = (column instanceof Matrix ? column.get(i, 0) : column[i][0]);
            this.arr[i].push(value);
        }
        this.ncols++;
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
    return Matrix;
}());
exports.Matrix = Matrix;
