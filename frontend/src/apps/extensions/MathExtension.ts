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
                default: 'E=mc^2',
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

