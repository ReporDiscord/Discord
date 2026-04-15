require('dotenv').config();

const fs = require('fs');
const express = require('express');
const app = express();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = process.env.PORT || 8080;

// ⚠️ PON TU ID DE SERVIDOR AQUÍ (para comandos instantáneos)
const GUILD_ID = "AQUI_TU_SERVER_ID";

// ===== CLIENTE =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== DATA =====
let xp = {};

if (fs.existsSync('./data.json')) {
  xp = JSON.parse(fs.readFileSync('./data.json'));
}

// ===== GUARDAR =====
function saveData() {
  fs.writeFileSync('./data.json', JSON.stringify(xp, null, 2));
}

// ===== COMANDOS =====
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde Pong'),

  new SlashCommandBuilder()
    .setName('info')
    .setDescription('Información del servidor'),

  new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Ver tu nivel'),

  new SlashCommandBuilder()
    .setName('top')
    .setDescription('Ranking global')
].map(cmd => cmd.toJSON());

// ===== READY =====
client.once('ready', async () => {
  console.log(`🔥 BOT activo como ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    // ⚡ COMANDOS INSTANTÁNEOS (solo en tu server)
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados correctamente');
  } catch (err) {
    console.error(err);
  }
});

// ===== XP SYSTEM =====
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const id = message.author.id;

  if (!xp[id]) {
    xp[id] = { xp: 0, level: 1 };
  }

  xp[id].xp += 10;

  if (xp[id].xp >= xp[id].level * 100) {
    xp[id].level++;

    message.channel.send(
      `🔥 ${message.author} subió a nivel ${xp[id].level}`
    );
  }

  saveData();
});

// ===== BIENVENIDA =====
client.on('guildMemberAdd', (member) => {
  const canal = member.guild.systemChannel;

  if (!canal) return;

  canal.send(
    `🔥 Bienvenido ${member.user} a **MU CORE**\n💀 Domina el servidor`
  );
});

// ===== COMANDOS =====
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const id = interaction.user.id;

  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  if (interaction.commandName === 'info') {
    const server = interaction.guild;

    return interaction.reply(
      `📊 **Servidor:** ${server.name}\n👥 Miembros: ${server.memberCount}`
    );
  }

  if (interaction.commandName === 'rank') {
    const data = xp[id] || { xp: 0, level: 1 };

    return interaction.reply(
      `🏆 Nivel: ${data.level} | XP: ${data.xp}`
    );
  }

  if (interaction.commandName === 'top') {
    const ranking = Object.entries(xp)
      .sort((a, b) => b[1].xp - a[1].xp)
      .slice(0, 5);

    let msg = '🏆 TOP PLAYERS\n\n';

    for (let i = 0; i < ranking.length; i++) {
      const user = await client.users.fetch(ranking[i][0]);
      msg += `${i + 1}. ${user.username} - XP: ${ranking[i][1].xp}\n`;
    }

    return interaction.reply(msg);
  }
});

// ===== API =====
app.get('/api/ranking', async (req, res) => {
  const ranking = [];

  for (const id in xp) {
    const user = await client.users.fetch(id);

    ranking.push({
      name: user.username,
      xp: xp[id].xp,
      level: xp[id].level
    });
  }

  ranking.sort((a, b) => b.xp - a.xp);

  res.json(ranking);
});

// ===== PANEL WEB =====
app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
    <title>MU CORE</title>
    <style>
      body { background:#0b1220; color:white; font-family:sans-serif; }
      table { width:100%; border-collapse:collapse; }
      td, th { padding:10px; border-bottom:1px solid #333; }
    </style>
  </head>
  <body>
    <h1>🔥 MU CORE DASHBOARD</h1>
    <h2>🤖 Bot: ONLINE</h2>

    <h2>🏆 Ranking</h2>
    <table id="tabla">
      <tr><th>Jugador</th><th>Nivel</th><th>XP</th></tr>
    </table>

    <script>
      fetch('/api/ranking')
        .then(res => res.json())
        .then(data => {
          const tabla = document.getElementById('tabla');

          data.forEach(user => {
            tabla.innerHTML += 
              '<tr><td>'+user.name+'</td><td>'+user.level+'</td><td>'+user.xp+'</td></tr>';
          });
        });
    </script>
  </body>
  </html>
  `);
});

// ===== START =====
app.listen(PORT, () => {
  console.log("🌐 Panel activo en puerto " + PORT);
});

client.login(TOKEN);
