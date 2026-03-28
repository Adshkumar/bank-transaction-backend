const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'closed'],
        message: "Status must be either active, inactive or closed",
        default: 'active'
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;