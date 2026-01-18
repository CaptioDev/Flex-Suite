import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { EditorToolbar } from './EditorToolbar';
import './DocumentEditor.css';
import { motion } from 'framer-motion';
import { MathExtension } from './extensions/MathExtension';
import { PageBreak } from './extensions/PageBreak';
import { MathSidebar } from './components/MathSidebar';

import { FontSize } from './extensions/FontSize';
import { LineHeight } from './extensions/LineHeight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

export const DocumentEditor = () => {
    const [selectedMathNode, setSelectedMathNode] = useState<{ pos: number, latex: string } | null>(null);
    const [pageBackground, setPageBackground] = useState('#ffffff');
    const [, setForceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight.configure({ multicolor: true }),
            Typography,
            Image,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            LineHeight,
            MathExtension,
            PageBreak,
            Superscript,
            Subscript,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: `
            <h2>Welcome to your new Document</h2>
            <p>This is a <strong>rich text editor</strong> built with Material 3 Expressive.</p>
            <p>Try changing <span style="color: #6750A4">colors</span>, fonts, or <u>underlining</u> text.</p>
            <p>You can also insert LaTeX math: <span data-type="math">E=mc^2</span></p>
        `,
        onTransaction: ({ editor }) => {
            setForceUpdate(n => n + 1);

            // Check if selection is on a math node
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { selection } = editor.state as any;
            if (selection.node && selection.node.type.name === 'math') {
                setSelectedMathNode({
                    pos: selection.from,
                    latex: selection.node.attrs.latex // eslint-disable-next-line @typescript-eslint/no-explicit-any
                });
            } else {
                setSelectedMathNode(null);
            }
        },
    });

    const updateMathLatex = (newLatex: string) => {
        if (editor && selectedMathNode) {
            editor.chain().setNodeSelection(selectedMathNode.pos).updateAttributes('math', { latex: newLatex }).run();
            // Optimistically update local state to reflect typing immediately
            setSelectedMathNode(prev => prev ? { ...prev, latex: newLatex } : null);
        }
    };

    return (
        <div className="document-editor-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>

            {/* Toolbar Area - Fixed at Top */}
            <div className="toolbar-area" style={{ flex: '0 0 auto', zIndex: 10, borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                {editor && <EditorToolbar
                    editor={editor}
                    pageBackground={pageBackground}
                    setPageBackground={setPageBackground}
                />}
            </div>

            {/* Editor Viewport - Scrollable Area containing the "Page" */}
            <div className="editor-viewport" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', backgroundColor: 'var(--md-sys-color-surface-container-low)' }}>
                <motion.div
                    className="editor-surface"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        width: '100%',
                        maxWidth: '816px', /* Approx Letter width */
                        minHeight: '1056px', /* Approx Letter height */
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        backgroundColor: pageBackground
                    }}
                >
                    <div className="editor-scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <EditorContent editor={editor} className="tiptap-editor" />
                    </div>
                </motion.div>
            </div>

            <MathSidebar
                isOpen={!!selectedMathNode}
                latex={selectedMathNode?.latex || ''}
                onClose={() => {
                    if (editor) {
                        // Move selection after the math node to prevent immediate re-opening via onTransaction
                        const { pos } = selectedMathNode!;
                        editor.chain().focus().setTextSelection(pos + 1).run();
                    }
                    setSelectedMathNode(null);
                }}
                onChange={updateMathLatex}
            />
            <style>{`
                @media print {
                    /* Paint the base layers */
                    html, body {
                        background-color: ${pageBackground} !important;
                        min-height: 100vh !important;
                        height: auto !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Paint the containers */
                    .document-editor-container,
                    .editor-viewport,
                    .editor-surface,
                    .editor-scroll-area {
                        background-color: ${pageBackground} !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        height: auto !important;
                        overflow: visible !important;
                        display: block !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        width: 100% !important;
                        max-width: none !important;
                    }

                    .toolbar-area, .math-sidebar {
                        display: none !important;
                    }

                    /* Paint the content elements (Brute Force from before) */
                    .tiptap-editor, 
                    .ProseMirror, 
                    .ProseMirror > *,
                    .ProseMirror p,
                    .ProseMirror h1,
                    .ProseMirror h2,
                    .ProseMirror h3,
                    .ProseMirror h4,
                    .ProseMirror h5,
                    .ProseMirror h6,
                    .ProseMirror div,
                    .ProseMirror pre,
                    .ProseMirror blockquote,
                    .ProseMirror ul,
                    .ProseMirror ol,
                    .ProseMirror li {
                        background-color: ${pageBackground} !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};
