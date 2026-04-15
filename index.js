require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// 🌐 Servidor Express (para Render)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🤖 Bot Discord activo");
});

app.listen(3000, () => {
  console.log("🌐 Web activa en puerto 3000");
});

// 🤖 Cliente Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("🔥 Bot Discord activo");
});

client.login(process.env.DISCORD_TOKEN);
