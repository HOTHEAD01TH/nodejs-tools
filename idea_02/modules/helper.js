const axios = require('axios');
const TelegramBot = require('telegram-bot-api');

const bot = new TelegramBot({
    token: process.env.TELEGRAM_BOT_TOKEN
});

const helper = {
  async getAxiosRaw(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.message);
      return null;
    }
  },
  
  pingTelegram(message) {
    bot.sendMessage({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message });
  },
};

module.exports = helper;
