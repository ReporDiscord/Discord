const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// 🔥 Ejecuta comandos slash automáticamente (TEMPORAL)
require('./deploy-commands.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🧠 XP simple
const xp = new Map();

client.once('ready', () => {
  console.log(`🔥 Bot listo como ${client.user.tag}`);
});

// 💬 XP por mensaje
client.on('messageCreate', message => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const data = xp.get(userId) || { xp: 0, level: 1 };

  data.xp += 10;

  if (data.xp >= data.level * 100) {
    data.level++;
    message.channel.send(`🔥 ${message.author} subió a nivel ${data.level}`);
  }

  xp.set(userId, data);
});

// ⚡ SLASH COMMANDS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'info') {
    const embed = new EmbedBuilder()
      .setTitle("🔥 MU CORE HARD S6 🔥")
      .setColor("#00ffff")
      .setDescription("Servidor extremo Play To Win 💀");

    return interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'help') {
    return interaction.reply("📜 Usa /ping /info /help");
  }
});

client.login(process.env.TOKEN);
