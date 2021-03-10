// Class which allows loading a sudokuString and solving it

import Cell from './Cell'

export default class SudokuSolver {
    rows: Cell[][]

    constructor(sudokuString: string) {
        // TODO: Allow passing an existing SudokuSolver instance to clone it, useful for recursive solving algorithms
        const rows:Cell[][] = []

        for (let y = 0; y < 9; y++) {
            const row: Cell[] = []

            for (let x = 0; x < 9; x++) {
                const value = parseInt(sudokuString[y*9+x])
                const cell = new Cell(x, y, value, this)

                row.push(cell)
            }

            rows.push(row)
        }

        this.rows = rows
    }

    getRow(y:number) {
        return this.rows[y]
    }

    getColumn(x: number) {
        const col:Cell[] = []

        for (let y = 0; y < 9; y++) {
            col.push(this.rows[y][x])
        }

        return col
    }

    getSubgrid(x: number, y: number) {
        const subgrid:Cell[] = []

        for (let yOffset = 0; yOffset < 3; yOffset++) {
            for (let xOffset = 0; xOffset < 3; xOffset++) {
                subgrid.push(this.rows[y * 3 + yOffset][x * 3 + xOffset])
            }
        }

        return subgrid
    }

    toString() {
        let final = ""

        for (const row of this.rows) {
            for (const cell of row) {
                final += cell.value.toString()
            }
        }

        return final
    }

    solveLoneSingles () {
        // Lone singles:
        // Cells where only one candidate is left, fairly simple.

        for (const row of this.rows) {
            for (const cell of row) {
                if (cell.isCertain) continue
                const candidates = cell.getCandidates(true)

                if (candidates.length === 1) {
                    console.log("Found lone single")
                    cell.value = candidates[0]
                    cell.isCertain = true
                }
            }
        }
    }

    solveHiddenSingles () {
        // Hidden singles
        // https://learn-sudoku.com/hidden-singles.html

        function solveHouse(house: Cell[]) {
            for (let i = 1; i <= 10; i++) {
                const candidate = i;
                let foundCount = 0;
                let foundAt = -1;
                
                for (const indexStr in house) {
                    const index = indexStr.codePointAt(0) - 48; // Sneller dan parseInt, ik leg dit beter uit in de Rust versie van dit algoritme
                    const cell = house[index]

                    if (cell.isClue) continue;

                    if (cell.hasCandidate(candidate)) {
                        foundCount++;
                        foundAt = index
                    }
                }

                if (foundCount === 1) {
                    house[foundAt].value = candidate;
                    house[foundAt].isClue = true;
                    house[foundAt].isCertain = true;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            const subgridY = Math.floor(i / 3)
            const subgridX = i - subgridY * 3

            const sub = this.getSubgrid(subgridX, subgridY)
            const row = this.getRow(i)
            const col = this.getColumn(i)

            solveHouse(sub)
            solveHouse(col)
            solveHouse(row)
        }
    }
}