const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    assetName: {
        type: String,
        required: true
    },
    assetType: {
        type: String,
        enum: ['Vehicle', 'Weapon', 'Ammunition'],
        required: true
    },
    fromBase: {
        type: String,
        required: true
    },
    toBase: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    transferDate: {
        type: Date,
        default: Date.now
    },
    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Rejected'],
        default: 'Completed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
