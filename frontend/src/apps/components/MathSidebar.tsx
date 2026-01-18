import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MathSidebarProps {
    isOpen: boolean;
    latex: string;
    onClose: () => void;
    onChange: (latex: string) => void;
}

export const MathSidebar = ({ isOpen, latex, onClose, onChange }: MathSidebarProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="math-sidebar"
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        width: '320px',
                        borderLeft: '1px solid var(--md-sys-color-outline-variant)',
                        backgroundColor: 'var(--md-sys-color-surface)',
                        height: '100%',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '-2px 0 8px rgba(0,0,0,0.05)'
                    }}
                >
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            color: 'var(--md-sys-color-on-surface)'
                        }}>
                            Equation Editor
                        </h3>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 4,
                                borderRadius: '50%'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                color: 'var(--md-sys-color-on-surface-variant)'
                            }}>
                                LaTeX Formula
                            </label>
                            <textarea
                                ref={textareaRef}
                                value={latex}
                                onChange={(e) => onChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--md-sys-color-outline)',
                                    backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                    color: 'var(--md-sys-color-on-surface)',
                                    fontFamily: 'monospace',
                                    resize: 'vertical',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="E = mc^2"
                            />
                        </div>

                        <div style={{
                            padding: '12px',
                            backgroundColor: 'var(--md-sys-color-surface-variant)',
                            borderRadius: '8px',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            fontSize: '0.85rem'
                        }}>
                            <p style={{ margin: 0 }}>
                                <strong>Tip:</strong> Changes are applied automatically as you type.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
