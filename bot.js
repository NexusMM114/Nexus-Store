const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function sendAdminAlert(text){
  bot.sendMessage(ADMIN_ID, text);
}

function sendOTP(username, otp){
  bot.sendMessage("@" + username, "Your OTP: " + otp);
}

module.exports = { sendAdminAlert, sendOTP };
