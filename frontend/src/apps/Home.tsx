import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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
    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="display-medium">Welcome back, Sebastian</h1>
                <p className="body-large">Continue where you left off</p>
            </header>

            <motion.div
                className="recent-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} className="file-card bouncy" variants={itemVariants}>
                        <div className="card-preview"></div>
                        <div className="card-info">
                            <div className="card-title">Project Proposal {i}</div>
                            <div className="card-meta">Edited yesterday</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                className="fab"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Plus size={24} color="var(--md-sys-color-on-primary-container)" />
                <span>New</span>
            </motion.button>
        </div>
    );
};
