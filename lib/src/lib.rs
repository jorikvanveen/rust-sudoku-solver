use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;

mod sudoku;
mod cell;
mod cell_collection;

wasm_bindgen_test::wasm_bindgen_test_configure!(run_in_browser);

pub mod solver {
    pub use crate::sudoku::Sudoku;
    pub use crate::cell::Cell;
    pub use crate::cell_collection::CellCollection;
    // use std::time::Instant;


    pub fn solve(sudoku_string: &str) -> String {
        let sud_ref = Sudoku::new(sudoku_string);

        let sudoku = sud_ref.borrow();
        sudoku.solve();

        sudoku.to_string()
    }
}

#[wasm_bindgen]
pub fn solve(sudoku_string: &str) -> String {
    solver::solve(sudoku_string)
}

#[cfg(test)]
mod tests {
    use crate::solver::*;
    use std::time::Instant;

    #[test]
    fn construct_sudoku() {
        let sud_ref = Sudoku::new("703100089000098400000600701850210000000065970074000100040000000900803006185000002");
        let mut sudoku = sud_ref.borrow_mut();
        // println!("{:?}", sudoku);

        // sudoku.display();
    }

    #[test]
    fn solve_sudoku() {
        // let sud_ref = Sudoku::new("041032706000057900050600020020416030008720510000000000700940000890060001405000280");
        let sud_ref = Sudoku::new("002603000500070140000501060037002009100000208000059710004080900605030400070096003");
        sud_ref.borrow().solve();
        // sud_ref.borrow().display();
    }

    #[test]
    fn backtrack() {
        let sud_ref = Sudoku::new("800000000003600000070090200050007000000045700000100030001000068008500010090000400");

        let start = Instant::now();

        sud_ref.borrow().solve();

        println!("Solved in {}μs", start.elapsed().as_micros());
        sud_ref.borrow().display();
    }
}

#[wasm_bindgen_test]
fn construct_sudoku() {
    use crate::sudoku::Sudoku;
    let sud_ref = Sudoku::new("703100089000098400000600701850210000000065970074000100040000000900803006185000002");
    let mut sudoku = sud_ref.borrow_mut();
    // println!("{:?}", sudoku);

    // sudoku.display();
}

#[wasm_bindgen_test]
fn solve_sudoku() {
    use crate::sudoku::Sudoku;

    // let sud_ref = Sudoku::new("041032706000057900050600020020416030008720510000000000700940000890060001405000280");
    let sud_ref = Sudoku::new("002603000500070140000501060037002009100000208000059710004080900605030400070096003");
    sud_ref.borrow().solve();
    // sud_ref.borrow().display();
}
