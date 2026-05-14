const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const PORT = 3456;
const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://host.docker.internal:11434";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Proxy endpoint to Ollama
app.post("/api/check", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.json({ corrected: "", corrections: [] });
  }

  const prompt = `You are a spelling and grammar checker. Your ONLY job is to fix spelling and grammar errors in the text below.

Rules:
- Fix all spelling mistakes
- Fix grammar errors
- Keep the original meaning and style
- Do NOT add explanations
- Do NOT change correct words
- Output ONLY the corrected text, nothing else

Text to check:
${text}

Corrected text:`;

  try {
    const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          num_predict: 1024,
        },
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      console.error("Backend error:", errText);
      return res.status(502).json({ error: "Spell-check engine request failed" });
    }

    const data = await ollamaRes.json();
    let corrected = data.response.trim();

    // Clean up common LLM artifacts
    corrected = corrected.replace(/^(Here'?s?( is)?( the)? corrected text:?\s*)/i, "");
    corrected = corrected.replace(/^(Corrected text:?\s*)/i, "");
    corrected = corrected.replace(/^["'`]+|["'`]+$/g, "");
    corrected = corrected.trim();

    // Find differences
    const corrections = findDifferences(text, corrected);

    res.json({ corrected, corrections });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to connect to spell-check engine." });
  }
});

// LCS-based word diff for accurate correction detection
function findDifferences(original, corrected) {
  const origTokens = original.split(/\s+/).filter(Boolean);
  const corrTokens = corrected.split(/\s+/).filter(Boolean);
  const corrections = [];

  // Build LCS table
  const m = origTokens.length, n = corrTokens.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normalize(origTokens[i - 1]) === normalize(corrTokens[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find aligned pairs
  const aligned = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (normalize(origTokens[i - 1]) === normalize(corrTokens[j - 1])) {
      aligned.unshift({ oi: i - 1, ci: j - 1, match: true });
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      aligned.unshift({ oi: i - 1, ci: -1, match: false });
      i--;
    } else {
      aligned.unshift({ oi: -1, ci: j - 1, match: false });
      j--;
    }
  }
  while (i > 0) { aligned.unshift({ oi: --i, ci: -1, match: false }); }
  while (j > 0) { aligned.unshift({ oi: -1, ci: --j, match: false }); }

  // Extract corrections: matched words that differ, or replaced words
  // Group consecutive non-matching pairs as single corrections
  let idx = 0;
  while (idx < aligned.length) {
    const a = aligned[idx];
    if (a.match) {
      // Words matched by LCS but might differ in casing/punctuation
      if (a.oi >= 0 && a.ci >= 0 && origTokens[a.oi] !== corrTokens[a.ci]) {
        corrections.push({
          original: origTokens[a.oi],
          corrected: corrTokens[a.ci],
          origIndex: a.oi,
          corrIndex: a.ci,
        });
      }
      idx++;
    } else {
      // Collect consecutive non-match chunk
      const origChunk = [], corrChunk = [];
      while (idx < aligned.length && !aligned[idx].match) {
        if (aligned[idx].oi >= 0) origChunk.push(origTokens[aligned[idx].oi]);
        if (aligned[idx].ci >= 0) corrChunk.push(corrTokens[aligned[idx].ci]);
        idx++;
      }
      if (origChunk.length > 0 || corrChunk.length > 0) {
        corrections.push({
          original: origChunk.join(" ") || "(added)",
          corrected: corrChunk.join(" ") || "(removed)",
          origIndex: -1,
          corrIndex: -1,
        });
      }
    }
  }

  return corrections;
}

function normalize(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

app.listen(PORT, () => {
  console.log(`Spell Checker running at http://localhost:${PORT}`);
});
