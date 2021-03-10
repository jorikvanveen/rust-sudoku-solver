// THIS CLASS IS STRICTLY FOR VISUALIZATION IN THE BROWSER
// IT SHOULD NOT CONTAIN ANY SOLVING LOGIC

// This is because some solving functions might make copies of Solver instances
// I don't want all of these to be JSX.Elements because that goes against best
// practices for both performance and clear, understandable code

import React from 'react'
import Cell from './Cell'

import Solver from '../classes/Solver'

import coordToIndex from '../utils/coordToIndex'
import indexToCoord from '../utils/indexToCoord'
import solveWasm from '../utils/wasmSolve'

interface Props {}
interface State {
    values: number[][];
    clueIndexes: number[];
    focusedIndex: number | null;
}

export default class SudokuInput extends React.Component<Props, State> {
    constructor (props:Props) {
        super(props)

        const values:number[][] = []

        for (let y = 0; y < 9; y++) {
            const row:number[] = []

            for (let x = 0; x < 9; x++) {
                row.push(0)
            }

            values.push(row)
        }

        this.state = {
            values: values,
            focusedIndex: null,
            clueIndexes: []
        }

        this.handleKeyboardInput = this.handleKeyboardInput.bind(this)
        this.focusCell = this.focusCell.bind(this)
        this.isIndexFocused = this.isIndexFocused.bind(this)
        this.solveLoneSingles = this.solveLoneSingles.bind(this)
        this.solveHiddenSingles = this.solveHiddenSingles.bind(this)
        this.solveWasm = this.solveWasm.bind(this)
    }

    handleKeyboardInput(event:KeyboardEvent) {
        const key = event.key
        const keyAsInt = parseInt(key)

        if (this.state.focusedIndex === null) {
            this.setState({
                focusedIndex: 0
            })
        }
        
        if (this.state.focusedIndex !== null) {
            let currentCoord = indexToCoord(this.state.focusedIndex)

            switch (key) {
                case "ArrowLeft":
                    currentCoord.x = currentCoord.x - 1 < 0 ? 8 : currentCoord.x - 1
                    break;
                case "ArrowRight":
                    currentCoord.x = currentCoord.x + 1 > 8 ? 0 : currentCoord.x + 1
                    break;
                case "ArrowUp":
                    currentCoord.y = currentCoord.y - 1 < 0 ? 8 : currentCoord.y - 1
                    break;
                case "ArrowDown":
                    currentCoord.y = currentCoord.y + 1 > 8 ? 0 : currentCoord.y + 1
                    break;
            }

            this.setState({
                focusedIndex: coordToIndex(currentCoord.x, currentCoord.y)
            })
        }


        if (!isNaN(keyAsInt) && keyAsInt > 0 && this.state.focusedIndex !== null) {
            const currentCoord = indexToCoord(this.state.focusedIndex)

            const newValues = [...this.state.values]
            newValues[currentCoord.y][currentCoord.x] = keyAsInt

            const newClueIndexes =[...this.state.clueIndexes]
            newClueIndexes.push(this.state.focusedIndex)

            console.log(newValues)

            this.setState({
                values: newValues,
                clueIndexes: newClueIndexes
            })
        }

        if ((key === "Backspace" || key === "0") && this.state.focusedIndex !== null) {
            const currentCoord = indexToCoord(this.state.focusedIndex)

            const newValues = [...this.state.values]
            newValues[currentCoord.y][currentCoord.x] = 0

            const newClueIndexes = [...this.state.clueIndexes]
            const clueIndex = newClueIndexes.findIndex(index => index === this.state.focusedIndex)
            newClueIndexes.splice(clueIndex, 1)

            this.setState({
                values: newValues
            })
        }
    }

    public focusCell(index: number) {
        this.setState({
            focusedIndex: index
        })
    }

    public isIndexFocused(index: number) {
        return this.state.focusedIndex === index
    }

    componentDidMount () {
        this.focusCell(0)
        document.addEventListener("keydown", this.handleKeyboardInput, false)
        // this.loadString("123456780000000000000000000000000000000000000000000000000000000000000000000000000")
        this.loadString("530000040008290370090005000040650002803100500760809000006347050200000807001000690")
    }

    componentWillUnmount () {
        document.removeEventListener("keydown", this.handleKeyboardInput, false)
    }

    toString() {
        let final = ""

        for (const row of this.state.values) {
            for (const value of row) {
                final += value.toString()
            }
        }

        return final
    }

    loadString(sudokuString: string) {
        const newValues:number[][] = []

        const newClues:number[] = []

        for (let y = 0; y < 9; y++) {
            newValues[y] = []
            for (let x = 0; x < 9; x++) {
                const currentValue = parseInt(sudokuString[y*9+x])
                newValues[y][x] = currentValue

                if (currentValue !== 0) {
                    newClues.push(y*9+x)
                }
            }
        }

        this.setState({
            values: newValues,
            clueIndexes: newClues
        })
    }

    solveLoneSingles() {
        const currentString = this.toString()
        const solver = new Solver(currentString)
        solver.solveLoneSingles()
        console.log(solver.toString())
        this.loadString(solver.toString())
    }

    solveHiddenSingles() {
        const currentString = this.toString()
        const solver = new Solver(currentString)
        solver.solveHiddenSingles()
        this.loadString(solver.toString())
    }

    async solveWasm() {
        const currentString = this.toString()
        const solution = await solveWasm(currentString)
        this.loadString(solution);
    }

    render() {
        let rows:JSX.Element[] = []

        for (let y = 0; y < this.state.values.length; y++) {
            const rowValues = this.state.values[y]
            const rowElements:JSX.Element[] = []

            for (let x = 0; x < rowValues.length; x++) {
                const cellValue = rowValues[x]
                const index = y * 9 + x
                
                rowElements.push(<Cell
                    index={index}
                    value={cellValue}
                    focusHandler={this.focusCell.bind(this)}
                    isFocused={this.state.focusedIndex === index}
                    isCertain={this.state.clueIndexes.includes(index)}
                    key={index}
                />)
            }

            const row = <div key={y} className="sudoku-row">
                { rowElements }
            </div>

            rows.push(row)
        }

        return <React.Fragment>
            <div className="sudoku-container">
            { rows }
            </div>
            <code>{this.toString()}</code>
            <br/>
            <button onClick={this.solveLoneSingles}>Lone singles</button>
            <button onClick={this.solveHiddenSingles}>Hidden singles</button>
            <button onClick={this.solveWasm}>Oplossen met WebAssembly (snel)</button>
            
        </React.Fragment>
    }
}
