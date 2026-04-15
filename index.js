require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("🔥 Bot Discord activo");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // !ping
  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }

  // !info
  if (message.content === "!info") {
    message.reply("🔥 Servidor MU CORE HARD S6 activo!");
  }

  // !mu
  if (message.content === "!mu") {
    message.reply("⚔️ Entra ahora: https://tuservidor.com");
  }

  // respuesta automática
  if (message.content.toLowerCase().includes("hola")) {
    message.reply("👋 Hola! Bienvenido al servidor");
  }
});

client.login(process.env.DISCORD_TOKEN);
