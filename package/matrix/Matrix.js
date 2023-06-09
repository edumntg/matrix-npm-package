const assert = require('assert');

class Matrix {
    constructor() {
        this.arr = [];
        this.nrows = 0;
        this.ncols = 0;
    }

    static rand(rows, columns) {
        // Create empty array
        let arr = [];
        // fill with rows of random values
        let row;
        for(let i = 0; i < rows; i++) {
            row = Array.from({length: columns}, () => Math.random());
            arr.push(row.slice());
        }
        // Now create matrix
        return Matrix.fromArray(arr);
    }

    static zeros(rows, columns) {
        let matrix = new Matrix();
        matrix.nrows = rows;
        matrix.ncols = columns;
        let row = new Array(columns).fill(0);
        for(let i = 0; i < rows; i++) {
            matrix.arr.push(row.slice())
        }

        return matrix;
    }

    static fromArray(arr) {
        assert(Array.isArray(arr), "Argument must be of array type");

        // get size
        let rows = arr.length;
        let columns = arr[0].length;
        // Now, create a new matrix and set parameters
        let matrix = new Matrix();
        matrix.arr = arr;
        matrix.nrows = rows;
        matrix.ncols = columns;
        return matrix;
    }

    static fromMatrix(m) {
        // get size of matrix
        let rows = m.nrows;
        let columns = m.ncols;

        // Create an empty matrix
        let matrix = Matrix.zeros(rows, columns);

        // Fill
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                matrix.set(i,j, m.get(i,j));
            }
        }

        return matrix;
    }

    multiply(param) {
        if(param instanceof Matrix) {
            return this.matmul(param);
        } else if(typeof(param) === 'number') {
            return this.kmatmul(param);
        } else {
            console.log("Parameter given for multiplication is invalid");
            return;
        }
    }

    matmul(m) {
        // get shape of each matrix to validate their dimensions
        let rows1 = this.nrows;
        let cols1 = this.ncols;
        let rows2 = m.nrows;
        let cols2 = m.ncols;
    
        assert(cols1 === rows2, "Invalid matrices dimensions");
    
        // Create empty matrix to store result
        let matrix = Matrix.zeros(rows1, cols2);
    
        // Now, multiply
        for(let i = 0; i < rows1; i++) {
            for(let j = 0; j < cols2; j++) {
                for(let k = 0; k < rows2; k++) {
                    matrix.set(i, j, matrix.get(i, j) + this.get(i, k) * m.get(k, j));
                }
            }
        }
    
        return matrix;
    }

    static row_kmatmul(row, k) {
        let arr = row.arr.map(x => x * k);
        return Matrix.fromArray([arr]);
    }

    kmatmul(k) {
        console.assert(typeof(k) === 'number', "Argument must be a constant");

        // create a copy
        let copy = Matrix.fromMatrix(this);

        // Multiply
        let rows = copy.nrows;
        for(let i = 0; i < rows; i++) {
            copy.setrow(i, Matrix.row_kmatmul(copy.getrow(i), k));
        }

        return copy;
    }
    
    getrow(rowIndex) {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        return Matrix.fromArray(this.arr[rowIndex]);
    }

    setrow(rowIndex, row) {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        assert(row instanceof Matrix, "Row parameter must be a Matrix");

        // set row
        for(let i = 0; i < this.ncols; i++) {
            this.set(rowIndex, i, row.get(0,i));
        }
    }

    getcolumn(columnIndex) {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        let column = [];
        // Insert values from column
        for(let i = 0; i < this.nrows; i++) {
            column.push(this.get(i, columnIndex));
        }

        return Matrix.fromArray(column);
    }

    setcolumn(columnIndex, column) {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        assert(column instanceof Matrix, "Column must be a Matrix object");

        // set column
        for(let i = 0; i < this.nrows; i++) {
            this.set(i, columnIndex, column.get(i, 0));
        }
    }

    set(row, column, value) {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        this.arr[row][column] = value;
    }

    get(row, column) {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        return this.arr[row][column];
    }

    static eye(size) {
        assert(typeof(size) === 'number' && size > 0, "Param argument must be a positive number");

        // Create an empty matrix filled with zeros
        let matrix = Matrix.zeros(size, size);

        // Fill diagonal
        for(let i = 0; i < size; i++) {
            matrix.set(i,i,1);
        }

        return matrix;
    }

    size() {
        return [this.nrows, this.ncols];
    }

    det() {
        assert(this.nrows === this.ncols, "Matrix is not square");
        if(this.nrows === 1) {
            return this.get(0,0);
        } else if(this.nrows == 2) {
            return this.get(0,0) * this.get(1,1) - this.get(1,0) * this.get(0,1);
        } else {
            // Calculate determinant
            let sums = 0;
            let retInDet = 1;
            let size = this.nrows;
            for(let colDet = 0; colDet < size; colDet++) {
                // Create empty matrix of size - 1
                let innerMatrix = Matrix.zeros(size-1, size-1);
                for(let row = 1, rowInner = 0; row < size; row++) {
                    for(let column = 0, columnInner = 0; column < size; column++) {
                        if(column === colDet) {
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
    }

    pivot() {
        let size = this.nrows;

        // Create new identity matrix
        let matrix = Matrix.eye(size);

        // Calculate pivot matrix
        for(let j = 0 ; j < size; j++) {
            let row = this.getrow(j);

        }

    }

    LU() {
        assert(this.nrows === this.ncols, "Matrix must be square");
        let size = this.nrows;

        let L = Matrix.zeros(size,size);
        let U = Matrix.zeros(size,size);

        // Decomposing into Upper and Lower triangular
        for(let i = 0; i < size; i++) {
            for(let k = i; k < size; k++) {
                let sum = 0;
                for(let j = 0; j < i; j++) {
                    sum += L.get(i,j) * U.get(j,k);
                }

                // Evaluate U(i,k)
                U.set(i,k, this.get(i,k) - sum);
            }

            for(let k = i; k < size; k++) {
                if(i === k) {
                    L.set(i,i, 1); // identity
                } else {
                    let sum = 0;
                    for(let j = 0; j < i; j++) {
                        sum += L.get(k,j) * U.get(j,i);
                    }

                    // Evaluate L(k,i)
                    L.set(k,i, (this.get(k,i) - sum) / U.get(i,i));
                }
            }
        }

        return [L, U];
    }

    cofactor(p,q, temp) {
        let size = this.nrows;
        let i = 0, j = 0;

        for(let row = 0; row < size; row++) {
            for(let col = 0; col < size; col++) {
                if(row !== p && col !== q) {
                    temp.set(i, j++, this.get(row, col));
                    if(j === size - 1) {
                        j = 0;
                        i++;
                    }
                }
            }
        }
    }

    submatrix(starrow, endrow, startcol, endcol) {
        let rows = (endrow - starrow) + 1;
        let columns = (endcol - startcol) + 1;
        let matrix = Matrix.zeros(rows, columns);
        let rowi = 0;
        let coli = 0;
        for(let i = starrow; i <= endrow; i++) {
            for(let j = startcol; j <= endcol; j++) {
                matrix.set(rowi, coli, this.get(i,j));
                coli++;
            }
            rowi++;
            coli=0;
        }

        return matrix;
    }

    adjoint(){ 
        let size = this.nrows;
        // empty matrix
        let adj = Matrix.zeros(size,size);
        if(size === 1) {
            adj.set(0,0,1);
            return adj;
        }
        
        let sign = 1;
        let temp = Matrix.zeros(size,size);
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                // get cofactor (i,j)
                this.cofactor(i,j, temp);
                // update sign
                sign = ((i + j) % 2 === 0) ? 1 : -1;
                adj.set(j,i, sign*temp.submatrix(0,temp.nrows-1,0,temp.ncols-1).det());
            }
        }

        return adj;
    }

    inv() {
        // inverse
        assert(this.nrows === this.ncols, "Matrix must be square");
        assert(this.det() !== 0, "Matrix is singular");

        if(this.nrows === 1) { // sie 1x1
            return 1.0 / this.get(0,0);
        } else if(this.nrows === 2) { // 2x2
            let cofMatrix = Matrix.fromArray([
                [this.get(1,1), -this.get(0,1)],
                [-this.get(1,0), this.get(0,0)]
            ]);
            return cofMatrix.multiply(1 / this.det());
        } else { // any other size
            return this.adjoint().multiply(1.0 / this.det());
        }
    }
}

module.exports = Matrix;