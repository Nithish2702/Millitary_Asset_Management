const express = require('express');
const Purchase = require('../models/Purchase');
const Asset = require('../models/Asset');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Record a purchase
router.post('/', auth, authorize('Admin', 'Logistics Officer'), async (req, res) => {
    try {
        const { assetName, assetType, base, quantity } = req.body;

        // Create purchase record
        const purchase = new Purchase({
            assetName,
            assetType,
            base,
            quantity,
            purchasedBy: req.user._id
        });
        await purchase.save();

        // Update or create asset balance
        let asset = await Asset.findOne({ assetName, base });
        if (asset) {
            asset.quantity += quantity;
            await asset.save();
        } else {
            asset = new Asset({ assetName, assetType, base, quantity });
            await asset.save();
        }

        res.status(201).json({ message: 'Purchase recorded successfully', purchase, asset });
    } catch (error) {
        res.status(500).json({ message: 'Error recording purchase', error: error.message });
    }
});

// Get all purchases
router.get('/', auth, async (req, res) => {
    try {
        const { base, assetType } = req.query;
        let filter = {};

        if (req.user.role !== 'Admin' && req.user.base) {
            filter.base = req.user.base;
        } else if (base) {
            filter.base = base;
        }

        if (assetType) {
            filter.assetType = assetType;
        }

        const purchases = await Purchase.find(filter)
            .populate('purchasedBy', 'username role')
            .sort({ purchaseDate: -1 });

        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
});

module.exports = router;
