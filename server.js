const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http"); // ဒါလေး အသစ်ထည့်ရပါမယ်
const app = express();
app.use(express.json());

const HF_TOKEN = process.env.REPLICATE_API_TOKEN; 

const router = express.Router();

router.get("/", (req, res) => res.send("Netlify Server is Live!"));

router.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            { inputs: prompt },
            {
                headers: { "Authorization": `Bearer ${HF_TOKEN}` },
                responseType: 'arraybuffer'
            }
        );
        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/.netlify/functions/server", router);
module.exports.handler = serverless(app);
