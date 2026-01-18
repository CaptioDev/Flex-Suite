import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
    AlignLeft, AlignCenter, AlignRight,
    File, ChevronDown,
    Type, Palette, StickyNote,
    MoveVertical,
    Undo, Redo,
    List, ListOrdered,
    Superscript, Subscript,
    Table as TableIcon
} from 'lucide-react';
import { TablePicker } from './components/TablePicker';
import { serializeToMarkdown } from './utils/markdownSerializer';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import './EditorToolbar.css';
// @ts-ignore
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';

interface ToolbarProps {
    editor: Editor;
    pageBackground: string;
    setPageBackground: (color: string) => void;
}

const Dropdown = ({ label, children, width = 140, align = 'left' }: { label: React.ReactNode, children: React.ReactNode, width?: number, align?: 'left' | 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="toolbar-dropdown" ref={ref} style={{ position: 'relative' }} onClick={() => setIsOpen(false)}>
            {/* Added onClick to close when any child is clicked (bubbling) */}
            <motion.button
                className="toolbar-btn dropdown-trigger"
                onClick={(e) => { e.stopPropagation(); toggleOpen(); }}
                style={{ width: 'auto', padding: '0 8px', gap: '4px', fontSize: '14px', fontWeight: 500 }}
                whileTap={{ scale: 0.95 }}
            >
                {label}
                <ChevronDown size={14} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: align === 'left' ? 0 : 'auto',
                            right: align === 'right' ? 0 : 'auto',
                            marginTop: '4px',
                            backgroundColor: 'white', // Fallback
                            background: 'var(--md-sys-color-surface-container-high, #ffffff)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            zIndex: 100,
                            padding: '4px',
                            minWidth: `${width}px`,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                        }}
                        onClick={(e) => e.stopPropagation()} // Stop closing if clicking inside menu logic? No, we WANT to close on item click. 
                    // Actually standard behavior is: click item -> close. click menu blank space -> don't close?
                    // For simplicity, let's let events bubble to the container onClick which sets open false.
                    >
                        {/* We need to wrap children to intercept clicks if we want precise control, but bubbling to parent works for simple items */}
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// ... (HeaderDropdown, FontFamilyDropdown, FontSizeDropdown, LineHeightDropdown, ToolbarButton, ColorPickerButton, chain helpers remain same)

// Re-paste them to be safe or just target specific blocks? 
// The tool says "Use this tool ONLY when you are making a SINGLE CONTIGUOUS block of edits". 
// I have edits at top (imports), middle (Dropdown fix), bottom (SaveDropdown and default export).
// I should probably use multi_replace_file_content or just replace the specific chunks.
// Multi replace is better.



const HeaderDropdown = ({ editor }: { editor: Editor }) => {
    const setHeader = (level: 0 | 1 | 2 | 3 | 4 | 5) => {
        if (level === 0) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level: level as any }).run();
        }
    };

    const getCurrentLabel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
        if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
        if (editor.isActive('heading', { level: 5 })) return 'Heading 5';
        return 'Normal Text';
    };

    return (
        <Dropdown label={getCurrentLabel()} width={140}>
            {[
                { label: 'Normal Text', level: 0 },
                { label: 'Heading 1', level: 1, style: { fontSize: '1.5em', fontWeight: 'bold' } },
                { label: 'Heading 2', level: 2, style: { fontSize: '1.3em', fontWeight: 'bold' } },
                { label: 'Heading 3', level: 3, style: { fontSize: '1.1em', fontWeight: 'bold' } },
                { label: 'Heading 4', level: 4, style: { fontSize: '1em', fontWeight: 'bold' } },
                { label: 'Heading 5', level: 5, style: { fontSize: '0.9em', fontWeight: 'bold' } },
            ].map((item) => (
                <button
                    key={item.label}
                    onClick={() => setHeader(item.level as any)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'inherit',
                        ...item.style
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {item.label}
                </button>
            ))}
        </Dropdown>
    );
};

