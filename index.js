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
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1490025222798053467"; // 🔥 TU SERVER ID

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Falta TOKEN, CLIENT_ID o GUILD_ID");
  process.exit(1);
}

// 📜 COMANDOS
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde Pong'),

  new SlashCommandBuilder()
    .setName('info')
    .setDescription('Info del servidor'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ver comandos')
].map(cmd => cmd.toJSON());

// 🚀 INICIO DEL BOT
client.once('ready', async () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    console.log('🚀 Registrando comandos instantáneos...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos listos al instante');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
});

// 🎮 RESPUESTAS
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // 🔹 PING
  if (interaction.commandName === 'ping') {
    const embed = new EmbedBuilder()
      .setColor('#00ff99')
      .setTitle('🏓 Pong!')
      .setDescription('El bot está funcionando correctamente')
      .setFooter({ text: 'MU CORE BOT' });

    await interaction.reply({ embeds: [embed] });
  }

  // 🔹 INFO
  if (interaction.commandName === 'info') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 Información del servidor')
      .setDescription(
        `📌 Nombre: ${interaction.guild.name}\n👥 Usuarios: ${interaction.guild.memberCount}`
      )
      .setFooter({ text: 'MU CORE BOT' });

    await interaction.reply({ embeds: [embed] });
  }

  // 🔹 HELP
  if (interaction.commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('📜 Comandos disponibles')
      .addFields(
        { name: '/ping', value: 'Verifica el bot', inline: true },
        { name: '/info', value: 'Información del servidor', inline: true },
        { name: '/help', value: 'Lista de comandos', inline: true }
      )
      .setFooter({ text: 'MU CORE BOT' });

    await interaction.reply({ embeds: [embed] });
  }
});

// 🔐 LOGIN
client.login(TOKEN);
