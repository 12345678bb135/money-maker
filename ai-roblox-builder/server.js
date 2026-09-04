require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      error: "Please describe your Roblox game."
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing."
    });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          temperature: 0.2,
          max_completion_tokens: 10000,
          messages: [
            {
              role: "system",
              content: `
You are an expert Roblox Studio Luau developer.

The user wants you to design and build Roblox games.

When they ask for an entire game, break it into multiple systems.

Possible systems include:
- Teams
- Leaderstats
- Money
- Jobs
- Vehicles
- Police systems
- Sheriff systems
- Civilian systems
- Tools
- UI
- Shops
- Data saving
- RemoteEvents
- RemoteFunctions
- Admin systems
- Spawn systems

For each system provide:

1. System name
2. What it does
3. Exact Roblox Studio location
4. Script type
5. Complete Luau code
6. Setup instructions

Use secure server-side code whenever possible.

Never put secrets or API keys into Roblox scripts.

Make the code readable and modular.

If the user asks for an entire game, do NOT put everything into one enormous script. Separate the systems into appropriate scripts.
`
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: data.error?.message || "Groq API request failed."
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({
        error: "The AI returned an empty response."
      });
    }

    res.json({
      message: "Game generated!",
      result: answer
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong while generating the game."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Roblox Builder running on port ${PORT}`);
});
