const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
    assignedTo: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    assignmentDate: {
        type: Date,
        default: Date.now
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
