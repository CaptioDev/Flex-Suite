import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        pageBreak: {
            setPageBreak: () => ReturnType,
        }
    }
}

export const PageBreak = Node.create({
    name: 'pageBreak',

    group: 'block',

    atom: true,

    parseHTML() {
        return [
            {
                tag: 'div[data-type="page-break"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'page-break', class: 'page-break' })];
    },

    addCommands() {
        return {
            setPageBreak: () => ({ chain }) => {
                return chain()
                    .insertContent({
                        type: this.name,
                    })
                    .run();
            },
        };
    },
});
