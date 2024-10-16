// models/User.js
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  wooCoin: { type: Number, default: 10000 }, // Приветственный бонус
  baryCoin: { type: Number, default: 50 },   // Приветственный бонус
  energy: { type: Number, default: 2000 },
  level: { type: Number, default: 1 },
  referralCount: { type: Number, default: 0 },
  lastLogin: { type: Date },
  language: { type: String, default: 'ru' },
  lastDailyReward: { type: Date, default: null },
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }] // Достижения
});

module.exports = mongoose.model('User', userSchema);
