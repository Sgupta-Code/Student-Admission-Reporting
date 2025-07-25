const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ['organic', 'ads', 'referral'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor'
    },
    status: {
        type: String,
        enum: ['new', 'contacted','demoed', 'admitted', 'rejected'],
        default: 'new'
    }
});

module.exports = mongoose.model('Lead',leadSchema);
