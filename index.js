require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1490025222798053467";

// 🧠 BASE XP (memoria)
const users = new Map();

// 📜 COMANDOS
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Ping'),
  new SlashCommandBuilder().setName('rank').setDescription('Ver tu nivel'),
  new SlashCommandBuilder().setName('top').setDescription('Ranking')
].map(cmd => cmd.toJSON());

// 🚀 READY
client.once('ready', async () => {
  console.log(`🔥 ULTRA BOT activo: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log('✅ Comandos ULTRA cargados');
});

// 💬 XP AUTOMÁTICO
client.on('messageCreate', message => {
  if (message.author.bot) return;

  const id = message.author.id;

  const data = users.get(id) || { xp: 0, level: 1 };

  data.xp += 10;

  if (data.xp >= data.level * 100) {
    data.level++;
    message.channel.send(`🔥 ${message.author} subió a nivel ${data.level}`);
  }

  users.set(id, data);
});

// 🎮 SLASH
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const id = interaction.user.id;
  const data = users.get(id) || { xp: 0, level: 1 };

  // 🏓 PING
  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  // 🧠 RANK
  if (interaction.commandName === 'rank') {
    const embed = new EmbedBuilder()
      .setColor('#00ffcc')
      .setTitle(`🎮 ${interaction.user.username}`)
      .addFields(
        { name: 'Nivel', value: `${data.level}`, inline: true },
        { name: 'XP', value: `${data.xp}`, inline: true }
      );

    return interaction.reply({ embeds: [embed] });
  }

  // 🏆 TOP
  if (interaction.commandName === 'top') {
    const sorted = [...users.entries()]
      .sort((a, b) => b[1].xp - a[1].xp)
      .slice(0, 5);

    let desc = '';

    sorted.forEach((user, i) => {
      desc += `#${i + 1} <@${user[0]}> - Nivel ${user[1].level}\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 TOP PLAYERS')
      .setDescription(desc || 'Sin datos');

    return interaction.reply({ embeds: [embed] });
  }
});

client.login(TOKEN);
