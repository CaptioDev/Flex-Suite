import { useState } from 'react';

interface TablePickerProps {
    onSelect: (rows: number, cols: number) => void;
}

export const TablePicker = ({ onSelect }: TablePickerProps) => {
    const MAX_ROWS = 50;
    const MAX_COLS = 50;
    const MIN_ROWS = 10;
    const MIN_COLS = 10;

    const [viewRows, setViewRows] = useState(MIN_ROWS);
    const [viewCols, setViewCols] = useState(MIN_COLS);

    const [hoverRows, setHoverRows] = useState(0);
    const [hoverCols, setHoverCols] = useState(0);

    // Expand view when hovering near the edge
    const handleMouseMove = (row: number, col: number) => {
        setHoverRows(row);
        setHoverCols(col);

        // Expansion threshold: if within 2 cells of edge, expand
        // But respect MAX limits
        if (row >= viewRows - 1 && viewRows < MAX_ROWS) {
            setViewRows(Math.min(viewRows + 5, MAX_ROWS));
        }
        if (col >= viewCols - 1 && viewCols < MAX_COLS) {
            setViewCols(Math.min(viewCols + 5, MAX_COLS));
        }
    };

    return (
        <div className="table-picker" style={{
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            userSelect: 'none'
        }}>
            <div style={{
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--md-sys-color-on-surface-variant)',
                fontWeight: 500
            }}>
                {hoverRows > 0 && hoverCols > 0 ? `${hoverCols} x ${hoverRows}` : 'Insert Table'}
            </div>

            <div
                style={{
                    display: 'grid',
                    // Dynamic grid template based on current view size
                    // Dynamic grid template based on current view size
                    gridTemplateColumns: `repeat(${viewCols}, 1fr)`,
                    gap: '1px 2px', // Less vertical gap (1px), slightly more horizontal (2px)
                    // No fixed width/height/overflow - let it grow
                    border: 'none',
                    backgroundColor: 'transparent'
                }}
                onMouseLeave={() => {
                    setHoverRows(0);
                    setHoverCols(0);
                    // Optional: reset view size on leave? 
                    // No, keeping it expanded is less jarring if they accidentally slip out.
                    // But maybe reset if they re-open.
                }}
            >
                {Array.from({ length: viewRows * viewCols }).map((_, index) => {
                    const row = Math.floor(index / viewCols) + 1;
                    const col = (index % viewCols) + 1;

                    const isSelected = row <= hoverRows && col <= hoverCols;

                    return (
                        <div
                            key={index}
                            style={{
                                width: '14px', // Slightly larger hit targets
                                height: '14px',
                                backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-highest)',
                                border: isSelected ? '1px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
                                borderRadius: '2px', // Soften edges
                                cursor: 'pointer',
                                boxSizing: 'border-box',
                                transition: 'background-color 0.1s ease, border-color 0.1s ease'
                            }}
                            onMouseEnter={() => handleMouseMove(row, col)}
                            onClick={() => onSelect(row, col)}
                        />
                    );
                })}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--md-sys-color-outline)', marginTop: '4px', textAlign: 'right' }}>
                {viewCols}x{viewRows}
            </div>
        </div>
    );
};
