console.log('Скрипт server.js запущен');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const bot = require('./telegramBot');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const Achievement = require('./Achievement');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для обработки JSON
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Маршруты пользователей
app.use('/api/users', userRoutes);

// Проверка подписки на Telegram-канал
app.post('/check-subscription', async (req, res) => {
    const { username } = req.body;
    const channelId = '@woobary'; // Замените на ваш канал

    try {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember?chat_id=${channelId}&user_id=${username}`);
        const isMember = response.data.result && (response.data.result.status === 'member' || response.data.result.status === 'administrator' || response.data.result.status === 'creator');

        res.json({ subscribed: isMember });
    } catch (error) {
        console.error('Ошибка проверки подписки:', error);
        res.status(500).json({ message: 'Ошибка при проверке подписки' });
    }
});

// Маршрут для обновления данных пользователя
app.post('/api/users/update', async (req, res) => {
  const { wooCoin, baryCoin, energy, level, hourlyEarnings, coinsPerClick, totalClicks, friendsCount } = req.body;
  const userId = req.userId; // Предположим, что идентификатор пользователя хранится в сессии или токене

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'Пользователь не найден' });
      }

      // Обновляем данные пользователя
      user.wooCoin = wooCoin;
      user.baryCoin = baryCoin;
      user.energy = energy;
      user.level = level;
      user.hourlyEarnings = hourlyEarnings;
      user.coinsPerClick = coinsPerClick;
      user.totalClicks = totalClicks;
      user.friendsCount = friendsCount;

      await user.save();
      res.json({ success: true });
  } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      res.status(500).json({ success: false, message: 'Ошибка при обновлении данных' });
  }
});

app.post('/award-achievement', async (req, res) => {
    const { chatId, criteria } = req.body;
  
    try {
      const user = await User.findOne({ telegramId: chatId });
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      await achievementService.checkAndAwardAchievement(user, criteria);
      res.json({ message: 'Достижение присвоено' });
    } catch (error) {
      console.error('Ошибка при выдаче достижения:', error);
      res.status(500).json({ message: 'Произошла ошибка' });
    }
  });
// Маршрут для регистрации с реферальным кодом
app.post('/api/register', async (req, res) => {
    const { username, referralCode } = req.body;
    try {
        let newUser = new User({
            username: username,
            wooCoin: 0,
            baryCoin: 0,
            energy: 2000,
            level: 1,
            referralCode: generateReferralCode(),
            referralCount: 0,
            lastLogin: new Date(),
        });

        if (referralCode) {
            const referrer = await User.findOne({ referralCode: referralCode });
            if (referrer) {
                referrer.referralCount += 1;
                await referrer.save();
                newUser.referredBy = referrer._id;
            }
        }

        await newUser.save();
        res.status(201).json({ message: 'Пользователь зарегистрирован', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Ошибка регистрации', error });
    }
});

// Генерация уникального реферального кода
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
