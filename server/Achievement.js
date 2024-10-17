const mongoose = require('mongoose');
const User = require('./models/User');
const Achievement = require('./Achievement');

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  criteria: { type: String, required: true }, // Например, "clicks_1000"
  reward: { type: Number, required: true }, // Сумма WooCoin или BaryCoin за достижение
  icon: { type: String, required: true }, // Путь к иконке достижения
});

// Функция для проверки достижения и добавления его пользователю
async function checkAndAwardAchievement(user, criteria) {
    try {
      // Ищем достижение по критерию
      const achievement = await Achievement.findOne({ criteria });
      if (!achievement) return;
  
      // Проверяем, есть ли это достижение уже у пользователя
      if (user.achievements.includes(achievement._id)) return;
  
      // Добавляем достижение и награду пользователю
      user.achievements.push(achievement._id);
      user.wooCoin += achievement.reward; // Добавляем награду к WooCoin
      await user.save();
    } catch (error) {
      console.error('Ошибка при проверке и выдаче достижения:', error);
    }
  }
  
  module.exports = { checkAndAwardAchievement };
module.exports = mongoose.model('Achievement', achievementSchema);
