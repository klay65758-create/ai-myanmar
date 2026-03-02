
const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Home
app.get("/", (req, res) => {
  res.send("AI Myanmar API Running");
});

// 1️⃣ Text to Image
app.post("/text-to-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "db21e45d9d5b8b1f1c6d4c2c7f1f6a6d7a6c1c7e1f2d3b4c5a6b7c8d9e0f1a2b", 
        input: { prompt: prompt }
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2️⃣ Image to Video (Example model)
app.post("/image-to-video", async (req, res) => {
  try {
    const { image_url, prompt } = req.body;

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "image-to-video-model-version-id",
        input: {
          image: image_url,
          prompt: prompt
        }
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
