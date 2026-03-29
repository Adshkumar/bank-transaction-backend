const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be positive"]
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required to prevent duplicate transactions"],
        unique: true
    }

}, { timestamps: true });
module.exports = mongoose.model('Transaction', transactionSchema);