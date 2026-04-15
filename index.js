const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`🔥 Bot conectado como ${client.user.tag}`);
});

// COMANDOS
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = "!";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 🏓 PING
  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }

  // 📜 HELP
  if (command === "help") {
    const embed = new EmbedBuilder()
      .setTitle("📜 COMANDOS DISPONIBLES")
      .setColor("#ff0000")
      .setDescription(`
🔥 **Comandos del servidor**

\`!ping\` → Respuesta del bot  
\`!info\` → Info del servidor  
\`!help\` → Ver comandos  
      `)
      .setFooter({ text: "MU CORE HARD S6" });

    return message.reply({ embeds: [embed] });
  }

  // 💎 INFO SERVER
  if (command === "info") {
    const embed = new EmbedBuilder()
      .setTitle("🔥 MU CORE HARD S6 🔥")
      .setColor("#00ffcc")
      .addFields(
        { name: "⚔️ Servidor", value: "Play To Win", inline: true },
        { name: "🔥 Season", value: "Season 6 EXTREMA", inline: true },
        { name: "👑 Nivel", value: "Hard Core", inline: true },
        { name: "📊 EXP", value: "20x - 5x", inline: true },
        { name: "💎 Drop", value: "20%", inline: true },
        { name: "🔁 Reset", value: "Max 3", inline: true }
      )
      .setFooter({ text: "Domina o serás dominado 💀" });

    return message.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
