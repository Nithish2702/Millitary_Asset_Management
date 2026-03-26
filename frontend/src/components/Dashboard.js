import React, { useState, useEffect } from 'react';
import { assetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const [assets, setAssets] = useState([]);
    const [filters, setFilters] = useState({ base: '', assetType: '' });
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [movements, setMovements] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchAssets();
    }, [filters]);

    const fetchAssets = async () => {
        try {
            const response = await assetAPI.getAll(filters);
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleViewMovements = async (asset) => {
        try {
            const response = await assetAPI.getMovements(asset.assetName, asset.base);
            setMovements(response.data);
            setSelectedAsset(asset);
        } catch (error) {
            console.error('Error fetching movements:', error);
        }
    };

    const closeModal = () => {
        setSelectedAsset(null);
        setMovements(null);
    };

    return (
        <div className="dashboard">
            <h2>Asset Dashboard</h2>
            
            <div className="filters">
                {user.role === 'Admin' && (
                    <select 
                        value={filters.base} 
                        onChange={(e) => setFilters({ ...filters, base: e.target.value })}
                    >
                        <option value="">All Bases</option>
                        <option value="Alpha Base">Alpha Base</option>
                        <option value="Bravo Base">Bravo Base</option>
                        <option value="Charlie Base">Charlie Base</option>
                    </select>
                )}
                <select 
                    value={filters.assetType} 
                    onChange={(e) => setFilters({ ...filters, assetType: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Ammunition">Ammunition</option>
                </select>
            </div>

            <table className="asset-table">
                <thead>
                    <tr>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>Base</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset) => (
                        <tr key={asset._id}>
                            <td>{asset.assetName}</td>
                            <td>{asset.assetType}</td>
                            <td>{asset.base}</td>
                            <td>{asset.quantity}</td>
                            <td>
                                <button onClick={() => handleViewMovements(asset)}>
                                    View Movements
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {movements && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Net Movements: {selectedAsset.assetName}</h3>
                        <p>Base: {selectedAsset.base}</p>
                        <div className="movements-summary">
                            <p>Purchases: +{movements.movements.purchases}</p>
                            <p>Transfers In: +{movements.movements.transfersIn}</p>
                            <p>Transfers Out: -{movements.movements.transfersOut}</p>
                            <p>Assignments: -{movements.movements.assignments}</p>
                            <p>Expenditures: -{movements.movements.expenditures}</p>
                            <p className="net-balance">Net Balance: {movements.movements.netBalance}</p>
                        </div>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
