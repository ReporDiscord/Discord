const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ Falta TOKEN o CLIENT_ID");
  process.exit(1);
}

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

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🚀 Registrando comandos...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados');
  } catch (error) {
    console.error(error);
  }
})();
