const express = require('express');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const Asset = require('../models/Asset');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Create an assignment
router.post('/', auth, authorize('Admin', 'Base Commander'), async (req, res) => {
    try {
        const { assetName, assetType, base, assignedTo, quantity, purpose } = req.body;

        // Check if base has sufficient quantity
        const asset = await Asset.findOne({ assetName, base });
        if (!asset || asset.quantity < quantity) {
            return res.status(400).json({ 
                message: 'Insufficient quantity at base' 
            });
        }

        // Create assignment record
        const assignment = new Assignment({
            assetName,
            assetType,
            base,
            assignedTo,
            quantity,
            purpose,
            assignedBy: req.user._id
        });
        await assignment.save();

        // Update asset balance
        asset.quantity -= quantity;
        await asset.save();

        res.status(201).json({ 
            message: 'Assignment recorded successfully', 
            assignment 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error recording assignment', error: error.message });
    }
});

// Get all assignments
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

        const assignments = await Assignment.find(filter)
            .populate('assignedBy', 'username role')
            .sort({ assignmentDate: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
});

// Record expenditure
router.post('/expenditure', auth, authorize('Admin', 'Base Commander', 'Logistics Officer'), async (req, res) => {
    try {
        const { assetName, assetType, base, quantity, reason } = req.body;

        // Check if base has sufficient quantity
        const asset = await Asset.findOne({ assetName, base });
        if (!asset || asset.quantity < quantity) {
            return res.status(400).json({ 
                message: 'Insufficient quantity at base' 
            });
        }

        // Create expenditure record
        const expenditure = new Expenditure({
            assetName,
            assetType,
            base,
            quantity,
            reason,
            recordedBy: req.user._id
        });
        await expenditure.save();

        // Update asset balance
        asset.quantity -= quantity;
        await asset.save();

        res.status(201).json({ 
            message: 'Expenditure recorded successfully', 
            expenditure 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error recording expenditure', error: error.message });
    }
});

// Get all expenditures
router.get('/expenditure', auth, async (req, res) => {
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

        const expenditures = await Expenditure.find(filter)
            .populate('recordedBy', 'username role')
            .sort({ expenditureDate: -1 });

        res.json(expenditures);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenditures', error: error.message });
    }
});

module.exports = router;
