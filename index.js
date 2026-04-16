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
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
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

// ===== LOGIN =====
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

app.get('/', (req, res) => {
  res.send(`<h1>🔥 MU CORE PANEL</h1><a href="/login">Login Discord</a>`);
});

app.get('/panel', checkAuth, (req, res) => {
  res.send(`<h1>🔥 PANEL</h1><p>${req.user.username}</p>`);
});

// ===== COMANDOS =====
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Pong'),
  new SlashCommandBuilder().setName('rank').setDescription('Tu nivel')
].map(c => c.toJSON());

// ===== READY =====
client.once('ready', async () => {
  console.log(`🔥 BOT: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("✅ Comandos listos");

  client.guilds.cache.forEach(g => updateStats(g));
});

// ===== XP =====
client.on('messageCreate', msg => {
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
client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;

  const id = i.user.id;

  if (i.commandName === 'ping') return i.reply('🏓 Pong');

  if (i.commandName === 'rank') {
    const d = xp[id] || { xp: 0, level: 1 };
    return i.reply(`🏆 Nivel ${d.level} | XP ${d.xp}`);
  }
});

// ===== CONTADOR PRO MAX =====
async function updateStats(guild) {
  const members = await guild.members.fetch();

  const total = guild.memberCount;
  const humans = members.filter(m => !m.user.bot).size;
  const bots = members.filter(m => m.user.bot).size;
  const online = members.filter(m => m.presence?.status !== 'offline').size;

  // 🔥 REEMPLAZA ESTOS IDs
  const channels = {
    total: guild.channels.cache.get("1494133601091190957"),
    online: guild.channels.cache.get("1494133601091190957"),
    humans: guild.channels.cache.get("1494134216437530777"),
    bots: guild.channels.cache.get("1494134104369790976")
  };

  if (channels.total) channels.total.setName(`👥・Total: ${total}`);
  if (channels.online) channels.online.setName(`🟢・Online: ${online}`);
  if (channels.humans) channels.humans.setName(`👤・Humanos: ${humans}`);
  if (channels.bots) channels.bots.setName(`🤖・Bots: ${bots}`);
}

// ===== EVENTOS =====
client.on('guildMemberAdd', m => updateStats(m.guild));
client.on('guildMemberRemove', m => updateStats(m.guild));

client.on('presenceUpdate', (o, n) => {
  if (!n?.guild) return;
  updateStats(n.guild);
});

// ===== START =====
app.listen(PORT, () => console.log("🌐 Panel activo"));

client.login(TOKEN);
