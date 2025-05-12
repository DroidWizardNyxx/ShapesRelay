const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const TOKENS = [
  process.env.SHAPES_TOKEN_1,
  process.env.SHAPES_TOKEN_2,
];
let tokenIndex = 0;
const nextToken = () => {
  tokenIndex = (tokenIndex + 1) % TOKENS.length;
  return TOKENS[tokenIndex];
};

app.post('/api/shape', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  const payload = {
    data: Buffer.from(JSON.stringify({ prompt })).toString('base64'),
    timestamp: Date.now(),
  };

  try {
    const shapesResponse = await axios.post(
      'https://api.shapes.inc/v1/hidden-endpoint',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${nextToken()}`,
          'X-Request-ID': Math.random().toString(36).slice(2),
          'User-Agent': `DiscordBot/${Date.now()}`
        },
        timeout: 10000
      }
    );

    const decoded = Buffer.from(shapesResponse.data.data, 'base64').toString();
    const parsed = JSON.parse(decoded);

    res.json({ response: parsed.response });
  } catch (err) {
    console.error('Erro Shapes:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro no servidor Shapes' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relay online na porta ${PORT}`);
});
