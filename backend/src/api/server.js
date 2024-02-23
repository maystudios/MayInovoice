require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Hier werden später Routen definiert

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
