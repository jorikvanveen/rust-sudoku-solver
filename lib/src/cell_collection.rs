use std::cell::RefCell;
use std::rc::{Rc};

type MRc<T> = Rc<RefCell<T>>;

use crate::cell::Cell;

#[derive(Debug, Clone)]
pub struct CellCollection {
    cells: Vec<MRc<Cell>>
}

impl CellCollection {
    pub fn get_cell(&self, index: usize) -> MRc<Cell> {
        Rc::clone(&self.cells[index])
    }

    pub fn get_all_cells(&self) -> &Vec<MRc<Cell>> {
        &self.cells
    }

    #[inline(always)]
    pub fn has_value(&self, value: u8) -> bool {
        for cell_ref in self.cells.iter() {
            if cell_ref.borrow().get_value() == value {
                return true
            }
        }

        false
    }

    pub fn eliminate_candidates(&mut self) -> bool {
        // Loop door elke cell heen in de collection, die niet 0 als value heeft. Dan elke iteratie weer door alle cells loopen om de candidate weg te halen die gelijk is aan de value van de geselecteerde cell van de buitenste loop.

        // Ik doe hier nogal wat drop en nieuwe variabelen aanmaken omdat rust's borrow checker maar 1 mutable reference toe laat of meerdere immutable references maar niet allebei. Dat maakt dingen iets moeilijker bij een geneste loop die 2x over dezelfde data loopt.

        // https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html

        let mut changed_any_value = false;
        
        // Basic elimination, gwn weghalen uit candidates wat al in de collectie staat
        for cell_ref in self.cells.iter() {
            let cell = cell_ref.borrow();
            let outer_value = cell.get_value();
            
            if outer_value == 0 { continue }

            drop(cell); // Maak deze cell weer beschikbaar om (mutable) gelezen te worden 5 lines hieronder 
            // https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html

            for cell_ref_inner in self.cells.iter() {
                let mut inner_cell = cell_ref_inner.borrow_mut();
                if inner_cell.is_clue() { continue } // Geen clues overschrijven
                if inner_cell.remove_candidate_if_exists(outer_value) {
                    changed_any_value = true;
                }
            }
        };

        // Hidden singles https://learn-sudoku.com/hidden-singles.html
        for candidate in 1..10 {
            let mut found_count = 0;
            let mut found_at: i8 = -1;

            for (i, cell_ref) in self.cells.iter().enumerate() {
                let cell = cell_ref.borrow();

                if cell.is_clue() {
                    continue;
                }

                for inner_candidate in cell.get_candidates().borrow().iter(){
                    if *inner_candidate == candidate {
                        found_count += 1;
                        found_at = i as i8;
                    }
                }
            };

            if found_count == 1 {
                let cell_ref = self.get_cell(found_at as usize);
                let mut cell = cell_ref.borrow_mut();

                cell.set_value(candidate, true);
            }
        }

        changed_any_value
    }

    pub fn push_cell(&mut self, cell: MRc<Cell>) {
        self.cells.push(cell);
    }

    pub fn new_empty() -> CellCollection {
        CellCollection { cells: Vec::with_capacity(9) }
    }
}