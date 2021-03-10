use std::cell::RefCell;
use std::rc::{Rc};

type MRc<T> = Rc<RefCell<T>>;

use crate::cell_collection::CellCollection;
use crate::cell::Cell;

#[derive(Debug)]
pub struct Sudoku {
    rows: Vec<MRc<CellCollection>>,
    cols: Vec<MRc<CellCollection>>,
    subgrids: Vec<MRc<CellCollection>>
}

impl Sudoku {
    pub fn new(sudoku_string: &str) -> MRc<Sudoku> {
        let mut all_chars = sudoku_string.chars();

        let mut rows = Vec::<MRc<CellCollection>>::with_capacity(9);
        let mut cols = Vec::<MRc<CellCollection>>::with_capacity(9);
        let mut subgrids = Vec::<MRc<CellCollection>>::with_capacity(9);

        // Vul rows cols en subgrids met lege CellCollections zodat er naar gepusht kan worden
        for _ in 0..9 {
            rows.push(Rc::new(RefCell::new(CellCollection::new_empty())));
            cols.push(Rc::new(RefCell::new(CellCollection::new_empty())));
            subgrids.push(Rc::new(RefCell::new(CellCollection::new_empty())));
        }

        // Lege sudoku, om parent/child te linken. Deze wordt later gevuld met cells.
        let sudoku = Rc::new(RefCell::new(Sudoku {
            rows: Vec::with_capacity(9),
            cols: Vec::with_capacity(9),
            subgrids: Vec::with_capacity(9)
        }));

        // let sudoku_rc = Rc::new(sudoku);

        // let mut cells = Vec::<Cell>::with_capacity(9);

        // Cells maken
        for i in 0..81 {

            // Convert character naar int
            // Wanneer je een char naar een int cast (unsigned 8 bit int in dit geval)
            // Krijg je de character as een UTF-8 byte. Omdat de nummers heel mooi in de
            // UTF-8 en ASCII tabel staan kun je gewoon 48 ervan aftrekken om de waarde
            // van de byte te krijgen als een integer ipv char
            // Deze code zal panicken wanneer je een emoji of ander unicode teken invoert
            // dat komt omdat deze characters uit meerdere bytes bestaan en dus niet castbaar naar een u8 zijn.
            // Dit is in dit geval de bedoeling, omdat een character in een sudokustring die buiten het
            // bereik van 0 tot 9 is sowieso ongeldig is.

            let character = all_chars.next().expect("Invalid sudoku string");
            let byte = character as u8; // Conversie naar byte
            let value = byte - 48;

            let cell_ref = Rc::new(RefCell::new(Cell::new(value, i, Rc::clone(&sudoku))));
            let cell = cell_ref.borrow();

            // Positie van col, row en subgrid die bij de cell horen
            let row_idx = cell.get_y() as usize; // indexes
            let col_idx = cell.get_x() as usize;
            let subgrid_idx = cell.get_subgrid_idx() as usize;
            
            let mut selected_row = rows[row_idx].borrow_mut();                
            selected_row.push_cell(Rc::clone(&cell_ref)); // push de cell naar rows[row_idx]
            drop(selected_row);

            let mut selected_col = cols[col_idx].borrow_mut();
            selected_col.push_cell(Rc::clone(&cell_ref));
            drop(selected_col);

            let mut selected_subgrid = subgrids[subgrid_idx].borrow_mut();
            selected_subgrid.push_cell(Rc::clone(&cell_ref));
            drop(selected_subgrid);

            // cells.push(cell);
        };

        let mut sudoku_mut = sudoku.borrow_mut();
        sudoku_mut.rows = rows;
        sudoku_mut.cols = cols;
        sudoku_mut.subgrids = subgrids;

        drop(sudoku_mut);

        let sudoku_immut = sudoku.borrow();

        // Bereken de candidates nu dat alle cells bestaan
        for row_ref in sudoku_immut.rows.iter() {
            let row = row_ref.borrow();
            for cell_ref in row.get_all_cells() {
                let cell = cell_ref.borrow();
                cell.calculate_candidates();
            }
        }


        Rc::clone(&sudoku)
    }

    pub fn display(&self) {
        println!();
        for row_ref in self.rows.iter() {
            let row = row_ref.borrow();
            for cell in row.get_all_cells() {
                print!("{} ", cell.borrow().get_value())
            }
            println!();
        }
    }    
    
    pub fn to_string(&self) -> String {
        let mut final_str = String::new();

        for row_ref in self.rows.iter() {
            let row = row_ref.borrow();

            for cell_ref in row.get_all_cells().iter() {
                let cell = cell_ref.borrow();
                final_str.push_str(&cell.get_value().to_string());
            }
        }

        final_str
    }

