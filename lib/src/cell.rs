use std::cell::RefCell;
use std::rc::{Rc, Weak};

type MRc<T> = Rc<RefCell<T>>;

use crate::sudoku::Sudoku;
use crate::cell_collection::CellCollection;

#[derive(Debug)]
pub struct Cell {
    value: u8,
    index: u8,
    x: u8,
    y: u8,
    subgrid_idx: u8,
    clue: bool,
    candidates: MRc<Vec<u8>>,
    parent: Weak<RefCell<Sudoku>>,
}

impl Cell {
    pub fn new(value: u8, index: u8, parent: MRc<Sudoku>) -> Cell {
        let y = (index as f32 / 9.0).floor() as u8;
        let x = index - (y * 9);
        let clue = value != 0;
        let candidates = Rc::new(RefCell::new(Vec::<u8>::with_capacity(0))); // Candidates kunnen pas worden berekend wanneer alle andere cells in de sudoku zijn
        // let parent = Rc::new(
        //     Rc::downgrade(
        //         &Rc::new(
        //             Rc::clone(&parent)
        //         )
        //     )
        // ); 
        
        let parent = Rc::downgrade(&parent);
        // Downgrade maakt een Weak<T>, Weak<T> zorgt ervoor dat we cirkelverwijzingen kunnen hebben zonder dat er een memory leak ontstaat. (cirkelverwijzing = parent -> child -> parent -> child enz.)

        let subgrid_y = (y as f32 / 3.0).floor() as u8;
        let subgrid_x = (x as f32 / 3.0).floor() as u8;
        let subgrid_idx = subgrid_y * 3 + subgrid_x;

        Cell {
            value,
            index,
            x,
            y,
            subgrid_idx,
            clue,
            candidates,
            parent
        }
    }

    pub fn get_value(&self) -> u8 {
        self.value
    }

    pub fn set_value(&mut self, new_value: u8, certain: bool) {
        self.value = new_value;
        self.clue = certain;
    }

    pub fn get_index(&self) -> u8 {
        self.index
    }

    pub fn get_x(&self) -> u8 {
        self.x
    }

    pub fn get_y(&self) -> u8 {
        self.y
    }

    pub fn get_subgrid_idx(&self) -> u8 {
        self.subgrid_idx
    }

    pub fn is_clue(&self) -> bool {
        self.clue
    }

    pub fn get_candidates(&self) -> MRc<Vec<u8>> {
        Rc::clone(&self.candidates)
    }

    pub fn get_row(&self) -> CellCollection {
        self.get_parent().borrow().get_row(self.y)
    }

    pub fn get_col(&self) -> CellCollection {
        self.get_parent().borrow().get_col(self.x)
    }

    pub fn get_subgrid(&self) -> CellCollection {
        self.get_parent().borrow().get_subgrid(self.subgrid_idx)
    }

    pub fn test_value(&self, value: u8) -> bool {
        let row = self.get_row();
        if row.has_value(value) { return false }

        let col = self.get_col();
        if col.has_value(value) { return false }

        let subgrid = self.get_subgrid();
        if subgrid.has_value(value) { return false }

        true
    }

    pub fn calculate_candidates(&self) {
        let mut candidates = Vec::<u8>::with_capacity(9);
        
        for candidate in 1..10 {
            if self.test_value(candidate) {
                candidates.push(candidate)
            }
        }

        // self.candidates = Rc::new(RefCell::new(candidates));
        self.candidates.replace(candidates);
    }

    pub fn remove_candidate_if_exists(&mut self, value_to_remove: u8) -> bool {
        let mut candidates = self.candidates.borrow_mut();

        // Vul automatisch de correcte waarde in als er nog maar 1 candidate over is
        if candidates.len() == 1 {
            self.value = candidates[0];
            self.clue = true;
        }

        for (i, candidate) in candidates.iter().enumerate() {
            if *candidate == value_to_remove {
                candidates.swap_remove(i); // Ipv dat 1 element verwijderd wordt en alle items naar links in de vec worden geshift, zorgt swap_remove() ervoor dat het laatste element in de plaats van het verwijderde element komt. Dat maakt deze bewerking O(1) ipv O(n)

                return true
            }
        };

        false
    }

    pub fn get_parent(&self) -> MRc<Sudoku> {
        // let &parent_ref = self.parent;
        self.parent.upgrade().expect("Failed to upgrade parent ref")
        // Failt wanneer sudoku eerder dan cell uit memory verdwijnt, wat als het goed is nooit gebeurt.
    }
}