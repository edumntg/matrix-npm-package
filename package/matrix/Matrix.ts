import {strict as assert} from 'assert';

export class Matrix {
    arr: Array<number | number[]>;
    nrows: number;
    ncols: number;

    constructor() {
        this.arr = [];
        this.nrows = 0;
        this.ncols = 0;
    }

    isSquare(): boolean {
        return this.nrows === this.ncols;
    }

    static rand(rows, columns): Matrix {
        // Create empty array
        let arr: Array<number> = [];
        // fill with rows of random values
        let row;
        for(let i = 0; i < rows; i++) {
            row = Array.from({length: columns}, () => Math.random());
            arr.push(row.slice());
        }
        // Now create matrix
        return Matrix.fromArray(arr);
    }

    static zeros(rows: number, columns: number): Matrix {
        let matrix: Matrix = new Matrix();
        matrix.nrows = rows;
        matrix.ncols = columns;

        let row: Array<number> = new Array(columns).fill(0);

        for(let i = 0; i < rows; i++) {
            matrix.arr.push(row.slice())
        }

        return matrix;
    }

    ones(rows: number, columns: number): Matrix {
        // create a matrix of zeros
        let matrix: Matrix = Matrix.zeros(rows, columns);
        // Fill with 1
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                matrix.set(i, j, 1);
            }
        }

        return matrix;
    }

    static fromArray(arr: Array<number | number[]>): Matrix {
        assert(Array.isArray(arr), "Argument must be of array type");

        // get size
        let rows: number = arr.length;
        let columns: number = Array.isArray(arr[0]) ? arr[0].length : 1;

        // Now, create a new matrix and set parameters
        let matrix: Matrix = new Matrix();
        matrix.arr = arr;
        matrix.nrows = rows;
        matrix.ncols = columns;

        return matrix;
    }

    static fromMatrix(m: Matrix): Matrix{
        // get size of matrix
        let rows: number = m.nrows;
        let columns: number = m.ncols;

        // Create an empty matrix
        let matrix: Matrix = Matrix.zeros(rows, columns);

        // Fill
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                matrix.set(i,j, m.get(i,j));
            }
        }

        return matrix;
    }

    multiply(param: Matrix | number): Matrix | null | number {
        if(param instanceof Matrix) {
            return this.matmul(param);
        } else if(typeof(param) === 'number') {
            return this.kmatmul(param);
        } else {
            console.log("Parameter given for multiplication is invalid");
            return null;
        }
    }

    matmul(m): Matrix {
        // get shape of each matrix to validate their dimensions
        let rows1: number = this.nrows;
        let cols1: number  = this.ncols;
        let rows2: number  = m.nrows;
        let cols2: number  = m.ncols;
    
        assert(cols1 === rows2, "Invalid matrices dimensions");
    
        // Create empty matrix to store result
        let matrix: Matrix = Matrix.zeros(rows1, cols2);
    
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

    static row_kmatmul(row: Matrix, k: number): Matrix {
        let arr: Array<number> = row.arr.map(x => (x as number) * k);
        return Matrix.fromArray([arr]);
    }

    kmatmul(k: number): Matrix {
        console.assert(typeof(k) === 'number', "Argument must be a constant");

        // create a copy
        let copy: Matrix = Matrix.fromMatrix(this);

        // Multiply
        let rows: number = copy.nrows;
        for(let i = 0; i < rows; i++) {
            copy.setRow(i, Matrix.row_kmatmul(copy.getRow(i), k));
        }

        return copy;
    }
    
    getRow(rowIndex: number): Matrix {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        return Matrix.fromArray([this.arr[rowIndex] as number[]]);
    }

    setRow(rowIndex: number, row: Matrix): void {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        assert(row instanceof Matrix, "Row parameter must be a Matrix");

        // set row
        for(let i = 0; i < this.ncols; i++) {
            this.set(rowIndex, i, row.get(0,i));
        }
    }

    getColumn(columnIndex: number): Matrix {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        let column: Matrix = Matrix.zeros(this.nrows, 1);
        // Insert values from column
        for(let i = 0; i < this.nrows; i++) {
            column.set(i, 0, this.get(i,columnIndex));
        }

        return Matrix.fromMatrix(column);
    }

    setColumn(columnIndex: number, column: Matrix): void {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        assert(column instanceof Matrix, "Column must be a Matrix object");

        // set column
        for(let i = 0; i < this.nrows; i++) {
            this.set(i, columnIndex, column.get(i, 0));
        }
    }

    set(row: number, column: number, value: number): void {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        this.arr[row][column] = value;
    }

    get(row: number, column: number): number {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        return this.arr[row][column];
    }

    static eye(size: number): Matrix {
        assert(typeof(size) === 'number' && size > 0, "Param argument must be a positive number");

        // Create an empty matrix filled with zeros
        let matrix: Matrix = Matrix.zeros(size, size);

        // Fill diagonal
        for(let i = 0; i < size; i++) {
            matrix.set(i,i,1);
        }

        return matrix;
    }

    size(): Array<number> {
        return [this.nrows, this.ncols];
    }

    det(): number {
        assert(this.nrows === this.ncols, "Matrix is not square");
        if(this.nrows === 1) {
            return this.get(0,0);
        } else if(this.nrows == 2) {
            return this.get(0,0) * this.get(1,1) - this.get(1,0) * this.get(0,1);
        } else {
            // Calculate determinant
            let sums: number = 0;
            let retInDet: number = 1;
            let size: number = this.nrows;
            for(let colDet = 0; colDet < size; colDet++) {
                // Create empty matrix of size - 1
                let innerMatrix: Matrix = Matrix.zeros(size-1, size-1);
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

    LU(): Array<Matrix> {
        assert(this.nrows === this.ncols, "Matrix must be square");
        let size: number = this.nrows;

        let L: Matrix = Matrix.zeros(size,size);
        let U: Matrix = Matrix.zeros(size,size);

        // Decomposing into Upper and Lower triangular
        let sum: number;
        for(let i = 0; i < size; i++) {
            for(let k = i; k < size; k++) {
                sum = 0;
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
                    sum = 0;
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

    deleteRow(rowIndex): void {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");

        this.arr.splice(rowIndex, 1);
        this.nrows--;
    }

    deleteColumn(columnIndex): void {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        let arr: Array<number[] | number> = [];
        for(let i = 0; i < this.nrows; i++) {
            let row: Array<number | number[]> = this.getRow(i).arr;
            row.splice(columnIndex, 1);
            arr.push(row as number[]);
        }
        
        this.arr = arr;
        this.ncols--;
    }

    minor(i: number, j: number): number {
        // Create a copy of the matrix
        let matrix = Matrix.fromMatrix(this);
        // Delete the given row and column
        matrix.deleteRow(i);
        matrix.deleteColumn(j);
        return matrix.det();
    }

    cofactor(i: number, j: number): number {
        //return Math.pow((-1), (row + column)) * this.minor(i, j);
        assert(this.isSquare(), "Matrix is not square");

        return Math.pow(-1, i+j) * this.minor(i, j);
    }

    cofactorMatrix(): Matrix {
        // Generate an empty matrix
        let matrix = Matrix.zeros(this.nrows, this.ncols);
        for(let i = 0; i < this.nrows; i++) {
            let row: Array<number> = [];
            for(let j = 0; j < this.ncols; j++) {
                row.push(this.cofactor(i,j));
            }
            console.log(Matrix.fromArray(row));
            matrix.setRow(i, Matrix.fromArray([row]));
        }

        return matrix;
    }

    submatrix(starrow: number, endrow: number, startcol: number, endcol: number): Matrix {
        let rows: number = (endrow - starrow) + 1;
        let columns: number = (endcol - startcol) + 1;

        let matrix: Matrix = Matrix.zeros(rows, columns);

        let rowi: number = 0;
        let coli: number = 0;

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

    adjoint(): Matrix { 
        return this.cofactorMatrix().T();
    }

    inv(): Matrix | number | null {
        // inverse
        assert(this.isSquare(), "Matrix must be square");
        assert(this.det() !== 0, "Matrix is singular");

        return this.adjoint().multiply(1.0 / this.det());
    }

    transpose(): Matrix {
        let transposed: Matrix = Matrix.zeros(this.ncols, this.nrows);
        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                transposed.set(j,i, this.get(i,j));
            }
        }

        return transposed;
    }

    T(): Matrix {
        return this.transpose();
    }

    abs(): Matrix {
        // Return the same matrix but with all positive values
        let matrix = Matrix.fromMatrix(this);

        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                matrix.set(i, j, Math.abs(this.get(i,j)));
            }
        }
        return matrix;
    }

    addRow(row: Matrix | number[]): void {
        assert((row instanceof Matrix ? row.arr[0] as number[] : row).length === this.ncols, "New row must have the same number of columns");
        this.arr.push((row instanceof Matrix ? row.arr[0] : row) as number[]);
        this.nrows++;
    }

    addColumn(column: Matrix | number[]): void {
        assert((column instanceof Matrix ? column.arr as number[] : column).length === this.nrows, "New column must have the same number of rows");
        for(let i = 0; i < this.nrows; i++) {
            let value: number = (column instanceof Matrix ? column.get(i, 0) : column[i][0]);
            (this.arr[i] as number[]).push(value);
        }
        this.ncols++;
    }

    horzcat(M: Matrix): Matrix {
        assert(this.nrows === M.nrows, "Both matrices must have the same number of rows for horizontal concatenation");
        
        // Create a copy of the current matrix
        let matrix = Matrix.fromMatrix(this);
        // Now add the columns of the other matrix
        for(let i = 0; i < M.ncols; i++) {
            matrix.addColumn(M.getColumn(i));
        }

        return matrix;
    }

    vertcat(M: Matrix): Matrix {
        assert(this.ncols === M.ncols, "Both matrices must have the same number of columns for vertical concatenation");
        
        // Create a copy of the current matrix
        let matrix = Matrix.fromMatrix(this);
        // Now add the rows of the other matrix
        for(let i = 0; i < M.nrows; i++) {
            matrix.addRow(M.getRow(i));
        }

        return matrix;
    }

}