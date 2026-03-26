import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import './App.css';

function AppContent() {
    const { user, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app">
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="content">
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'purchases' && <Purchases />}
                {currentPage === 'transfers' && <Transfers />}
                {currentPage === 'assignments' && <Assignments />}
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
