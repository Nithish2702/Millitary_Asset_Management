const express = require('express');
const Transfer = require('../models/Transfer');
const Asset = require('../models/Asset');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Create a transfer
router.post('/', auth, authorize('Admin', 'Base Commander', 'Logistics Officer'), async (req, res) => {
    try {
        const { assetName, assetType, fromBase, toBase, quantity } = req.body;

        // Check if source base has sufficient quantity
        const sourceAsset = await Asset.findOne({ assetName, base: fromBase });
        if (!sourceAsset || sourceAsset.quantity < quantity) {
            return res.status(400).json({ 
                message: 'Insufficient quantity at source base' 
            });
        }

        // Create transfer record
        const transfer = new Transfer({
            assetName,
            assetType,
            fromBase,
            toBase,
            quantity,
            initiatedBy: req.user._id
        });
        await transfer.save();

        // Update source base
        sourceAsset.quantity -= quantity;
        await sourceAsset.save();

        // Update destination base
        let destAsset = await Asset.findOne({ assetName, base: toBase });
        if (destAsset) {
            destAsset.quantity += quantity;
            await destAsset.save();
        } else {
            destAsset = new Asset({ assetName, assetType, base: toBase, quantity });
            await destAsset.save();
        }

        res.status(201).json({ 
            message: 'Transfer completed successfully', 
            transfer 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing transfer', error: error.message });
    }
});

// Get all transfers
router.get('/', auth, async (req, res) => {
    try {
        const { base, assetType } = req.query;
        let filter = {};

        if (req.user.role !== 'Admin' && req.user.base) {
            filter.$or = [
                { fromBase: req.user.base },
                { toBase: req.user.base }
            ];
        } else if (base) {
            filter.$or = [
                { fromBase: base },
                { toBase: base }
            ];
        }

        if (assetType) {
            filter.assetType = assetType;
        }

        const transfers = await Transfer.find(filter)
            .populate('initiatedBy', 'username role')
            .sort({ transferDate: -1 });

        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transfers', error: error.message });
    }
});

module.exports = router;
