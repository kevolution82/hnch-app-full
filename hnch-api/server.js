const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 

app.get('/api/hello', (req, res) => {
  res.json({ message: 'API to user... do you copy?' });
});

app.post('/api/greet', (req, res) => {
  const name = req.body.name;
  res.json({ message: `Hola, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
