const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Responde Pong'),
  new SlashCommandBuilder().setName('info').setDescription('Info del servidor'),
  new SlashCommandBuilder().setName('help').setDescription('Ver comandos')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🚀 Registrando comandos...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos slash listos');
  } catch (error) {
    console.error(error);
  }
})();
