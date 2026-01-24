import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDocuments, saveDocument, getDocumentById } from '../utils/storage';
import type { DocumentMetadata, DocumentData } from '../utils/storage';
import './Home.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 } as any
    }
};

export const Home = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState('');

    useEffect(() => {
        setDocuments(getDocuments());
    }, []);

    const handleTitleClick = (e: React.MouseEvent, doc: DocumentMetadata) => {
        e.stopPropagation();
        setEditingId(doc.id);
        setTempTitle(doc.title || 'Untitled Document');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(e.target.value);
    };

    const handleTitleSubmit = (id: string) => {
        if (!editingId) return;

        const docData = getDocumentById(id);
        if (docData) {
            const updatedDoc: DocumentData = {
                ...docData,
                title: tempTitle || 'Untitled Document'
            };
            saveDocument(updatedDoc);
            setDocuments(getDocuments());
        }
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleTitleSubmit(id);
        } else if (e.key === 'Escape') {
            setEditingId(null);
        }
    };

    const handleCreateNew = () => {
        const id = Math.random().toString(36).substring(2, 9);
        navigate(`/docs/${id}`);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="display-medium">Welcome back</h1>
                <p className="body-large">Continue where you left off</p>
            </header>

            <motion.div
                className="recent-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {documents.map((doc) => (
                    <motion.div
                        key={doc.id}
                        className="file-card bouncy"
                        variants={itemVariants}
                        onClick={() => navigate(`/docs/${doc.id}`)}
                    >
                        <div className="card-preview" style={{ backgroundColor: doc.background || 'rgba(0,0,0,0.05)' }}></div>
                        <div className="card-info">
                            <div className="card-title-container">
                                {editingId === doc.id ? (
                                    <input
                                        className="card-title-input"
                                        autoFocus
                                        value={tempTitle}
                                        onChange={handleTitleChange}
                                        onBlur={() => handleTitleSubmit(doc.id)}
                                        onKeyDown={(e) => handleKeyDown(e, doc.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <div className="card-title" onClick={(e) => handleTitleClick(e, doc)}>
                                        {doc.title || 'Untitled Document'}
                                    </div>
                                )}
                            </div>
                            <div className="card-meta">Edited {formatDate(doc.lastEdited)}</div>
                        </div>
                    </motion.div>
                ))}
                {documents.length === 0 && (
                    <p style={{ color: 'var(--md-sys-color-outline)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                        No documents yet. Click the + button to create one!
                    </p>
                )}
            </motion.div>

            <motion.button
                className="fab"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCreateNew}
            >
                <Plus size={24} color="var(--md-sys-color-on-primary-container)" />
                <span>New</span>
            </motion.button>
        </div>
    );
};
