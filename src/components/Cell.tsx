// THIS CLASS IS STRICTLY FOR VISUALIZATION IN THE BROWSER
// IT SHOULD NOT CONTAIN ANY SOLVING LOGIC

import React from 'react'

type validBackgroundColors = "green" | "blue" | "white" | "grey"

interface Props {
    index: number;
    value: string | number;
    focusHandler: (index:number) => void;
    isFocused: boolean;
    isCertain: boolean;
}
interface State {
    currentBackgroundColor: string;
}

export default class Cell extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props)

        this.state = {
            currentBackgroundColor: "white",
        }

        this.setBackgroundColor = this.setBackgroundColor.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    public getClassName() {
        const classArray:string[] = []

        const y = Math.floor(this.props.index / 9)
        const x = this.props.index - (y*9)

        if (x % 3 === 2) {
            classArray.push("border-right-bold")
        } else {
            classArray.push("border-right-thin")
        }

        if (y % 3 === 2) {
            classArray.push("border-bottom-bold")
        } else {
            classArray.push("border-bottom-thin")
        }

        if (x === 0) {
            classArray.push("border-left-bold")
        }

        if (y === 0) {
            classArray.push("border-top-bold")
        }

        let className = classArray.reduce((previousValue, currentValue) => {
            return previousValue + " " + currentValue
        }, "sudoku-cell")

        let backgroundColor = this.state.currentBackgroundColor

        if (this.props.isCertain) {
            backgroundColor = "green"
        }

        if (this.props.isFocused) {
            backgroundColor = "grey"
        }

        className += ` background-color-${backgroundColor}`

        return className
    }

    public setBackgroundColor(newColor: validBackgroundColors) {
        this.setState({
            currentBackgroundColor: newColor
        })
    }

    handleClick () {
        this.props.focusHandler(this.props.index)

    }

    render () {
        let cellValue = this.props.value.toString()

        if (cellValue === "0") {
            cellValue = ""
        }

        return (<div onClick={this.handleClick} className={this.getClassName()}>
            {cellValue}
        </div>)
    }
}