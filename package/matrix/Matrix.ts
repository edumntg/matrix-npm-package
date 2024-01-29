import {strict as assert} from 'assert';

export class Matrix {
    arr: Array<number | number[]>;
    nrows: number;
    ncols: number;
    static MIN_DET: number = 1e-9; // Min. value of a matrix's determinant to be considered singular

    constructor(m: null | Matrix | Array<number> | Array<Array<number>>) {
        if(m instanceof Matrix) {
            this.construct_fromM(m);
        } else if(Array.isArray(m)) {
            this.construct_fromArr(m);
        } else {
            this.construct_empty();
        }
    }

    private construct_empty(): Matrix {
        this.arr = [];
        this.nrows = 0;
        this.ncols = 0;

        return this;
    }

    private construct_fromM(m: Matrix): Matrix {

        this.arr = [...m.arr];
        this.nrows = m.nrows;
        this.ncols = m.ncols;
        return this;
    }

    private construct_fromArr(arr: Array<number | number[]>): Matrix {
        assert(Array.isArray(arr), "Argument must be of array type");

        // get size
        let rows: number = arr.length;
        let columns: number = Array.isArray(arr[0]) ? arr[0].length : 1;

        this.arr = [...arr];
        this.nrows = rows;
        this.ncols = columns;

        return this;
    }

    isSquare(): boolean {
        return this.nrows === this.ncols;
    }

    isSingular(): boolean {
        return this.det() <= Matrix.MIN_DET;
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

    matmul(m: Matrix): Matrix {
        // get shape of each matrix to validate their dimensions
        let rows1: number = this.nrows;
        let cols1: number  = this.ncols;
        let rows2: number  = m.nrows;
        let cols2: number  = m.ncols;
    
        assert(cols1 === rows2, `Invalid matrices dimensions. Got [${this.shape}]x[${m.shape}]`);
    
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

    add(M: Matrix): Matrix {
        // Check that both matrices have the same size
        assert(this.shape[0] === M.shape[0] && this.shape[1] === M.shape[1], "Matrices must have the same shape");

        // Create a copy of this matrix
        let result: Matrix = Matrix.fromMatrix(M);
        
        // Now add
        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                result.set(i,j, this.get(i,j) + M.get(i,j));
            }
        }

        return result;
    }

