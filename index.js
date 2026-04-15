require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = "1490025222798053467"; // TU SERVER

// 📜 COMANDOS
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Verifica el bot'),

  new SlashCommandBuilder().setName('info').setDescription('Info del servidor'),

  new SlashCommandBuilder().setName('help').setDescription('Lista de comandos'),

  new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Enviar anuncio')
    .addStringOption(option =>
      option.setName('mensaje').setDescription('Mensaje').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abrir panel de tickets')
].map(cmd => cmd.toJSON());

// 🚀 READY
client.once('ready', async () => {
  console.log(`🔥 Bot PRO activo como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log('✅ Comandos PRO cargados');
});

// 🎉 BIENVENIDA + ROL
client.on('guildMemberAdd', member => {
  const canal = member.guild.channels.cache.find(c => c.name === 'general');

  if (canal) {
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🎉 NUEVO JUGADOR')
      .setDescription(`Bienvenido ${member} a **MU CORE HARD S6** 💀`);

    canal.send({ embeds: [embed] });
  }

  const rol = member.guild.roles.cache.find(r => r.name === 'Miembro');

  if (rol) member.roles.add(rol);
});

// 🎮 INTERACCIONES
client.on('interactionCreate', async interaction => {

  // 🎟️ BOTONES
  if (interaction.isButton()) {
    if (interaction.customId === 'crear_ticket') {
      const canal = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: 0,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel']
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages']
          }
        ]
      });

      canal.send(`🎟️ Ticket creado para ${interaction.user}`);
      interaction.reply({ content: '✅ Ticket creado', ephemeral: true });
    }
  }

  // 🎯 SLASH
  if (!interaction.isChatInputCommand()) return;

  // 🔹 PING
  if (interaction.commandName === 'ping') {
    return interaction.reply('🏓 Pong!');
  }

  // 🔹 INFO
  if (interaction.commandName === 'info') {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📊 Info del servidor')
      .setDescription(`👥 Usuarios: ${interaction.guild.memberCount}`);

    return interaction.reply({ embeds: [embed] });
  }

  // 🔹 HELP
  if (interaction.commandName === 'help') {
    return interaction.reply('📜 /ping /info /anuncio /ticket');
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

    interaction.channel.send({ embeds: [embed] });
    interaction.reply({ content: '✅ Anuncio enviado', ephemeral: true });
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

    interaction.reply({ embeds: [embed], components: [row] });
  }

});

client.login(TOKEN);
