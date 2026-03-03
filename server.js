const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Render ရဲ့ Environment Variables ထဲမှာ ဒီနာမည်နဲ့ Token ထည့်ထားရပါမယ်
const HF_TOKEN = process.env.REPLICATE_API_TOKEN; 

app.get("/", (req, res) => {
    res.send("AI Myanmar API Running on Hugging Face");
});

app.post("/text-to-image", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        console.log("Generating image for:", prompt);

        // Hugging Face Inference API ကို အသုံးပြုခြင်း
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            { inputs: prompt },
            {
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                responseType: 'arraybuffer' // ပုံကို Data အဖြစ်လက်ခံရန်
            }
        );

        // ရလာတဲ့ ပုံကို Browser သို့မဟုတ် Tester မှာ တိုက်ရိုက်ပြရန်
        res.set("Content-Type", "image/png");
        res.send(response.data);

    } catch (error) {
        console.error("Error details:", error.response ? error.response.data.toString() : error.message);
        res.status(500).json({ 
            error: "AI Generation Failed", 
            details: "Check if your Token is valid and has 'Read' access." 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
