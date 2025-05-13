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

// Esse é o nome da sua shape no site da Shapes (ex: shapesinc/adriel-ai)
const SHAPE_USERNAME = process.env.SHAPE_USERNAME;

app.post('/api/shape', async (req, res) => {
  const { prompt } = req.body;
  
  console.log('🔍 Prompt recebido:', prompt);

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt inválido ou ausente' });
  }

  try {
    const response = await axios.post(
      'https://api.shapes.inc/v1/chat/completions',
      {
        model: `shapesinc/${SHAPE_USERNAME}`,
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${nextToken()}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'Sem resposta.';
    res.json({ response: reply });

  } catch (err) {
    console.error('❌ Erro Shapes:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao se comunicar com Shapes' });
  }
});
