const express = require('express');
const cors = require('cors');
const filesRouter = require('./routes/files');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/files', filesRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'RIK Lab4 File Server' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
