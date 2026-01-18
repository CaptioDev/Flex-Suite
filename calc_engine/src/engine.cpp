#include "engine.h"
#include <cstring>
#include <iostream>
#include <sstream>

extern "C" {
TableHandle engine_create_table() { return new Table(); }

void engine_destroy_table(TableHandle handle) {
  delete static_cast<Table *>(handle);
}

void engine_set_cell_number(TableHandle handle, int row, int col,
                            double value) {
  static_cast<Table *>(handle)->set_number(row, col, value);
}

void engine_set_cell_text(TableHandle handle, int row, int col,
                          const char *value) {
  static_cast<Table *>(handle)->set_text(row, col, std::string(value));
}

double engine_get_cell_number(TableHandle handle, int row, int col) {
  return static_cast<Table *>(handle)->get_number(row, col);
}

double engine_eval_formula(TableHandle handle, const char *formula) {
  return static_cast<Table *>(handle)->eval(std::string(formula));
}
}

void Table::set_number(int row, int col, double val) {
  cells[{row, col}] = Cell{Cell::NUMBER, val, ""};
}

void Table::set_text(int row, int col, const std::string &val) {
  cells[{row, col}] = Cell{Cell::TEXT, 0.0, val};
}

double Table::get_number(int row, int col) const {
  auto it = cells.find({row, col});
  if (it != cells.end() && it->second.type == Cell::NUMBER) {
    return it->second.num_val;
  }
  return 0.0;
}

std::string Table::get_text(int row, int col) const {
  auto it = cells.find({row, col});
  if (it != cells.end() && it->second.type == Cell::TEXT) {
    return it->second.text_val;
  }
  return "";
}

double Table::eval(const std::string &formula) {
  // Very basic Mock evaluation
  // If it starts with =SUM, we just sum everything for now (demo)
  if (formula.find("=SUM") == 0) {
    double sum = 0;
    for (const auto &[key, cell] : cells) {
      if (cell.type == Cell::NUMBER) {
        sum += cell.num_val;
      }
    }
    return sum;
  }
  return 0.0;
}
