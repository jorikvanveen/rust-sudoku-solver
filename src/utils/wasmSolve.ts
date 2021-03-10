export default async function solve(sudoku_string: string): Promise<string> {
    const windowAny = window as any;
    const wasm_bindings = windowAny.wasm_bindings;

    await wasm_bindings("./public/wasm/bettersudoku_bg.wasm")

    const start = performance.now();

    const solution = wasm_bindings.solve(sudoku_string);

    const end = performance.now(); 

    console.log("Solved in", end - start);

    if (typeof solution === "string") {
        return solution;
    } else {
        throw new Error("Something went wrong when calling wasm func")
    }
}