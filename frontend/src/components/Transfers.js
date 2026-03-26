import React, { useState, useEffect } from 'react';
import { transferAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Common.css';

const Transfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [formData, setFormData] = useState({
        assetName: '',
        assetType: 'Vehicle',
        fromBase: '',
        toBase: '',
        quantity: ''
    });
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchTransfers();
        if (user.base) {
            setFormData(prev => ({ ...prev, fromBase: user.base }));
        }
    }, [user]);

    const fetchTransfers = async () => {
        try {
            const response = await transferAPI.getAll();
            setTransfers(response.data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await transferAPI.create(formData);
            setMessage('Transfer completed successfully');
            setFormData({ 
                assetName: '', 
                assetType: 'Vehicle', 
                fromBase: user.base || '', 
                toBase: '', 
                quantity: '' 
            });
            fetchTransfers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error processing transfer');
        }
    };

    return (
        <div className="page-container">
            <h2>Transfers</h2>
            
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    placeholder="Asset Name"
                    value={formData.assetName}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    required
                />
                <select
                    value={formData.assetType}
                    onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Ammunition">Ammunition</option>
                </select>
                {user.role === 'Admin' ? (
                    <input
                        type="text"
                        placeholder="From Base"
                        value={formData.fromBase}
                        onChange={(e) => setFormData({ ...formData, fromBase: e.target.value })}
                        required
                    />
                ) : (
                    <input type="text" value={user.base} disabled />
                )}
                <input
                    type="text"
                    placeholder="To Base"
                    value={formData.toBase}
                    onChange={(e) => setFormData({ ...formData, toBase: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                />
                <button type="submit">Transfer Asset</button>
            </form>

            {message && <div className="message">{message}</div>}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>From Base</th>
                        <th>To Base</th>
                        <th>Quantity</th>
                        <th>Initiated By</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer) => (
                        <tr key={transfer._id}>
                            <td>{new Date(transfer.transferDate).toLocaleDateString()}</td>
                            <td>{transfer.assetName}</td>
                            <td>{transfer.assetType}</td>
                            <td>{transfer.fromBase}</td>
                            <td>{transfer.toBase}</td>
                            <td>{transfer.quantity}</td>
                            <td>{transfer.initiatedBy?.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transfers;
