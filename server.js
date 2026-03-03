const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const HF_TOKEN = process.env.REPLICATE_API_TOKEN; 

app.get("/", (req, res) => {
    res.send("AI Myanmar API - Router URL Updated!");
});

app.post("/text-to-image", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt လိုအပ်ပါသည်" });

        console.log("Generating for:", prompt);

        // URL ကို router.huggingface.co သို့ ပြောင်းလဲထားသည်
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1"
            { inputs: prompt },
            {
                headers: {
                    "Authorization": "Bearer " + HF_TOKEN,

                    "Content-Type": "application/json",
                },
                responseType: 'arraybuffer'
            }
        );

        res.set("Content-Type", "image/png");
        res.send(response.data);

    } catch (error) {
        const errorMsg = error.response ? error.response.data.toString() : error.message;
        console.error("HF Error:", errorMsg);
        res.status(500).json({ error: "AI Error", details: errorMsg });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
