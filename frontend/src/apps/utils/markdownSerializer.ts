import type { JSONContent } from '@tiptap/core';

export const serializeToMarkdown = (content: JSONContent): string => {
    if (!content) return '';

    const serializeNode = (node: JSONContent): string => {
        switch (node.type) {
            case 'doc':
                return node.content?.map(serializeNode).join('\n\n') || '';

            case 'paragraph':
                return node.content?.map(serializeNode).join('') || '';

            case 'text':
                let text = node.text || '';
                if (node.marks) {
                    node.marks.forEach(mark => {
                        switch (mark.type) {
                            case 'bold':
                                text = `**${text}**`;
                                break;
                            case 'italic':
                                text = `*${text}*`;
                                break;
                            case 'strike':
                                text = `~~${text}~~`;
                                break;
                            case 'code':
                                text = `\`${text}\``;
                                break;
                            case 'underline':
                                // Markdown doesn't standardly support underline, but HTML does
                                text = `<u>${text}</u>`;
                                break;
                            case 'superscript':
                                text = `<sup>${text}</sup>`;
                                break;
                            case 'subscript':
                                text = `<sub>${text}</sub>`;
                                break;
                        }
                    });
                }
                return text;

            case 'heading':
                const level = node.attrs?.level || 1;
                return `${'#'.repeat(level)} ${node.content?.map(serializeNode).join('')}`;

            case 'bulletList':
                return node.content?.map(item => serializeNode({ ...item, attrs: { ...item.attrs, listType: 'bullet' } })).join('\n') || '';

            case 'orderedList':
                return node.content?.map((item, index) => serializeNode({ ...item, attrs: { ...item.attrs, listType: 'ordered', index: index + 1 } })).join('\n') || '';

            case 'listItem':
                const prefix = node.attrs?.listType === 'ordered' ? `${node.attrs.index}. ` : '- ';
                // Helper to handle multiple paragraphs in list items if needed, simplify for now
                const itemContent = node.content?.map(serializeNode).join('');
                return `${prefix}${itemContent}`;

            case 'codeBlock':
                const code = node.content?.map(c => c.text).join('') || '';
                const lang = node.attrs?.language || '';
                return `\`\`\`${lang}\n${code}\n\`\`\``;

            case 'blockquote':
                return node.content?.map(serializeNode).join('\n').split('\n').map(line => `> ${line}`).join('\n') || '';

            case 'horizontalRule':
                return '---';

            case 'image':
                return `![${node.attrs?.alt || ''}](${node.attrs?.src || ''})`;

            case 'math': // Custom extension
                return `$${node.attrs?.latex}$`;

            case 'table':
                // Serialize table to Markdown pipe table
                // Note: This is a simplified serializer. Complex tables with merged cells might break.
                // We need to look at rows to determine columns.
                return node.content?.map((row, i) => serializeNode({ ...row, attrs: { ...row.attrs, isHeader: i === 0 } })).join('\n') || '';

            case 'tableRow':
                return `| ${node.content?.map(cell => serializeNode(cell)).join(' | ')} |`;

            case 'tableHeader':
            case 'tableCell':
                const cellContent = node.content?.map(serializeNode).join('') || '';
                // Escape pipes if any
                return cellContent.replace(/\|/g, '\\|');

            // Special case: We need to inject the separator row for the table header
            // But simple traversal makes it hard to inject "between" rows. 
            // Better approach for 'table': Map rows. If index 0, append separator row.

            default:
                // Fallback for unknown nodes
                return node.content?.map(serializeNode).join('') || '';
        }
    };

    // Helper to fix table serialization essentially requiring 2 passes or smarter logic
    // Let's refine the 'table' case above.
    const customSerialize = (node: JSONContent): string => {
        if (node.type === 'table') {
            const rows = node.content || [];
            if (rows.length === 0) return '';

            let markdown = '';
            rows.forEach((row, rowIndex) => {
                const cells = row.content || [];
                const rowMarkdown = `| ${cells.map(cell => {
                    const cellText = cell.content?.map(c => serializeNode(c)).join('') || '';
                    if (!cellText.trim()) return ' '; // Ensure empty cells have space
                    return cellText.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
                }).join(' | ')} |`;

                markdown += rowMarkdown + '\n';

                // If this was the header row, add separator
                // Checking if first row is header? usually row 0 is header in tiptap if configured
                if (rowIndex === 0) {
                    const separator = `| ${cells.map(() => '---').join(' | ')} |`;
                    markdown += separator + '\n';
                }
            });
            return markdown;
        }
        return serializeNode(node);
    };

    return customSerialize(content);
};
