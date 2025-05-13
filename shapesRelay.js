const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Tokens for authenticating with the Shapes API
const TOKENS = [
  process.env.SHAPES_TOKEN_1,
  process.env.SHAPES_TOKEN_2,
];

let tokenIndex = 0;
const nextToken = () => {
  tokenIndex = (tokenIndex + 1) % TOKENS.length;
  return TOKENS[tokenIndex];
};

// Shape username configured in the Shapes panel
const SHAPE_USERNAME = process.env.SHAPE_USERNAME;

// Endpoint that the bot calls
app.post('/api/shape', async (req, res) => {
  const { prompt } = req.body;

  console.log('🔍 Prompt received:', prompt);

  if (!prompt || typeof prompt !== 'string') {
    console.error('❌ Invalid or missing prompt:', prompt);
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  try {
    const payload = {
      model: `shapesinc/${SHAPE_USERNAME}`,
      messages: [
        { role: 'user', content: prompt }
      ]
    };

    console.log('📦 Payload sent to Shapes:', JSON.stringify(payload, null, 2));
    console.log('🔑 Using token:', TOKENS[tokenIndex]);

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

    console.log('✅ Response received from Shapes:', JSON.stringify(response.data, null, 2));

    const reply = response.data.choices?.[0]?.message?.content || 'No response.';
    res.json({ response: reply });

  } catch (err) {
    console.error('❌ Error with Shapes API:', {
      message: err.message,
      response: err.response?.data || 'No response data',
      status: err.response?.status || 'No status'
    });

    res.status(500).json({
      error: 'Error communicating with Shapes',
      details: err.response?.data || err.message
    });
  }
});

// Essential for Render to detect the open port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Relay active on port ${PORT}`);
});
