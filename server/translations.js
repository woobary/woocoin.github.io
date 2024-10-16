// translations.js
const translations = {
    en: {
      welcome: "Welcome, {username}! Your account has been created. You have received a welcome bonus of 10000 WooCoin and 50 BaryCoin.",
      welcome_back: "Welcome back, {username}!",
      daily_reward: "Congratulations! You received {amount} WooCoin as a daily reward. Your current streak is {streak} days.",
      already_received: "You have already received your daily reward. Try again tomorrow.",
      menu_prompt: "Choose an action:",
      daily: "Get daily reward",
      stats: "Show statistics",
      help: "List of commands",
      language_changed: "Language has been changed to English.",
      help_message: `
        📋 Available commands:
        /start - Start using the bot and create an account
        /daily - Get daily reward
        /stats - Show current player data
        /help - Show list of commands
        /menu - Show menu
        /setlanguage - Change interface language
      `
    },
    ru: {
      welcome: "Добро пожаловать, {username}! Ваш аккаунт создан. Вы получили приветственный бонус: 10000 WooCoin и 50 BaryCoin.",
      welcome_back: "С возвращением, {username}!",
      daily_reward: "Поздравляем! Вы получили {amount} WooCoin за ежедневный вход. Ваша текущая серия: {streak} дней.",
      already_received: "Вы уже получили ежедневную награду. Попробуйте снова завтра.",
      menu_prompt: "Выберите действие:",
      daily: "Получить ежедневную награду",
      stats: "Показать статистику",
      help: "Список команд",
      language_changed: "Язык интерфейса изменен на русский.",
      help_message: `
        📋 Доступные команды:
        /start - Начать работу с ботом и создать аккаунт
        /daily - Получить ежедневную награду
        /stats - Показать текущие данные игрока
        /help - Показать список команд
        /menu - Показать меню
        /setlanguage - Изменить язык интерфейса
      `
    }
  };
  
  module.exports = translations;
  