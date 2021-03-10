import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './App.css';
import SudokuInput from './components/Sudoku'
import Nav from './components/Nav'
import Uitleg from './components/Uitleg'

function App() {
    

    return (
        <div className="App">
            {/* <p>Sudoku</p>
            <SudokuInput /> */}
            <Router>
                <Nav/>

                <Route exact path="/">
                    <SudokuInput />
                </Route>

                <Route exact path="/uitleg">
                    <Uitleg />
                </Route>
            </Router>
        </div>
    );
}

export default App;
