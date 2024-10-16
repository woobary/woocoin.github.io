const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('7553297159:AAFyloFGdURItm4dofJfcfjj_Wo5S6VCgaE', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Тестовый бот работает!');
});

console.log('Тестовый бот запущен');
