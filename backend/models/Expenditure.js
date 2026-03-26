const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
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
        required: true
    },
    expenditureDate: {
        type: Date,
        default: Date.now
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Expenditure', expenditureSchema);
