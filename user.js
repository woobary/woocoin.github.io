const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    wooCoin: { type: Number, default: 0 },
    energy: { type: Number, default: 2000 },
    level: { type: Number, default: 1 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
