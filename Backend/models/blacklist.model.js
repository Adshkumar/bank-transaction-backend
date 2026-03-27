const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: string,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Blacklist', blacklistSchema);