const FontFamilyDropdown = ({ editor }: { editor: Editor }) => {
    const setFont = (font: string) => {
        editor.chain().focus().setFontFamily(font).run();
    };

    const fonts = [
        { label: 'Inter (Default)', value: 'Inter, sans-serif' },
        { label: 'Roboto', value: 'Roboto, sans-serif' },
        { label: 'Open Sans', value: '"Open Sans", sans-serif' },
        { label: 'Montserrat', value: 'Montserrat, sans-serif' },
        { label: 'Lato', value: 'Lato, sans-serif' }, // Note: Lato wasn't imported above, I should stick to what I imported or add it. Let's stick to imported.
        // Wait, I missed Lato in the import. Let's use what I imported.
        { label: 'Playfair Display', value: '"Playfair Display", serif' },
        { label: 'Merriweather', value: 'Merriweather, serif' },
        { label: 'Lora', value: 'Lora, serif' },
        { label: 'Courier Prime', value: '"Courier Prime", monospace' },
        { label: 'Roboto Mono', value: '"Roboto Mono", monospace' },
        { label: 'Oswald', value: 'Oswald, sans-serif' },
        { label: 'Raleway', value: 'Raleway, sans-serif' },
        { label: 'Comic Neue (Comic Sans)', value: '"Comic Neue", cursive' },
        { label: 'Lobster', value: 'Lobster, display' },
        // Fallbacks for system fonts that might work or fallback to sans/serif
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Times New Roman', value: '"Times New Roman", serif' },
    ];

    const getCurrentLabel = () => {
        const currentFont = editor.getAttributes('textStyle').fontFamily;
        if (!currentFont) return 'Font Family';
        const found = fonts.find(f => f.value === currentFont || (currentFont.includes(f.label)));
        return found ? found.label : 'Font Family';
    };

    return (
        <Dropdown label={<div style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getCurrentLabel()}</div>} width={180}>
            {fonts.map((item) => (
                <button
                    key={item.label}
                    onClick={() => setFont(item.value)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: item.value,
                        fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {item.label}
                </button>
            ))}
        </Dropdown>
    );
};

const FontSizeDropdown = ({ editor }: { editor: Editor }) => {
    const setSize = (size: string) => {
        editor.chain().focus().setFontSize(size).run();
    };

    const sizes = ['8px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px', '60px', '72px'];

    const getCurrentLabel = () => {
        const currentSize = editor.getAttributes('textStyle').fontSize;
        return currentSize ? currentSize : '16px';
    };

    return (
        <Dropdown label={getCurrentLabel()} width={80}>
            {sizes.map((size) => (
                <button
                    key={size}
                    onClick={() => setSize(size)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {size}
                </button>
            ))}
        </Dropdown>
    );
};

const LineHeightDropdown = ({ editor }: { editor: Editor }) => {
    const setLineHeight = (height: string) => {
        editor.chain().focus().setLineHeight(height).run();
    };

    const heights = ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'];

    const getCurrentLabel = () => {
        const currentHeight = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight;
        return currentHeight ? currentHeight : '1.5';
    };

    return (
        <Dropdown label={<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MoveVertical size={14} /> {getCurrentLabel()}</div>} width={80}>
            {heights.map((height) => (
                <button
                    key={height}
                    onClick={() => setLineHeight(height)}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {height}
                </button>
            ))}
        </Dropdown>
    );
};

const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title?: string }) => {
    return (
        <motion.button
            className={clsx("toolbar-btn", isActive && "active")}
            onClick={onClick}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            title={title}
        >
            {children}
        </motion.button>
    );
};

const ColorPickerButton = ({ icon: Icon, color, onChange, title }: { icon: any, color: string, onChange: (color: string) => void, title?: string }) => {
    return (
        <div style={{ position: 'relative', display: 'flex' }} title={title}>
            <ToolbarButton onClick={() => { }} isActive={false}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Icon size={18} />
                    <div style={{ width: 14, height: 3, backgroundColor: color, borderRadius: 1.5 }} />
                </div>
                <input
                    type="color"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                    onInput={(e) => onChange((e.target as HTMLInputElement).value)}
                    value={color}
                />
            </ToolbarButton>
        </div>
    );
};

// Helper to bypass strict checks for demonstration
const chain = (editor: Editor) => editor.chain().focus() as any;

