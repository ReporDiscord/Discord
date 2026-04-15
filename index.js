require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

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

// 🚀 REGISTRAR + INICIAR
client.once('ready', async () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    console.log('🚀 Registrando comandos...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados correctamente');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
});

// 🎮 RESPUESTAS
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

client.login(TOKEN);