    sub(M: Matrix): Matrix {
        // Check that both matrices have the same size
        assert(this.shape[0] === M.shape[0] && this.shape[1] === M.shape[1], "Matrices must have the same shape");

        // Create a copy of this matrix
        let result: Matrix = Matrix.fromMatrix(M);

        // Now add
        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                result.set(i,j, this.get(i,j) - M.get(i,j));
            }
        }

        return result;
    }

    subtract(M: Matrix) {
        return this.sub(M);
    }

    diff(M: Matrix): Matrix {
        return this.sub(M);
    }

    getRow(rowIndex: number): number | number[] {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        return this.arr[rowIndex];
    }

    setRow(rowIndex: number, row: number[]): Matrix {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");
        assert(Array.isArray(row), "Row parameter must be an array of numbers");
        assert(this.ncols === row.length, "New row must have the same number of columns")

        // set row
        for(let i = 0; i < this.ncols; i++) {
            this.set(rowIndex, i, row[i]);
        }

        return this;
    }

    getColumn(columnIndex: number): number | number[] {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        let column: number[] = [];
        // Insert values from column
        for(let i = 0; i < this.nrows; i++) {
            column.push(this.get(i,columnIndex));
        }

        return column;
    }

    setColumn(columnIndex: number, column: number[]): Matrix {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        assert(Array.isArray(column), "Column must be aan array");
        assert(column.length === this.nrows, "New column must have the same number of rows");

        // set column
        for(let i = 0; i < this.nrows; i++) {
            this.set(i, columnIndex, column[i]);
        }

        return this;
    }

    set(row: number, column: number, value: number): Matrix {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        this.arr[row][column] = value;

        return this;
    }

    get(row: number, column: number): number {
        assert(typeof(row) === 'number' && row >= 0 && row < this.nrows, "Invalid row index");
        assert(typeof(column) === 'number' && column >= 0 && column < this.ncols, "Invalid column index");

        return this.arr[row][column];
    }

    size(): number {
        return this.shape[0]*this.shape[1];
    }

    get shape(): number[] {
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

    deleteRow(rowIndex: number): Matrix {
        assert(rowIndex >= 0 && rowIndex < this.nrows, "Invalid row index");

        this.arr.splice(rowIndex, 1);
        this.nrows--;

        return this;
    }

    deleteColumn(columnIndex: number): Matrix {
        assert(columnIndex >= 0 && columnIndex < this.ncols, "Invalid column index");
        let arr: Array<number[] | number> = [];
        for(let i = 0; i < this.nrows; i++) {
            let row: Array<number | number[]> = this.getRow(i) as number[];
            row.splice(columnIndex, 1);
            arr.push(row as number[]);
        }
        
        this.arr = arr;
        this.ncols--;
        
        return this;
    }

    minor(i: number, j: number): number {
        // Create a copy of the matrix
        let matrix: Matrix = Matrix.fromMatrix(this);
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

    cof(): Matrix {
        // Generate an empty matrix
        let matrix: Matrix = Matrix.zeros(this.nrows, this.ncols);
        for(let i = 0; i < this.nrows; i++) {
            let row: Array<number> = [];
            for(let j = 0; j < this.ncols; j++) {
                row.push(this.cofactor(i,j));
            }
            matrix.setRow(i, row);
        }

        return matrix;
    }

    submat(starrow: number, endrow: number, startcol: number, endcol: number): Matrix {
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

    adj(): Matrix { 
        return this.cof().T;
    }

    inv(): Matrix | number | null {
        // inverse
        assert(this.isSquare(), "Matrix must be square");
        assert(!this.isSingular(), "Matrix is singular");

        return this.adj().multiply(1.0 / this.det());
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

    get T(): Matrix {
        return this.transpose();
    }

    abs(): Matrix {
        // Return the same matrix but with all positive values
        let matrix: Matrix = Matrix.fromMatrix(this);

        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                matrix.set(i, j, Math.abs(this.get(i,j)));
            }
        }
        return matrix;
    }

    addRow(row: number | number[]): Matrix {
        assert((row as number[]).length === this.ncols, "New row must have the same number of columns");
        this.arr.push((row instanceof Matrix ? row.arr[0] : row) as number[]);
        this.nrows++;

        return this;
    }

    addColumn(column: number | number[]): Matrix {
        assert((column as number[]).length === this.nrows, "New column must have the same number of rows");
        for(let i = 0; i < this.nrows; i++) {
            let value: number = column[i];
            (this.arr[i] as number[]).push(value);
        }
        this.ncols++;

        return this;
    }

    horzcat(M: Matrix): Matrix {
        assert(this.nrows === M.nrows, "Both matrices must have the same number of rows for horizontal concatenation");
        
        // Create a copy of the current matrix
        let matrix: Matrix = Matrix.fromMatrix(this);
        // Now add the columns of the other matrix
        for(let i = 0; i < M.ncols; i++) {
            matrix.addColumn(M.getColumn(i));
        }

        return matrix;
    }

    vertcat(M: Matrix): Matrix {
        assert(this.ncols === M.ncols, "Both matrices must have the same number of columns for vertical concatenation");
        
        // Create a copy of the current matrix
        let matrix: Matrix = Matrix.fromMatrix(this);
        // Now add the rows of the other matrix
        for(let i = 0; i < M.nrows; i++) {
            matrix.addRow(M.getRow(i));
        }

        return matrix;
    }

    equals(M: Matrix): boolean {
        return JSON.stringify(this) === JSON.stringify(M);
    }

    map(callback: (x: number) => number): Matrix {
        let arr = [...this.arr];
        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                arr[i][j] = callback(arr[i][j]);
            }
        }
        this.arr = arr;
        return this;
    }

    apply(callback: (x: number) => number): Matrix {
        this.map(callback);
        return this;
    }

    reshape(shape: number[]): Matrix {
        assert(Array.isArray(shape), "Invalid shape");
        assert(shape.length > 1, "New shape must contain at least 2 dimensions");

        // Check if shape is valid
        let expectedNElements: number = shape.reduce((total, dim) => total = total * dim, 1);
        let nElements: number = this.shape[0] * this.shape[1];

        assert(nElements === expectedNElements, "New shape is impossible");

        // First, put all elements from this matrix into a vector/flattened matrix
        let flattened: Matrix = this.flatten();

        // Now, create the new matrix and insert the values
        let matrix: Matrix = Matrix.zeros(shape[0], shape[1]);
        let count: number = 0;

        for(let i  = 0; i < matrix.nrows; i++) {
            for(let j = 0; j < matrix.ncols; j++) {
                matrix.set(i, j, flattened.get(0, count++));
            }
        }
        return matrix;
    }

    flatten(): Matrix {
        // Create new matrix of 1 row and N columns where N is equal to the number of elements in the matrix
        let matrix: Matrix = Matrix.zeros(1, this.size());
        let n = 0;
        for(let i = 0; i < this.nrows; i++) {
            for(let j = 0; j < this.ncols; j++) {
                matrix.set(0, n, this.get(i,j));
                n++;
            }
        }

        return matrix;
    }

    ravel(): Matrix {
        return this.flatten();
    }

    diag(): number[] {
        // Return an array with the diagonal elements
        let diagonal: number[] = [];
        for(let i = 0; i < this.ncols; i++) {
            diagonal.push(this.get(i,i));
        }

        return diagonal;

    }

    max(): number {
        if(this.nrows === 1) {
            return Math.max(...(this.arr[0] as number[]));
        }
        let max_val: number = this.get(0,0);
        for(let i = 0; i < this.nrows; i++) {
            let this_max: number = Math.max(...(this.getRow(i) as number[]));
            if(this_max > max_val) {
                max_val = this_max;
            }
        }
        
        return max_val;
    }

    norm(): number {
        // Returns the Frobenius norm of the matrix
        let norm: number = 0.0;
        for(let i = 0; i < this.shape[0]; i++) {
            for(let j = 0; j < this.shape[1]; j++) {
                norm += Math.pow(Math.abs(this.get(i,j)), 2.0)
            }
        }

        return Math.sqrt(norm);
    }

    static rand(rows: number, columns: number): Matrix {
        // Create empty array
        let arr: Array<number[]> = [];
        // fill with rows of random values
        let row: number[];
        for(let i = 0; i < rows; i++) {
            row = Array.from({length: columns}, () => Math.random());
            arr.push(row);
        }
        // Now create matrix
        return Matrix.fromArray(arr);
    }

    static zeros(rows: number, columns: number): Matrix {
        let matrix: Matrix = new Matrix(null);
        matrix.nrows = rows;
        matrix.ncols = columns;

        let row: Array<number> = new Array(columns).fill(0);

        for(let i = 0; i < rows; i++) {
            matrix.arr.push(row.slice())
        }

        return matrix;
    }

    static ones(rows: number, columns: number): Matrix {
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
        let matrix: Matrix = new Matrix(null);
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

    static norm(M: Matrix): number {
        // Returns the Frobenius norm of the matrix
        let norm: number = 0.0;
        for(let i = 0; i < M.shape[0]; i++) {
            for(let j = 0; j < M.shape[1]; j++) {
                norm += Math.pow(Math.abs(M.get(i,j)), 2.0)
            }
        }

        return Math.sqrt(norm);
    }

    static arange(start: number, end: number, step: number): Matrix {
        assert(start > 0 && end > 0, "Invalid range");
        assert(end > start, "Invalid range");
        assert(step > 0, "Invalid step");

        // calculate number of elements
        let n: number = (end - start) / step;
        let matrix: Matrix = Matrix.zeros(1, n);
        for(let i = 0; i < n; i++) {
            matrix.set(0, i, start + step*i);
        }

        return matrix;
    }

    static linspace(start: number, end: number, N: number): Matrix {
        assert(end > start, "Invalid range");
        assert(N > 0, "Invalid number of elements");

        // calculate step
        let step: number = (end - start) / (N - 1);

        // calculate number of elements
        let matrix: Matrix = Matrix.zeros(1, N);
        for(let i = 0; i < N; i++) {
            matrix.set(0, i, start + step*i);
        }

        return matrix;
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

    static row_kmatmul(row: number | number[], k: number): number[] {
        return (row as number[]).map(x => (x as number) * k);
    }

    *iterrows(as_matrix = false) {
        for(let i = 0; i < this.nrows; i++) {
            let row: number | number[] | Matrix = this.getRow(i);
            if(as_matrix) {
                row = new Matrix((row as number[]));
            }
            yield row;
        }
    }

    *itercolumns(as_matrix = false) {
        for(let i = 0; i < this.ncols; i++) {
            let column: number | number[] | Matrix = this.getColumn(i);
            if(as_matrix) {
                column = new Matrix((column as number[]));
            }
            yield column;
        }
    }
}