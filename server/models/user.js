const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  wooCoin: { type: Number, default: 10000 }, // Приветственный бонус
  baryCoin: { type: Number, default: 50 },   // Приветственный бонус
  energy: { type: Number, default: 2000 },
  level: { type: Number, default: 1 },
  referralCount: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  language: { type: String, default: 'ru' }, // Язык по умолчанию
  lastDailyReward: { type: Date } // Для отслеживания ежедневных наград
});

// Экспортируем модель, проверяя, существует ли она уже
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
