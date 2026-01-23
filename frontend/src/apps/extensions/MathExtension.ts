import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MathComponent } from './MathComponent';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        math: {
            /**
             * Add a math formula
             */
            setMath: (options: { latex: string }) => ReturnType,
        }
    }
}

export const MathExtension = Node.create({
    name: 'math',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            latex: {
                default: '\\mathcal{P}_{r} = \\int_{0}^{\\infty} \\left[ \\frac{\\sum_{i=1}^{n} \\oint_{\\Gamma} \\frac{\\det(\\mathbf{A}_{i})}{\\sqrt[3]{1 + e^{-\\lambda_i t}}} \\, d\\Gamma}{\\left( \\frac{\\partial^2}{\\partial x^2} + \\frac{\\partial^2}{\\partial y^2} \\right) \\Psi(x,y,t)} \\right] \\cdot \\prod_{k=1}^{M} \\left( \\sum_{j=0}^{\\infty} \\frac{(-1)^j}{j! \\, \\Gamma(j+\\nu+1)} \\left( \\frac{z}{2} \\right)^{2j+\\nu} \\right) \\, dt',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="math"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'math' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MathComponent);
    },

    addCommands() {
        return {
            setMath: ({ latex }) => ({ chain }) => {
                return chain()
                    .insertContent({
                        type: this.name,
                        attrs: { latex },
                    })
                    .run();
            },
        };
    },
});

