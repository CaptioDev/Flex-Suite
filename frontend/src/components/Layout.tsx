import { motion } from 'framer-motion';
import { Home, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import './Layout.css'; // We'll create this or use inline styles with our variables

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <div className={clsx("nav-item", active && "active")}>
                <div className="icon-container">
                    <Icon size={24} color={active ? "var(--md-sys-color-on-secondary-container)" : "var(--md-sys-color-on-surface-variant)"} />
                    {active && (
                        <motion.div
                            layoutId="nav-pill"
                            className="nav-pill"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </div>
                <span className="label">{label}</span>
            </div>
        </Link>
    );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="app-container">
            <nav className="nav-rail">
                <div className="logo">BD</div>

                <div className="nav-items">
                    <NavItem to="/" icon={Home} label="Home" active={path === "/"} />
                    <NavItem to="/docs" icon={FileText} label="Docs" active={path.startsWith("/docs")} />
                </div>
            </nav>
            <main className="main-content">
                <div className="content-surface">
                    {children}
                </div>
            </main>
        </div>
    );
};
