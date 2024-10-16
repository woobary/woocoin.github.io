const express = require('express');
const mongoose = require('./db'); // Подключение к базе данных
const User = require('./models/User'); // Модель пользователя
const app = express();
const port = 3000;

// Обработка JSON данных
app.use(express.json());

// Маршрут для сохранения прогресса
app.post('/save-progress', async (req, res) => {
    const { telegramId, wooCoin, energy, level } = req.body;

    try {
        let user = await User.findOne({ telegramId });

        if (user) {
            // Обновляем данные пользователя
            user.wooCoin = wooCoin;
            user.energy = energy;
            user.level = level;
            user.lastUpdated = Date.now();
        } else {
            // Создаем нового пользователя
            user = new User({ telegramId, wooCoin, energy, level });
        }

        await user.save();
        res.send({ status: 'success' });
    } catch (err) {
        console.error('Error saving progress:', err);
        res.status(500).send({ status: 'error', message: 'Failed to save progress' });
    }
});

// Маршрут для загрузки прогресса
app.get('/load-progress/:telegramId', async (req, res) => {
    const { telegramId } = req.params;

    try {
        const user = await User.findOne({ telegramId });

        if (!user) {
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error loading progress:', err);
        res.status(500).send({ status: 'error', message: 'Failed to load progress' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
