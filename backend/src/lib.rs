mod engine;

use wasm_bindgen::prelude::*;
use crate::engine::Table;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
pub struct EngineResult {
    pub sum_result: f64,
    pub message: String,
}

#[wasm_bindgen]
pub fn test_engine() -> JsValue {
    let mut table = Table::new();
    table.set_number(0, 0, 10.5); // A1
    table.set_number(1, 0, 20.0); // A2
    
    let result = table.eval("=SUM");
    
    let ret = EngineResult {
        sum_result: result,
        message: "Calculated via Rust WASM Engine".to_string(),
    };
    
    serde_wasm_bindgen::to_value(&ret).unwrap()
}

#[wasm_bindgen]
pub fn calculate_formula(formula: &str, _data: JsValue) -> JsValue {
    // Basic implementation: set data and eval formula
    let table = Table::new();
    // (In a real app, we'd loop through data and set values)
    
    let result = table.eval(formula);
    JsValue::from_f64(result)
}
