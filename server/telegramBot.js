const dotenv = require('dotenv');
dotenv.config();

const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User');
const translations = require('./translations');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('Бот запущен');

// Функция для получения перевода с учетом выбранного языка
function translate(user, key, params = {}) {
  const lang = user.language || 'ru';
  let message = translations[lang][key] || '';

  for (const [paramKey, paramValue] of Object.entries(params)) {
    message = message.replace(`{${paramKey}}`, paramValue);
  }
  return message;
}

// Обработка команды /start для регистрации
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || 'Без имени';

  try {
    let user = await User.findOne({ telegramId: chatId });

    if (!user) {
      user = new User({
        telegramId: chatId,
        username: username,
        wooCoin: 10000,  // Приветственный бонус
        baryCoin: 50,    // Приветственный бонус
        energy: 2000,
        level: 1,
        referralCount: 0,
        lastLogin: new Date(),
        language: 'ru',  // Язык по умолчанию - русский
        lastDailyReward: null  // Для отслеживания ежедневных наград
      });

      await user.save();
      bot.sendMessage(chatId, translate(user, 'welcome', { username }));
    } else {
      bot.sendMessage(chatId, translate(user, 'welcome_back', { username }));
    }

    showMenu(chatId, user);
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при регистрации. Попробуйте позже.');
  }
});

// Обработка команды /setlanguage для смены языка
bot.onText(/\/setlanguage/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Русский', callback_data: 'setlang_ru' },
          { text: 'English', callback_data: 'setlang_en' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, 'Выберите язык / Choose a language:', options);
});

// Обработка нажатий на кнопки для смены языка и других функций
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith('setlang_')) {
    const lang = data.split('_')[1];
    try {
      const user = await User.findOne({ telegramId: chatId });
      if (user) {
        user.language = lang;
        await user.save();
        bot.sendMessage(chatId, translate(user, 'language_changed'));
      }
    } catch (error) {
      console.error('Ошибка при смене языка:', error);
    }
  } else if (data === 'daily') {
    handleDailyReward(chatId);
  } else if (data === 'stats') {
    showStats(chatId);
  } else if (data === 'help') {
    showHelp(chatId);
  }
});

// Функция для отображения меню
function showMenu(chatId, user) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: translate(user, 'daily'), callback_data: 'daily' },
          { text: translate(user, 'stats'), callback_data: 'stats' }
        ],
        [
          { text: translate(user, 'help'), callback_data: 'help' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, translate(user, 'menu_prompt'), options);
}

// Функция для обработки ежедневных наград
async function handleDailyReward(chatId) {
  try {
    const user = await User.findOne({ telegramId: chatId });
    if (user) {
      const now = new Date();
      const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : null;

      if (!lastClaim || now - lastClaim >= 24 * 60 * 60 * 1000) {
        user.wooCoin += 5000; // Награда за ежедневный вход
        user.lastDailyReward = now;
        await user.save();
        bot.sendMessage(chatId, translate(user, 'daily_reward_claimed', { amount: 5000 }));
      } else {
        bot.sendMessage(chatId, translate(user, 'daily_reward_already_claimed'));
      }
    }
  } catch (error) {
    console.error('Ошибка при получении ежедневной награды:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении ежедневной награды.');
  }
}

// Функция для отображения статистики
async function showStats(chatId) {
  try {
    const user = await User.findOne({ telegramId: chatId });
    if (user) {
      const statsMessage = `
        👤 Имя: ${user.username}
        🏆 Уровень: ${user.level}
        💰 WooCoin: ${user.wooCoin}
        💸 BaryCoin: ${user.baryCoin}
      `;
      bot.sendMessage(chatId, statsMessage);
    } else {
      bot.sendMessage(chatId, 'Пользователь не найден. Введите /start для регистрации.');
    }
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении данных.');
  }
}

// Функция для отображения списка команд (помощи)
function showHelp(chatId) {
  const helpMessage = `
    📋 Доступные команды:
    /start - Начать работу с ботом и создать аккаунт
    /stats - Показать текущие данные игрока
    /help - Показать список команд
    /setlanguage - Изменить язык
    /menu - Показать меню выбора
  `;
  bot.sendMessage(chatId, helpMessage);
}

module.exports = bot;
