use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_double, c_int, c_void};

#[repr(C)]
#[derive(Debug, Copy, Clone)]
pub struct TableHandle(*mut c_void);

extern "C" {
    fn engine_create_table() -> TableHandle;
    fn engine_destroy_table(handle: TableHandle);
    fn engine_set_cell_number(handle: TableHandle, row: c_int, col: c_int, value: c_double);
    fn engine_set_cell_text(handle: TableHandle, row: c_int, col: c_int, value: *const c_char);
    fn engine_get_cell_number(handle: TableHandle, row: c_int, col: c_int) -> c_double;
    fn engine_eval_formula(handle: TableHandle, formula: *const c_char) -> c_double;
}

pub struct SafeTable {
    handle: TableHandle,
}

impl SafeTable {
    pub fn new() -> Self {
        unsafe {
            Self {
                handle: engine_create_table(),
            }
        }
    }

    pub fn set_number(&self, row: i32, col: i32, val: f64) {
        unsafe {
            engine_set_cell_number(self.handle, row, col, val);
        }
    }

    pub fn set_text(&self, row: i32, col: i32, val: &str) {
        let c_str = CString::new(val).unwrap();
        unsafe {
            engine_set_cell_text(self.handle, row, col, c_str.as_ptr());
        }
    }
    
    pub fn get_number(&self, row: i32, col: i32) -> f64 {
        unsafe {
            engine_get_cell_number(self.handle, row, col)
        }
    }

    pub fn eval(&self, formula: &str) -> f64 {
        let c_str = CString::new(formula).unwrap();
        unsafe {
            engine_eval_formula(self.handle, c_str.as_ptr())
        }
    }
}

impl Drop for SafeTable {
    fn drop(&mut self) {
        unsafe {
            engine_destroy_table(self.handle);
        }
    }
}
