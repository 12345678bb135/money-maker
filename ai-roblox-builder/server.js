const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the website
app.use(express.static("public"));

// AI generation endpoint
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Please describe your Roblox game."
    });
  }

  res.json({
    message: "Game request received!",
    prompt: prompt
  });
});

app.listen(PORT, () => {
  console.log(`AI Roblox Builder running on port ${PORT}`);
});