const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// ✅ SOLO variables de entorno
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// ⚠️ Verificación
if (!TOKEN || !CLIENT_ID) {
  console.error("❌ Falta TOKEN o CLIENT_ID");
  process.exit(1);
}

// 📜 Comandos
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

// 🔌 API
const rest = new REST({ version: '10' }).setToken(TOKEN);

// 🚀 Registrar
(async () => {
  try {
    console.log('🚀 Registrando comandos...');

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos listos');
  } catch (error) {
    console.error(error);
  }
})();
// 🔴 REEMPLAZA ESTO SOLO SI NO USAS RAILWAY
// 👉 Si
    console.error('❌ Error:', error);
  }
})();
