const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const HF_TOKEN = process.env.REPLICATE_API_TOKEN; 

app.get("/", (req, res) => {
    res.send("Server is Live and Ready!");
});

app.post("/text-to-image", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            { inputs: prompt },
            {
                headers: { 
                    "Authorization": "Bearer " + HF_TOKEN,
                    "Content-Type": "application/json"
                },
                responseType: 'arraybuffer'
            }
        );
        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server Running"));
