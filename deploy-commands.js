const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// 🔥 AGREGA ESTO (ID DE TU SERVIDOR)
const GUILD_ID = "AQUI_TU_SERVER_ID";

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Falta TOKEN, CLIENT_ID o GUILD_ID");
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
    console.log('🚀 Registrando comandos (modo instantáneo)...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos instantáneos listos');
  } catch (error) {
    console.error(error);
  }
})();
