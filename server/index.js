require('dotenv').config();
const express = require('express');
const app = express();
const { Bot } = require('grammy');
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);
const axios = require('axios');
const cors = require('cors');

// Start the bot
bot.start();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());

const APP_URL = process.env.APP_URL;

// Handle /start command
const users = {};

bot.on('message', (ctx) => {
  const text = ctx.message.text; 
  if (text === '/start') {
    const user = ctx.from;
    const userInfo = {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    users[user.id] = userInfo; // Store the user info in the users object
    ctx.reply(`Welcome to the bot, ${userInfo.firstName}!`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Click here', web_app: { url: APP_URL.toString() }}],
          ],
        },
      });
  }
});

app.get('/api/user-info', (req, res) => {
  res.json(users); // Return all users' data
});

app.get('/api/user-info/:id', (req, res) => {
  const userId = req.params.id;
  const userInfo = users[userId]; // Get the user info by ID
  res.json(userInfo); // Return the single user's data
});

// Keep-alive route
app.get('/keepalive', (req, res) => {
  res.send('Server is alive');
});

// Start Express server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});