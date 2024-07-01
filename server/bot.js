const { Bot } = require("grammy");
const childProcess = require("child_process");
const os = require("os");
const process = require("process");
const ClearAllMessagesBotManager = require("./controllers/navigation/clearAllMessagesClass");
const nodeEnv = process.env.NODE_ENV || "development";
const greyBotToken = process.env.BOT_TOKEN;
// Webhooks
const greybot_webhook = `${process.env.TELEGRAM_URL}greybot_webhook`;


// Create Greybot instance
const Greybot = new Bot(greyBotToken);

// Initialize Greybot instance
async function initializeGreybot() {
  try {
    await Greybot.init();
    console.log("Greybot initialized successfully!");
    // Set webhook URL for Greybot
    await Greybot.api.setWebhook(greybot_webhook, {
      allowed_updates: [
        "chat_member",
        "message",
        "callback_query",
        "channel_post",
      ],
    });
    // console.log("Webhook set for Greybot:", greybot_webhook);
    
  } catch (err) {
    console.error("Error initializing Greybot:", err);
    // Send error to admin
    await sendSystemInfoToAdmin(err);
    // Restart the bot using PM2
    await restartBotWithPM2();
    throw err; // Throw the error to handle it later
  }
}

module.exports = {
    Greybot, 
    MessageBot,
    initializeGreybot,
    initializeMessageBot,
    clearAllMessages
  };