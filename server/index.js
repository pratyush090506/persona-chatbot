require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const anshumanPrompt = require("./prompts/anshuman");
const abhimanyuPrompt = require("./prompts/abhimanyu");
const kshitijPrompt = require("./prompts/kshitij");

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPTS = {
  anshuman: anshumanPrompt,
  abhimanyu: abhimanyuPrompt,
  kshitij: kshitijPrompt,
};

const VALID_PERSONAS = new Set(Object.keys(SYSTEM_PROMPTS));

app.post("/api/chat", async (req, res) => {
  const { personaId, messages } = req.body;

  if (!VALID_PERSONAS.has(personaId)) {
    return res.status(400).json({ error: "Invalid persona selected." });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const validRoles = new Set(["user", "assistant"]);
  const malformed = messages.some(
    (m) => !validRoles.has(m.role) || typeof m.content !== "string"
  );
  if (malformed) {
    return res.status(400).json({ error: "Malformed messages array." });
  }

  if (messages[0].role !== "user") {
    return res.status(400).json({ error: "Conversation must start with a user message." });
  }

  // SSE headers — must be set before any write
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[personaId] },
        ...messages,
      ],
    });

    // Stop writing if client disconnects mid-stream
    let clientGone = false;
    req.on("close", () => { clientGone = true; });

    for await (const chunk of stream) {
      if (clientGone) break;
      const text = chunk.choices[0]?.delta?.content ?? "";
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Groq API error:", err.message);

    const msg = err.message?.toLowerCase() ?? "";
    let errorText = "Something went wrong. Please try again.";

    if (err.status === 401 || msg.includes("api key") || msg.includes("auth")) {
      errorText = "API key is invalid or missing.";
    } else if (err.status === 429 || msg.includes("rate") || msg.includes("quota")) {
      errorText = "Rate limit hit. Please wait a moment and try again.";
    } else if (err.status === 503 || err.status === 529) {
      errorText = "The AI service is temporarily overloaded. Try again in a few seconds.";
    }

    res.write(`data: ${JSON.stringify({ error: errorText })}\n\n`);
    res.end();
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accepting requests from: ${ALLOWED_ORIGIN}`);
});
