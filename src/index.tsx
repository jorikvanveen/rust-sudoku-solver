// import "./bettersudoku.d.ts"

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './index.css';

import solve from './utils/wasmSolve'

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);




async function cacheWasm() {
    // const solution = await solve("008000006000200175100000320302654010600000000084030900010700200037590004050862000")
    // const solution = await solve("000000000000003085001020000000507000004000100090000000500000073002010000000040009")
    const solution = await solve("800000000003600000070090200050007000000045700000100030001000068008500010090000400")


    console.log(solution)
}

cacheWasm()

console.log("Hello typescript")
