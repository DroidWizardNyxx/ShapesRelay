const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Tokens para autenticação rotativa
const TOKENS = [
  process.env.SHAPES_TOKEN_1,
  process.env.SHAPES_TOKEN_2,
];
let tokenIndex = 0;
const nextToken = () => {
  tokenIndex = (tokenIndex + 1) % TOKENS.length;
  return TOKENS[tokenIndex];
};

// Nome da shape configurado no .env
const SHAPE_USERNAME = process.env.SHAPE_USERNAME;

// Endpoint de uso pelo bot
app.post('/api/shape', async (req, res) => {
  const { prompt } = req.body;

  console.log('🔍 Prompt recebido:', prompt);

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt inválido ou ausente' });
  }

  const payload = {
    model: `shapesinc/${SHAPE_USERNAME}`,
    messages: [
      {
        role: 'user',
        content: prompt  // <=== Aqui tá o segredo do sucesso
      }
    ]
  };

  console.log('📦 Enviando payload:', payload);
  console.log('🔑 Usando token:', nextToken());

  try {
    const response = await axios.post(
      'https://api.shapes.inc/v1/chat/completions',
      payload,
      {
        headers: {
  Authorization: `Bearer ${nextToken()}`,
  'Content-Type': 'application/json',
  'X-User-Id': req.body.user_id,
  'X-Channel-Id': req.body.channel_id
},
          
        timeout: 10000
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'Sem resposta da Shape.';
    res.json({ response: reply });
  } catch (err) {
    console.error('❌ Erro Shapes:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro ao se comunicar com Shapes' });
  }
});

// Essencial para o Render detectar que seu servidor está no ar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Relay ativo na porta ${PORT}`);
});
