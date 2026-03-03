const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );
        const buffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Netlify Server is Live!');
});

module.exports.handler = serverless(app);
