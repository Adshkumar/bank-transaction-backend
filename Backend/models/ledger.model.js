const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true,
        immutable: true
    },
    transactions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true,
        index: true,
        immutable: true
    }, 
    amount: {
        type: Number,
        required: true,
        immutable: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
        immutable: true
    },
    date: {
        type: Date,
    }
    
}, { timestamps: true });   

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;