    pub fn get_row(&self, y: u8) -> CellCollection {
        self.rows[y as usize].borrow().clone()
    }

    pub fn get_col(&self, x: u8) -> CellCollection {
        self.cols[x as usize].borrow().clone()
    }

    pub fn get_subgrid(&self, subgrid_idx: u8) -> CellCollection {
        self.subgrids[subgrid_idx as usize].borrow().clone()
    }
    
    pub fn get_all_rows(&self) -> Vec<CellCollection> {
        let mut rows = Vec::<CellCollection>::with_capacity(9);

        for i in 0..9 {
            rows.push(self.get_row(i));
        }

        rows
    }

    pub fn get_all_cols(&self) -> Vec<CellCollection> {
        let mut cols = Vec::<CellCollection>::with_capacity(9);

        for i in 0..9 {
            cols.push(self.get_col(i));
        }

        cols
    }
    
    pub fn get_all_subgrids(&self) -> Vec<CellCollection> {
        let mut subgrids = Vec::<CellCollection>::with_capacity(9);

        for i in 0..9 {
            subgrids.push(self.get_subgrid(i));
        }

        subgrids
    }

    pub fn get_cell(&self, x: u8, y: u8) -> MRc<Cell> {
        self.rows[y as usize].borrow().get_cell(x as usize)
    }

    pub fn get_cell_idx(&self, idx: u8) -> MRc<Cell> {
        let y = (idx as f32 / 9.0).floor() as u8;
        let x = idx - (y * 9);

        self.get_cell(x, y)
    }

    pub fn eliminate_candidates(&self) -> bool {
        let mut modified_anything = false;

        // Haal alle houses op
        let mut rows = self.get_all_rows();
        let mut cols = self.get_all_cols();
        let mut subgrids = self.get_all_subgrids();

        // Loop er doorheen en call .eliminate_candidates() op ze allemaal.
        for i in 0..9 {
            let row = &mut rows[i];
            let col = &mut cols[i];
            let subgrid = &mut subgrids[i];

            if row.eliminate_candidates()
                || col.eliminate_candidates()
                || subgrid.eliminate_candidates()
            {
                modified_anything = true
            }
        }



        modified_anything
    }

    pub fn is_solved(&self) -> bool {
        for row_ref in self.rows.iter() {
            let row = row_ref.borrow();

            if row.has_value(0) {
                return false;
            }
        }

        true
    }

    pub fn backtrack(&self) {

        let mut current_index: u8 = 0;
        let mut current_cell_ref = self.get_cell_idx(current_index);

        loop {
            let current_cell = current_cell_ref.borrow();

            if current_cell.is_clue() {
                // Voor als de eerste value een clue is.
                current_index += 1;
                drop(current_cell);
                current_cell_ref = self.get_cell_idx(current_index);
                continue
            };

            // Haal candidates op en free weer memory
            let current_candidates = current_cell.get_candidates();
            drop(current_cell);
           
            let mut found_possibility = false;

            for possibility in current_candidates.borrow().iter() {
                // Check alle candidates
                let current_cell = current_cell_ref.borrow();

                if current_cell.get_value() > *possibility {
                    continue
                }

                if current_cell.test_value(*possibility) {
                    found_possibility = true;
                    drop(current_cell); // Ik drop hier omdat ik anders geen mutable borrow kan doen om de value aan te passen. De reden dat ik niet vanaf het begin al een mutable borrow gebruikte is omdat test_value zichzelf ook moet borrowen en er kan maar 1 mutable borrow of meerdere immutable borrows zijn, niet allebei.

                    let mut current_cell_mut = current_cell_ref.borrow_mut();
                    current_cell_mut.set_value(*possibility, false);
                    break
                }
            }

            if !found_possibility {
                let mut current_cell = current_cell_ref.borrow_mut();
                current_cell.set_value(0, false);
                drop(current_cell);

                loop {
                    current_index -= 1;
                    current_cell_ref = self.get_cell_idx(current_index);
                    let current_cell = current_cell_ref.borrow();

                    if !current_cell.is_clue() {
                        break
                    }
                }
            } else {
                loop {
                    current_index += 1;

                    if current_index > 80 {
                        return;
                    }

                    current_cell_ref = self.get_cell_idx(current_index);
                    let current_cell = current_cell_ref.borrow();

                    if !current_cell.is_clue() {
                        break
                    }
                }
            }
        }
    }

    pub fn solve(&self) {
        while self.eliminate_candidates() {}

        if !self.is_solved() {
            self.backtrack();
        }
    }
}
