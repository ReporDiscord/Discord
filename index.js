require('dotenv').config();

const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const app = express();
app.use(express.json());

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1494077640355741947";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 8080;

// ===== BOT =====
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

function saveData() {
  fs.writeFileSync('./data.json', JSON.stringify(xp, null, 2));
}

// ===== LOGIN DISCORD =====
app.use(session({
  secret: process.env.SESSION_SECRET || "123456",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: "https://discord-production-f4e2.up.railway.app/auth/callback",
  scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// ===== LOGIN ROUTES =====
app.get('/login', passport.authenticate('discord'));

app.get('/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => res.redirect('/panel')
);

app.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/');
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// ===== PANEL =====
app.get('/', (req, res) => {
  res.send(`
    <h1>🔥 MU CORE PANEL</h1>
    ${
      req.isAuthenticated()
        ? `<p>${req.user.username}</p><a href="/panel">Panel</a>`
        : `<a href="/login">Login con Discord</a>`
    }
  `);
});

app.get('/panel', checkAuth, (req, res) => {
  res.send(`
    <h1>🔥 PANEL ADMIN</h1>
    <p>Usuario: ${req.user.username}</p>
    <a href="/logout">Cerrar sesión</a>
  `);
});

// ===== COMANDOS =====
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Pong'),
  new SlashCommandBuilder().setName('info').setDescription('Info server'),
  new SlashCommandBuilder().setName('rank').setDescription('Tu nivel'),
  new SlashCommandBuilder().setName('top').setDescription('Ranking')
].map(c => c.toJSON());

// ===== READY =====
client.once('ready', async () => {
  console.log(`🔥 BOT activo: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  // 🔥 SIN GUILD_ID (evita crash)
  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("✅ Comandos cargados");
});

// ===== XP =====
client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;

  const id = msg.author.id;
  if (!xp[id]) xp[id] = { xp: 0, level: 1 };

  xp[id].xp += 10;

  if (xp[id].xp >= xp[id].level * 100) {
    xp[id].level++;
    msg.channel.send(`🔥 ${msg.author} subió a nivel ${xp[id].level}`);
  }

  saveData();
});

// ===== INTERACCIONES =====
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;

  const id = i.user.id;

  if (i.commandName === 'ping') return i.reply('🏓 Pong');

  if (i.commandName === 'info') {
    return i.reply(`📊 ${i.guild.name} | 👥 ${i.guild.memberCount}`);
  }

  if (i.commandName === 'rank') {
    const d = xp[id] || { xp: 0, level: 1 };
    return i.reply(`🏆 Nivel ${d.level} | XP ${d.xp}`);
  }

  if (i.commandName === 'top') {
    const top = Object.entries(xp)
      .sort((a,b)=>b[1].xp-a[1].xp)
      .slice(0,5);

    let msg = "🏆 TOP\n\n";

    for (let x = 0; x < top.length; x++) {
      const user = await client.users.fetch(top[x][0]);
      msg += `${x+1}. ${user.username} - ${top[x][1].xp}\n`;
    }

    i.reply(msg);
  }
});

// ===== API =====
app.get('/api/ranking', async (req, res) => {
  const arr = [];

  for (const id in xp) {
    const user = await client.users.fetch(id);

    arr.push({
      name: user.username,
      xp: xp[id].xp,
      level: xp[id].level
    });
  }

  arr.sort((a,b)=>b.xp-a.xp);
  res.json(arr);
});

// ===== START =====
app.listen(PORT, () => {
  console.log("🌐 Panel activo");
});

client.login(TOKEN);
