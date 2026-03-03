const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const HF_TOKEN = process.env.REPLICATE_API_TOKEN; 

app.get("/", (req, res) => {
    res.send("AI Server is running!");
});

app.post("/text-to-image", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("Generating for:", prompt);
        
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            { inputs: prompt },
            {
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                responseType: 'arraybuffer'
            }
        );
        res.set("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        console.error("HF Error:", error.message);
        res.status(500).json({ error: "AI Error", details: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
