import React, { useState, useEffect } from 'react';
import { assignmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Common.css';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [expenditures, setExpenditures] = useState([]);
    const [activeTab, setActiveTab] = useState('assignments');
    const [assignmentForm, setAssignmentForm] = useState({
        assetName: '',
        assetType: 'Vehicle',
        base: '',
        assignedTo: '',
        quantity: '',
        purpose: ''
    });
    const [expenditureForm, setExpenditureForm] = useState({
        assetName: '',
        assetType: 'Vehicle',
        base: '',
        quantity: '',
        reason: ''
    });
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
        if (user.base) {
            setAssignmentForm(prev => ({ ...prev, base: user.base }));
            setExpenditureForm(prev => ({ ...prev, base: user.base }));
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [assignmentsRes, expendituresRes] = await Promise.all([
                assignmentAPI.getAll(),
                assignmentAPI.getExpenditures()
            ]);
            setAssignments(assignmentsRes.data);
            setExpenditures(expendituresRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignmentAPI.create(assignmentForm);
            setMessage('Assignment recorded successfully');
            setAssignmentForm({ 
                assetName: '', 
                assetType: 'Vehicle', 
                base: user.base || '', 
                assignedTo: '', 
                quantity: '', 
                purpose: '' 
            });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error recording assignment');
        }
    };

    const handleExpenditureSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignmentAPI.createExpenditure(expenditureForm);
            setMessage('Expenditure recorded successfully');
            setExpenditureForm({ 
                assetName: '', 
                assetType: 'Vehicle', 
                base: user.base || '', 
                quantity: '', 
                reason: '' 
            });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error recording expenditure');
        }
    };

    const canCreateAssignment = user.role === 'Admin' || user.role === 'Base Commander';

    return (
        <div className="page-container">
            <h2>Assignments & Expenditures</h2>
            
            <div className="tabs">
                <button 
                    className={activeTab === 'assignments' ? 'active' : ''} 
                    onClick={() => setActiveTab('assignments')}
                >
                    Assignments
                </button>
                <button 
                    className={activeTab === 'expenditures' ? 'active' : ''} 
                    onClick={() => setActiveTab('expenditures')}
                >
                    Expenditures
                </button>
            </div>

            {message && <div className="message">{message}</div>}

            {activeTab === 'assignments' && (
                <>
                    {canCreateAssignment && (
                        <form onSubmit={handleAssignmentSubmit} className="form-container">
                            <input
                                type="text"
                                placeholder="Asset Name"
                                value={assignmentForm.assetName}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, assetName: e.target.value })}
                                required
                            />
                            <select
                                value={assignmentForm.assetType}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, assetType: e.target.value })}
                            >
                                <option value="Vehicle">Vehicle</option>
                                <option value="Weapon">Weapon</option>
                                <option value="Ammunition">Ammunition</option>
                            </select>
                            {user.role === 'Admin' ? (
                                <input
                                    type="text"
                                    placeholder="Base"
                                    value={assignmentForm.base}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, base: e.target.value })}
                                    required
                                />
                            ) : (
                                <input type="text" value={user.base} disabled />
                            )}
                            <input
                                type="text"
                                placeholder="Assigned To"
                                value={assignmentForm.assignedTo}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, assignedTo: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={assignmentForm.quantity}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, quantity: e.target.value })}
                                required
                                min="1"
                            />
                            <input
                                type="text"
                                placeholder="Purpose (optional)"
                                value={assignmentForm.purpose}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, purpose: e.target.value })}
                            />
                            <button type="submit">Record Assignment</button>
                        </form>
                    )}

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Asset Name</th>
                                <th>Type</th>
                                <th>Base</th>
                                <th>Assigned To</th>
                                <th>Quantity</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment._id}>
                                    <td>{new Date(assignment.assignmentDate).toLocaleDateString()}</td>
                                    <td>{assignment.assetName}</td>
                                    <td>{assignment.assetType}</td>
                                    <td>{assignment.base}</td>
                                    <td>{assignment.assignedTo}</td>
                                    <td>{assignment.quantity}</td>
                                    <td>{assignment.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {activeTab === 'expenditures' && (
                <>
                    <form onSubmit={handleExpenditureSubmit} className="form-container">
                        <input
                            type="text"
                            placeholder="Asset Name"
                            value={expenditureForm.assetName}
                            onChange={(e) => setExpenditureForm({ ...expenditureForm, assetName: e.target.value })}
                            required
                        />
                        <select
                            value={expenditureForm.assetType}
                            onChange={(e) => setExpenditureForm({ ...expenditureForm, assetType: e.target.value })}
                        >
                            <option value="Vehicle">Vehicle</option>
                            <option value="Weapon">Weapon</option>
                            <option value="Ammunition">Ammunition</option>
                        </select>
                        {user.role === 'Admin' ? (
                            <input
                                type="text"
                                placeholder="Base"
                                value={expenditureForm.base}
                                onChange={(e) => setExpenditureForm({ ...expenditureForm, base: e.target.value })}
                                required
                            />
                        ) : (
                            <input type="text" value={user.base} disabled />
                        )}
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={expenditureForm.quantity}
                            onChange={(e) => setExpenditureForm({ ...expenditureForm, quantity: e.target.value })}
                            required
                            min="1"
                        />
                        <input
                            type="text"
                            placeholder="Reason (optional)"
                            value={expenditureForm.reason}
                            onChange={(e) => setExpenditureForm({ ...expenditureForm, reason: e.target.value })}
                        />
                        <button type="submit">Record Expenditure</button>
                    </form>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Asset Name</th>
                                <th>Type</th>
                                <th>Base</th>
                                <th>Quantity</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenditures.map((expenditure) => (
                                <tr key={expenditure._id}>
                                    <td>{new Date(expenditure.expenditureDate).toLocaleDateString()}</td>
                                    <td>{expenditure.assetName}</td>
                                    <td>{expenditure.assetType}</td>
                                    <td>{expenditure.base}</td>
                                    <td>{expenditure.quantity}</td>
                                    <td>{expenditure.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Assignments;
