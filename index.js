require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ✅ BOT LISTO
client.once('ready', () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

// 🎮 COMANDOS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'info') {
    await interaction.reply('📊 Servidor activo');
  }

  if (interaction.commandName === 'help') {
    await interaction.reply('📜 Comandos: /ping /info /help');
  }
});

// 🔐 LOGIN
client.login(process.env.TOKEN);
