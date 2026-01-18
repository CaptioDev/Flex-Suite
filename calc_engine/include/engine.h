#pragma once

#include <vector>
#include <string>
#include <map>

// C-compatible API
extern "C" {
    typedef void* TableHandle;

    TableHandle engine_create_table();
    void engine_destroy_table(TableHandle handle);

    void engine_set_cell_number(TableHandle handle, int row, int col, double value);
    void engine_set_cell_text(TableHandle handle, int row, int col, const char* value);
    
    // Returns a double. strictly for testing math for now.
    double engine_get_cell_number(TableHandle handle, int row, int col);

    // Evaluates a simple formula like "=SUM(A1:A5)"
    // Returns result as double for simplicity in this iteration
    double engine_eval_formula(TableHandle handle, const char* formula);
}

class Table {
public:
    void set_number(int row, int col, double val);
    void set_text(int row, int col, const std::string& val);
    double get_number(int row, int col) const;
    std::string get_text(int row, int col) const;
    
    // Basic implementation that just returns 0 or the number at the cell
    double eval(const std::string& formula);

private:
    struct Cell {
        enum Type { NUMBER, TEXT, FORMULA };
        Type type = NUMBER;
        double num_val = 0.0;
        std::string text_val;
    };
    
    // Sparse storage using map for simplicity
    std::map<std::pair<int, int>, Cell> cells;
};
