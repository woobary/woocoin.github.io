const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Импорт модели

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { username, referralCode } = req.body;
  try {
    const newUser = new User({ username, referralCode });
    await newUser.save();
    res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Ошибка регистрации', error });
  }
});

// Получение данных пользователя
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error });
  }
});

// В routes/userRoutes.js
app.get('/api/user/achievements', async (req, res) => {
  const { chatId } = req.query;

  try {
    const user = await User.findOne({ telegramId: chatId }).populate('achievements');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user.achievements);
  } catch (error) {
    console.error('Ошибка при получении достижений пользователя:', error);
    res.status(500).json({ message: 'Произошла ошибка' });
  }
});


// Обновление баланса и энергии
router.post('/:id/update', async (req, res) => {
  const { wooCoin, baryCoin, energy } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.wooCoin = wooCoin !== undefined ? wooCoin : user.wooCoin;
    user.baryCoin = baryCoin !== undefined ? baryCoin : user.baryCoin;
    user.energy = energy !== undefined ? energy : user.energy;

    await user.save();
    res.json({ message: 'Данные обновлены', user });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления данных', error });
  }
});

module.exports = router;
