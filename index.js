const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`🔥 Bot conectado como ${client.user.tag}`);
});

// 🔥 BIENVENIDA AUTOMÁTICA
client.on('guildMemberAdd', member => {
  const canal = member.guild.channels.cache.find(c => c.name === "general");

  if (!canal) return;

  const embed = new EmbedBuilder()
    .setTitle("🔥 NUEVO JUGADOR 🔥")
    .setDescription(`Bienvenido ${member} a **MU CORE HARD S6** 💀`)
    .setColor("#00ff00")
    .setFooter({ text: "Prepárate para lo extremo..." });

  canal.send({ embeds: [embed] });
});

// 🎮 COMANDOS
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
      .setTitle("📜 COMANDOS")
      .setColor("#ff0000")
      .setDescription(`
\`!ping\` → Ping  
\`!info\` → Info server  
\`!clear\` → Borrar mensajes  
\`!kick\` → Expulsar  
\`!ban\` → Banear  
      `);

    return message.reply({ embeds: [embed] });
  }

  // 💎 INFO
  if (command === "info") {
    const embed = new EmbedBuilder()
      .setTitle("🔥 MU CORE HARD S6 🔥")
      .setColor("#00ffff")
      .addFields(
        { name: "⚔️ Tipo", value: "Play To Win", inline: true },
        { name: "🔥 Season", value: "S6 EXTREMA", inline: true },
        { name: "📊 EXP", value: "20x - 5x", inline: true }
      );

    return message.reply({ embeds: [embed] });
  }

  // 🧹 CLEAR
  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("❌ Sin permisos");
    }

    const cantidad = args[0];
    if (!cantidad) return message.reply("❌ Escribe cantidad");

    await message.channel.bulkDelete(cantidad, true);
    message.channel.send(`🧹 Se borraron ${cantidad} mensajes`);
  }

  // 👢 KICK
  if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("❌ Sin permisos");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Menciona usuario");

    user.kick();
    message.channel.send(`👢 ${user.user.tag} fue expulsado`);
  }

  // 🔨 BAN
  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("❌ Sin permisos");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Menciona usuario");

    user.ban();
    message.channel.send(`🔨 ${user.user.tag} fue baneado`);
  }
});

client.login(process.env.TOKEN);
