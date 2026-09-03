const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Roblox Builder is running!");
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Please describe the Roblox game you want to build."
    });
  }

  // AI generation will be connected here next.
  res.json({
    message: "Your Roblox game request was received!",
    prompt: prompt
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Roblox Builder running on port ${PORT}`);
});
