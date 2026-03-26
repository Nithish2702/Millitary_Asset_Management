import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>Military Asset Management</h1>
            </div>
            <div className="navbar-menu">
                <button 
                    className={currentPage === 'dashboard' ? 'active' : ''} 
                    onClick={() => setCurrentPage('dashboard')}
                >
                    Dashboard
                </button>
                {(user.role === 'Admin' || user.role === 'Logistics Officer') && (
                    <button 
                        className={currentPage === 'purchases' ? 'active' : ''} 
                        onClick={() => setCurrentPage('purchases')}
                    >
                        Purchases
                    </button>
                )}
                <button 
                    className={currentPage === 'transfers' ? 'active' : ''} 
                    onClick={() => setCurrentPage('transfers')}
                >
                    Transfers
                </button>
                <button 
                    className={currentPage === 'assignments' ? 'active' : ''} 
                    onClick={() => setCurrentPage('assignments')}
                >
                    Assignments
                </button>
            </div>
            <div className="navbar-user">
                <span>{user.username} ({user.role})</span>
                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