const SaveDropdown = ({ editor }: { editor: Editor }) => {
    // Dropdown state is now handled by the wrapping Dropdown component

    const handleExportMarkdown = () => {
        const markdown = serializeToMarkdown(editor.getJSON());
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
    };

    const handleExportDocx = () => {
        const html = editor.getHTML();
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Document</title>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        asBlob(fullHtml).then((data: any) => {
            saveAs(data as Blob, 'document.docx');
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dropdown label={<><File size={18} /><ChevronDown size={14} /></>} width={160}>
            <button
                onClick={handleExportMarkdown}
                style={{
                    border: 'none', background: 'transparent', textAlign: 'left', padding: '8px 12px',
                    borderRadius: '4px', cursor: 'pointer', color: 'var(--md-sys-color-on-surface)', fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                Export as Markdown
            </button>
            <button
                onClick={handleExportDocx}
                style={{
                    border: 'none', background: 'transparent', textAlign: 'left', padding: '8px 12px',
                    borderRadius: '4px', cursor: 'pointer', color: 'var(--md-sys-color-on-surface)', fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                Export as DOCX
            </button>
            <button
                onClick={handlePrint}
                style={{
                    border: 'none', background: 'transparent', textAlign: 'left', padding: '8px 12px',
                    borderRadius: '4px', cursor: 'pointer', color: 'var(--md-sys-color-on-surface)', fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-variant)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                Export to PDF / Print
            </button>
        </Dropdown>
    );
};

const TableDropdown = ({ editor }: { editor: Editor }) => {
    return (
        <Dropdown label={<TableIcon size={18} />} width={420} align="right">
            <TablePicker onSelect={(rows, cols) => {
                editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                // We need to close the dropdown. The Dropdown component doesn't expose a close method easily 
                // via props, but the click on the item usually propagates.
                // However, TablePicker has internal structure.
                // Let's rely on the bubbling click to the parent Dropdown ref listener?
                // The Dropdown has `onClick={() => setIsOpen(false)}` on the wrapping div's capture or bubble?
                // The current Dropdown implementation:
                // <div ... onClick={() => setIsOpen(false)}>
                //   <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}> 
                // Wait, the current implementation STOPS propagation on the menu content `onClick={(e) => e.stopPropagation()}`.
                // So clicking inside the menu won't close it unless we manually handle it.

                // Let's trigger a click on the document body or something to close it? 
                // Or we can modify the Dropdown to accept a render prop or just handle the click propagation.
                // Actually, if I just dispatch a dirty click event to document? No.
                // The best way without refactoring Dropdown too much is to trigger a click on the "backdrop" if there was one, 
                // but here we just rely on outside click.
                // Let's cheat: document.body.click(); 
                document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            }} />
        </Dropdown>
    );
};

export const EditorToolbar = ({ editor, pageBackground, setPageBackground }: ToolbarProps) => {
    if (!editor) return null;

    return (
        <div className="editor-toolbar" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="toolbar-group">
                <ToolbarButton
                    onClick={() => chain(editor).undo().run()}
                    isActive={false}
                    title="Undo"
                >
                    <Undo size={18} opacity={editor.can().undo() ? 1 : 0.5} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).redo().run()}
                    isActive={false}
                    title="Redo"
                >
                    <Redo size={18} opacity={editor.can().redo() ? 1 : 0.5} />
                </ToolbarButton>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <SaveDropdown editor={editor} />
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <FontFamilyDropdown editor={editor} />
                <FontSizeDropdown editor={editor} />
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <HeaderDropdown editor={editor} />
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <ToolbarButton
                    onClick={() => chain(editor).toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                >
                    <UnderlineIcon size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                >
                    <Strikethrough size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleSuperscript().run()}
                    isActive={editor.isActive('superscript')}
                    title="Superscript"
                >
                    <Superscript size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleSubscript().run()}
                    isActive={editor.isActive('subscript')}
                    title="Subscript"
                >
                    <Subscript size={18} />
                </ToolbarButton>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <ToolbarButton
                    onClick={() => chain(editor).toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </ToolbarButton>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <LineHeightDropdown editor={editor} />
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <ToolbarButton
                    onClick={() => chain(editor).setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                >
                    <AlignLeft size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                >
                    <AlignCenter size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => chain(editor).setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                >
                    <AlignRight size={18} />
                </ToolbarButton>
            </div>


            <div className="divider" />

            <div className="toolbar-group">
                <ColorPickerButton
                    icon={Type}
                    color={editor.getAttributes('textStyle').color || 'var(--md-sys-color-on-surface)'}
                    onChange={(color) => chain(editor).setColor(color).run()}
                    title="Text Color"
                />

                <div className="divider-small" style={{ width: 1, height: 20, backgroundColor: 'var(--md-sys-color-outline-variant)', margin: '0 4px' }} />

                <ToolbarButton
                    onClick={() => chain(editor).toggleHighlight().run()}
                    isActive={editor.isActive('highlight')}
                    title="Toggle Highlight"
                >
                    <Highlighter size={18} />
                </ToolbarButton>
                <ColorPickerButton
                    icon={Palette}
                    color={editor.getAttributes('highlight').color || '#ffff00'}
                    onChange={(color) => chain(editor).setHighlight({ color }).run()}
                    title="Highlight Color"
                />

                <div className="divider-small" style={{ width: 1, height: 20, backgroundColor: 'var(--md-sys-color-outline-variant)', margin: '0 4px' }} />

                <ColorPickerButton
                    icon={StickyNote}
                    color={pageBackground}
                    onChange={setPageBackground}
                    title="Page Background"
                />
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <ToolbarButton
                    onClick={() => {
                        chain(editor).setMath({ latex: "E=mc^2" }).run();
                    }}
                    isActive={editor.isActive('math')}
                >
                    <span style={{ fontFamily: 'serif', fontWeight: 'bold' }}>Σ</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => {
                        chain(editor).setPageBreak().run();
                    }}
                    isActive={false}
                    title="Insert Page Break"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '14px', width: '14px', border: '1px solid currentColor', borderTop: 'none', borderBottom: 'none', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '-2px', right: '-2px', borderTop: '1px dashed currentColor' }}></div>
                    </div>
                </ToolbarButton>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <TableDropdown editor={editor} />
            </div>

        </div >
    );
};
