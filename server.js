const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// 🧠 Simulación de datos (luego conectamos al bot)
let users = [
  { name: "Jugador1", level: 5 },
  { name: "Jugador2", level: 3 }
];

app.get('/', (req, res) => {
  res.send(`
    <h1>🔥 MU CORE PANEL</h1>
    <p>Bot activo ✅</p>
    <h2>👑 Ranking</h2>
    <ul>
      ${users.map(u => `<li>${u.name} - Nivel ${u.level}</li>`).join("")}
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log("🌐 Panel web activo en puerto " + PORT);
});
