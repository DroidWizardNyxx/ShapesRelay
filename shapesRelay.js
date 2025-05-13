const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Tokens para autenticar com a API da Shapes
const TOKENS = [
  process.env.SHAPES_TOKEN_1,
  process.env.SHAPES_TOKEN_2,
];

let tokenIndex = 0;
const nextToken = () => {
  tokenIndex = (tokenIndex + 1) % TOKENS.length;
  return TOKENS[tokenIndex];
};

// Nome do shape configurado no painel da Shapes
const SHAPE_USERNAME = process.env.SHAPE_USERNAME;

// Endpoint que o bot chama
app.post('/api/shape', async (req, res) => {
  const { prompt } = req.body;

  console.log('🔍 Prompt recebido:', prompt);

  if (!prompt || typeof prompt !== 'string') {
    console.error('❌ Prompt inválido ou ausente:', prompt);
    return res.status(400).json({ error: 'Prompt inválido ou ausente' });
  }

try {
  const payload = {
    model: `shapesinc/${SHAPE_USERNAME}`,
    messages: [
      { role: 'user', content: prompt }
    ]
  };

  console.log('📦 Payload enviado para Shapes:', JSON.stringify(payload, null, 2));

  const response = await axios.post(
    'https://api.shapes.inc/v1/chat/completions',
    payload,
    {
      headers: {
        Authorization: `Bearer ${nextToken()}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
  );

  console.log('✅ Resposta recebida da Shapes:', JSON.stringify(response.data, null, 2));

  const reply = response.data.choices?.[0]?.message?.content || 'Sem resposta.';
  res.json({ response: reply });

} catch (err) {
  console.error('❌ Erro Shapes:', {
    message: err.message,
    response: err.response?.data || 'No response data',
    status: err.response?.status || 'No status'
  });

  res.status(500).json({
    error: 'Erro ao se comunicar com Shapes',
    details: err.response?.data || err.message
  });
}
});

// ⚠️ ESSENCIAL para o Render detectar a porta aberta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Relay ativo na porta ${PORT}`);
});
