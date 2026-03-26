import React, { useState, useEffect } from 'react';
import { purchaseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Common.css';

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [formData, setFormData] = useState({
        assetName: '',
        assetType: 'Vehicle',
        base: '',
        quantity: ''
    });
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchPurchases();
        if (user.base) {
            setFormData(prev => ({ ...prev, base: user.base }));
        }
    }, [user]);

    const fetchPurchases = async () => {
        try {
            const response = await purchaseAPI.getAll();
            setPurchases(response.data);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await purchaseAPI.create(formData);
            setMessage('Purchase recorded successfully');
            setFormData({ assetName: '', assetType: 'Vehicle', base: user.base || '', quantity: '' });
            fetchPurchases();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error recording purchase');
        }
    };

    const canCreate = user.role === 'Admin' || user.role === 'Logistics Officer';

    return (
        <div className="page-container">
            <h2>Purchases</h2>
            
            {canCreate && (
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
                            placeholder="Base"
                            value={formData.base}
                            onChange={(e) => setFormData({ ...formData, base: e.target.value })}
                            required
                        />
                    ) : (
                        <input type="text" value={user.base} disabled />
                    )}
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                        min="1"
                    />
                    <button type="submit">Record Purchase</button>
                </form>
            )}

            {message && <div className="message">{message}</div>}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>Base</th>
                        <th>Quantity</th>
                        <th>Purchased By</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                            <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                            <td>{purchase.assetName}</td>
                            <td>{purchase.assetType}</td>
                            <td>{purchase.base}</td>
                            <td>{purchase.quantity}</td>
                            <td>{purchase.purchasedBy?.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Purchases;
