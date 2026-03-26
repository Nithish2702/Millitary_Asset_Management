const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    assetType: {
        type: String,
        enum: ['Vehicle', 'Weapon', 'Ammunition'],
        required: true
    },
    base: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String,
        default: 'units'
    }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
