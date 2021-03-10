import Sudoku from './Solver'

export default class Cell {
    x: number;
    y: number;
    index: number;
    value: number;
    isClue: boolean;
    isCertain: boolean;
    parent: Sudoku;

    constructor(x: number, y: number, value: number, parent: Sudoku) {
        const isClue = (value !== 0)

        this.x = x
        this.y = y
        this.index = y*9+x
        this.value = value
        this.isClue = isClue
        this.isCertain = this.isClue
        this.parent = parent
    }

    public getRow() {
        return this.parent.getRow(this.y)
    }

    public getColumn() {
        return this.parent.getColumn(this.x)
    }

    public getSubgrid() {
        return this.parent.getSubgrid(Math.floor(this.x / 3), Math.floor(this.y / 3))
    }

    public testValue(value: number, useOnlyCertainValues: boolean) {
        // TODO: FUNCTIONS
        const row = this.getRow()

        for (const cell of row) {
            if (cell.value === value && (useOnlyCertainValues ? cell.isCertain : true)) {
                return false
            }
        }

        const col = this.getColumn()

        for (const cell of col) {
            if (cell.value === value && (useOnlyCertainValues ? cell.isCertain : true)) {
                return false
            }
        }

        const subgrid = this.getSubgrid()

        for (const cell of subgrid) {
            if (cell.value === value && (useOnlyCertainValues ? cell.isCertain : true)) {
                return false
            }
        }

        return true
    }

    public getCandidates(useOnlyCertainValues: boolean) {
        const candidates:number[] = []

        for (let i = 1; i <= 9; i++) {
            if (this.testValue(i, useOnlyCertainValues)) {
                candidates.push(i)
            }
        }

        return candidates
    }

    public hasCandidate(candidate: number) {
        return this.getCandidates(true).includes(candidate)
    }
}