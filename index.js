require('dotenv').config();

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔐 TOKEN
const TOKEN = process.env.TOKEN;

// 🧠 BASE DE DATOS SIMPLE (COMPARTIDA CON PANEL)
global.users = new Map();

// 🔥 BOT LISTO
client.once('ready', () => {
  console.log(`🔥 BOT activo como ${client.user.tag}`);
});

// 💬 SISTEMA XP
client.on('messageCreate', message => {
  if (message.author.bot) return;

  const id = message.author.id;
  const data = global.users.get(id) || { name: message.author.username, xp: 0, level: 1 };

  data.xp += 10;

  if (data.xp >= data.level * 100) {
    data.level++;
    message.channel.send(`🔥 ${message.author} subió a nivel ${data.level}`);
  }

  global.users.set(id, data);
});

// 🔐 LOGIN
client.login(TOKEN);

// 🌐 PANEL WEB
require('./server.js');
