const express = require('express');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all assets with balances
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

        const assets = await Asset.find(filter).sort({ base: 1, assetName: 1 });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error: error.message });
    }
});

// Get net movements for an asset
router.get('/movements/:assetName/:base', auth, async (req, res) => {
    try {
        const { assetName, base } = req.params;

        const purchases = await Purchase.find({ assetName, base });
        const transfersIn = await Transfer.find({ assetName, toBase: base });
        const transfersOut = await Transfer.find({ assetName, fromBase: base });
        const assignments = await Assignment.find({ assetName, base });
        const expenditures = await Expenditure.find({ assetName, base });

        const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0);
        const totalTransfersIn = transfersIn.reduce((sum, t) => sum + t.quantity, 0);
        const totalTransfersOut = transfersOut.reduce((sum, t) => sum + t.quantity, 0);
        const totalAssignments = assignments.reduce((sum, a) => sum + a.quantity, 0);
        const totalExpenditures = expenditures.reduce((sum, e) => sum + e.quantity, 0);

        res.json({
            assetName,
            base,
            movements: {
                purchases: totalPurchases,
                transfersIn: totalTransfersIn,
                transfersOut: totalTransfersOut,
                assignments: totalAssignments,
                expenditures: totalExpenditures,
                netBalance: totalPurchases + totalTransfersIn - totalTransfersOut - totalAssignments - totalExpenditures
            },
            details: {
                purchases,
                transfersIn,
                transfersOut,
                assignments,
                expenditures
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movements', error: error.message });
    }
});

module.exports = router;
