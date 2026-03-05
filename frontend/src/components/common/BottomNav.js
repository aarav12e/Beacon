import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const NAV_ITEMS = [
    { path: '/dashboard', icon: '◈', label: 'Home' },
    { path: '/stocks', icon: '△', label: 'Markets' },
    { path: '/ai-chat', icon: '◆', label: 'AI' },
    { path: '/circulars', icon: '▣', label: 'Regulators' },
    { path: '/excel', icon: '⬡', label: 'Excel' },
    { path: '/research', icon: '◇', label: 'Research' },
];

// Pages where the bottom nav should NOT appear
const HIDDEN_PATHS = ['/', '/login'];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    // Don't render on public/landing pages
    if (HIDDEN_PATHS.includes(location.pathname)) return null;

    return (
        <div className="bottom-nav">
            {NAV_ITEMS.map(item => {
                const active = location.pathname === item.path;
                return (
                    <button
                        key={item.path}
                        className={`bottom-nav-item${active ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
