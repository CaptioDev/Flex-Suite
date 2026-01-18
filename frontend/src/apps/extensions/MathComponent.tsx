import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const MathComponent = (props: any) => {
    const mathRef = useRef<HTMLSpanElement>(null);
    const latex = props.node.attrs.latex;

    // Render KaTeX
    useEffect(() => {
        if (mathRef.current) {
            try {
                katex.render(latex, mathRef.current, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (error) {
                console.error("KaTeX error:", error);
                mathRef.current.innerText = latex;
            }
        }
    }, [latex]);

    return (
        <NodeViewWrapper className="math-node-view" style={{ display: 'inline-block', width: 'fit-content' }}>
            <span
                ref={mathRef}
                style={{
                    cursor: 'pointer',
                    padding: '2px 4px',
                    border: props.selected ? '2px solid var(--md-sys-color-primary)' : '2px solid transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    position: 'relative',
                    display: 'inline-block',
                    minWidth: '24px', // ensure visibility even if empty
                    textAlign: 'center'
                }}
                title="Click to edit Equation"
            />
        </NodeViewWrapper>
    );
};
