require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =======================
// 🔧 CONFIG (EDITA ESTO)
// =======================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "AQUI_TU_GUILD_ID"; // 🔥 REEMPLAZA
const CANAL_BIENVENIDA = "general"; // 🔥 REEMPLAZA SI TU CANAL SE LLAMA DISTINTO
const ROL_VERIFICADO = "Miembro";   // 🔥 REEMPLAZA SI TU ROL SE LLAMA DISTINTO

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Falta TOKEN, CLIENT_ID o GUILD_ID");
  process.exit(1);
}

// =======================
// 🧠 BASE XP (MEMORIA)
// =======================
const users = new Map();

// =======================
// 📜 COMANDOS
// =======================
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Verifica el bot'),

  new SlashCommandBuilder().setName('info').setDescription('Info del servidor'),

  new SlashCommandBuilder().setName('help').setDescription('Lista de comandos'),

  new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Enviar anuncio (admin)')
    .addStringOption(opt =>
      opt.setName('mensaje').setDescription('Mensaje').setRequired(true)
    ),

  new SlashCommandBuilder().setName('ticket').setDescription('Abrir panel de tickets'),

  new SlashCommandBuilder().setName('rank').setDescription('Ver tu nivel'),

  new SlashCommandBuilder().setName('top').setDescription('Ranking del servidor')
].map(cmd => cmd.toJSON());

// =======================
// 🚀 READY + REGISTRO
// =======================
client.once('ready', async () => {
  console.log(`🔥 BOT TOP GLOBAL activo: ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    console.log('🚀 Registrando comandos (instantáneo)...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Comandos listos');
  } catch (e) {
    console.error('❌ Error registrando comandos:', e);
  }
});

// =======================
// 🎉 BIENVENIDA PRO + DM
// =======================
client.on('guildMemberAdd', async member => {
  const canal = member.guild.channels.cache.find(c => c.name === CANAL_BIENVENIDA);
  if (!canal) return;

  const imagen = `https://api.dicebear.com/7.x/bottts/png?seed=${member.user.username}`;

  const embed = new EmbedBuilder()
    .setColor('#00ffcc')
    .setTitle('🎉 ¡NUEVO JUGADOR!')
    .setDescription(
      `👋 Bienvenido ${member} a **${member.guild.name}**\n\n` +
      `⚔️ Prepárate para MU CORE HARD S6\n` +
      `📜 Verifícate con el botón`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(imagen)
    .setFooter({ text: `Usuario #${member.guild.memberCount}` });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('Verificarse')
      .setStyle(ButtonStyle.Success)
  );

  canal.send({ embeds: [embed], components: [row] });

  try {
    await member.send(`👋 Bienvenido a ${member.guild.name}\n🔥 Disfruta el servidor`);
  } catch {}
});

// =======================
// 💬 XP AUTOMÁTICO
// =======================
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

// =======================
// 🎮 INTERACCIONES
// =======================
client.on('interactionCreate', async interaction => {

  // 🔘 BOTÓN VERIFICAR
  if (interaction.isButton()) {
    if (interaction.customId === 'verificar') {
      const rol = interaction.guild.roles.cache.find(r => r.name === ROL_VERIFICADO);

      if (!rol) {
        return interaction.reply({ content: '❌ Rol no encontrado', ephemeral: true });
      }

      try {
        await interaction.member.roles.add(rol);
        return interaction.reply({ content: '✅ Verificado', ephemeral: true });
      } catch {
        return interaction.reply({ content: '❌ Error al asignar rol', ephemeral: true });
      }
    }
  }

  // 🎯 SLASH
  if (!interaction.isChatInputCommand()) return;

  const id = interaction.user.id;
  const data = users.get(id) || { xp: 0, level: 1 };

  // 🏓 PING
  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  // 📊 INFO
  if (interaction.commandName === 'info') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 Info del servidor')
      .setDescription(`👥 Usuarios: ${interaction.guild.memberCount}`);
    return interaction.reply({ embeds: [embed] });
  }

  // 📜 HELP
  if (interaction.commandName === 'help') {
    return interaction.reply('📜 /ping /info /anuncio /ticket /rank /top');
  }

  // 📢 ANUNCIO
  if (interaction.commandName === 'anuncio') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ Sin permisos', ephemeral: true });
    }

    const msg = interaction.options.getString('mensaje');

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('📢 ANUNCIO')
      .setDescription(msg);

    await interaction.channel.send({ embeds: [embed] });
    return interaction.reply({ content: '✅ Enviado', ephemeral: true });
  }

  // 🎟️ PANEL TICKET
  if (interaction.commandName === 'ticket') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('crear_ticket')
        .setLabel('Abrir Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setColor('#00ffff')
      .setTitle('🎟️ SOPORTE')
      .setDescription('Haz clic para abrir un ticket');

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  // 🎟️ CREAR TICKET
  if (interaction.isButton() && interaction.customId === 'crear_ticket') {
    const canal = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0
    });

    canal.send(`🎟️ Ticket de ${interaction.user}`);
    return interaction.reply({ content: '✅ Ticket creado', ephemeral: true });
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
    sorted.forEach((u, i) => {
      desc += `#${i + 1} <@${u[0]}> - Nivel ${u[1].level}\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#ffd700')
      .setTitle('🏆 TOP PLAYERS')
      .setDescription(desc || 'Sin datos');

    return interaction.reply({ embeds: [embed] });
  }
});

// =======================
// 🔐 LOGIN
// =======================
client.login(TOKEN);
