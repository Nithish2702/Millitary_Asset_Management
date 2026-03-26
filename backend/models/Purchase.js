const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
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
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
