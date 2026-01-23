use std::collections::HashMap;

pub struct Cell {
    pub kind: CellKind,
    pub num_val: f64,
    pub text_val: String,
}

pub enum CellKind {
    Number,
    Text,
}

pub struct Table {
    cells: HashMap<(i32, i32), Cell>,
}

impl Table {
    pub fn new() -> Self {
        Self {
            cells: HashMap::new(),
        }
    }

    pub fn set_number(&mut self, row: i32, col: i32, val: f64) {
        self.cells.insert((row, col), Cell {
            kind: CellKind::Number,
            num_val: val,
            text_val: String::new(),
        });
    }

    pub fn set_text(&mut self, row: i32, col: i32, val: String) {
        self.cells.insert((row, col), Cell {
            kind: CellKind::Text,
            num_val: 0.0,
            text_val: val,
        });
    }

    pub fn get_number(&self, row: i32, col: i32) -> f64 {
        self.cells.get(&(row, col))
            .filter(|c| matches!(c.kind, CellKind::Number))
            .map(|c| c.num_val)
            .unwrap_or(0.0)
    }

    pub fn eval(&self, formula: &str) -> f64 {
        if formula.starts_with("=SUM") {
            return self.cells.values()
                .filter(|c| matches!(c.kind, CellKind::Number))
                .map(|c| c.num_val)
                .sum();
        }
        0.0
    }
}
