export default function indexToCoord(index: number) {
    const y = Math.floor(index/9)
    const x = index - y*9

    return {
        x: x,
        y: y
    }
}