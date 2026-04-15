const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {

  const users = [...global.users.values()]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>MU CORE PANEL</title>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: #0f172a;
  color: white;
}

header {
  background: #020617;
  padding: 20px;
  text-align: center;
  font-size: 24px;
  color: #00ffff;
}

.container {
  padding: 20px;
}

.card {
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0,255,255,0.2);
}

h2 {
  margin-top: 0;
  color: #00ffff;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
}

th {
  background: #020617;
}

tr:nth-child(even) {
  background: #0f172a;
}

.status {
  color: #00ff99;
  font-weight: bold;
}
</style>
</head>

<body>

<header>🔥 MU CORE DASHBOARD</header>

<div class="container">

  <div class="card">
    <h2>🤖 Estado del Bot</h2>
    <p class="status">ONLINE</p>
  </div>

  <div class="card">
    <h2>🏆 Ranking en Vivo</h2>
    <table>
      <tr>
        <th>Jugador</th>
        <th>Nivel</th>
        <th>XP</th>
      </tr>

      ${users.map(u => `
        <tr>
          <td>${u.name}</td>
          <td>${u.level}</td>
          <td>${u.xp}</td>
        </tr>
      `).join('')}

    </table>
  </div>

</div>

</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log("🌐 Panel activo en puerto " + PORT);
});
