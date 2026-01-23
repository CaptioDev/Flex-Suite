export interface DocumentMetadata {
    id: string;
    title: string;
    lastEdited: number;
    background: string;
}

export interface DocumentData extends DocumentMetadata {
    content: string;
}

const STORAGE_KEY = 'office_suite_documents';

export const getDocuments = (): DocumentMetadata[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        const docs = JSON.parse(stored) as DocumentData[];
        return docs.map(({ content, ...metadata }) => metadata);
    } catch (e) {
        console.error('Failed to parse documents from localStorage', e);
        return [];
    }
};

export const getDocumentById = (id: string): DocumentData | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        const docs = JSON.parse(stored) as DocumentData[];
        return docs.find(doc => doc.id === id) || null;
    } catch (e) {
        console.error('Failed to parse documents from localStorage', e);
        return null;
    }
};

export const saveDocument = (data: DocumentData) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let docs: DocumentData[] = [];
    if (stored) {
        try {
            docs = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse documents from localStorage', e);
        }
    }

    const index = docs.findIndex(doc => doc.id === data.id);
    if (index > -1) {
        docs[index] = { ...data, lastEdited: Date.now() };
    } else {
        docs.push({ ...data, lastEdited: Date.now() });
    }

    // Sort by last edited
    docs.sort((a, b) => b.lastEdited - a.lastEdited);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
};

export const deleteDocument = (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
        const docs = JSON.parse(stored) as DocumentData[];
        const filtered = docs.filter(doc => doc.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error('Failed to parse documents from localStorage', e);
    }
};
