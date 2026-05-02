# SpellAI — Realtime AI Spell &amp; Grammar Checker

A clean, fast, **realtime spell &amp; grammar checker** that runs entirely on your machine. SpellAI proxies your text through a local **Gemma 3 1B** model served by [Ollama](https://ollama.com), so nothing ever leaves your device.

It catches the kinds of errors a dictionary-only checker can't — `too` vs `to`, `grate` vs `great`, `mourning` vs `morning` — because the model understands the surrounding context.

---

## Features

- **Realtime checking** — debounced as you type, or instant with `Ctrl + Enter`
- **Context-aware corrections** powered by a local LLM (Gemma 3 1B)
- **Side-by-side view** — original input next to corrected output
- **Inline highlighted diffs** — hover any correction to see the original word
- **Changes panel** — flat list of every `original → corrected` swap
- **Word / character / sentence / reading-time stats**
- **Keyboard shortcuts** — check, apply, copy, clear, theme-toggle (see in-app help)
- **Dark / light theme** with system-preference detection and persistence
- **Draft auto-save** to `localStorage`
- **Fully local** — text never leaves your machine
- **Mobile-ready** responsive layout, accessible focus states, reduced-motion support

---

## Stack

- **Backend:** Node.js + Express (single-file server, no build step)
- **LLM runtime:** [Ollama](https://ollama.com) running `gemma3:1b`
- **Frontend:** Vanilla HTML / CSS / JS — zero dependencies
- **Diff:** LCS-based word alignment for accurate correction detection

---

## Prerequisites

- **Node.js** ≥ 18
- **Ollama** installed and running locally — [install instructions](https://ollama.com/download)
- The **Gemma 3 1B** model pulled:
  ```bash
  ollama pull gemma3:1b
  ```

---

## Run Locally

```bash
git clone https://github.com/AleenaTahir1/Spell-corrector.git
cd Spell-corrector
npm install
npm start
```

Then open **<http://localhost:3456>** in your browser.

By default the server expects Ollama on `http://host.docker.internal:11434`. If you're running outside Docker, point it at your local Ollama:

```bash
OLLAMA_HOST=http://localhost:11434 npm start
```

---

## Run with Docker

```bash
docker build -t spellai .
docker run --rm -p 3456:3456 spellai
```

The container talks to Ollama on the host via `host.docker.internal:11434` (works on Docker Desktop / Mac / Windows out of the box).

---

## Keyboard Shortcuts

| Action               | Shortcut                              |
| -------------------- | ------------------------------------- |
| Check now            | `Ctrl` + `Enter`                      |
| Apply corrections    | `Ctrl` + `Shift` + `Enter`            |
| Copy corrected text  | `Ctrl` + `Shift` + `C`                |
| Clear input          | `Ctrl` + `Shift` + `K`                |
| Toggle theme         | `Ctrl` + `D`                          |
| Close dialog         | `Esc`                                 |

---

## How It Works

1. Frontend debounces input (~700 ms) and `POST`s to `/api/check`.
2. The Express server wraps your text in a strict prompt and forwards it to Ollama's `/api/generate` endpoint with low temperature for deterministic output.
3. The model returns the corrected text. Common LLM artifacts (preambles, surrounding quotes) are stripped.
4. An **LCS-based word diff** aligns original and corrected tokens to extract precise `original → corrected` pairs.
5. The frontend renders the corrected text with inline highlights and a flat list of changes.

---

## API

### `POST /api/check`

```json
{ "text": "Yestarday I went too the libary." }
```

**Response:**

```json
{
  "corrected": "Yesterday I went to the library.",
  "corrections": [
    { "original": "Yestarday", "corrected": "Yesterday", "origIndex": 0, "corrIndex": 0 },
    { "original": "too",       "corrected": "to",        "origIndex": 3, "corrIndex": 3 },
    { "original": "libary.",   "corrected": "library.",  "origIndex": 5, "corrIndex": 5 }
  ]
}
```

---

## Project Structure

```text
Spell-corrector/
├── server.js          # Express server + Ollama proxy + LCS diff
├── public/
│   └── index.html     # Single-file frontend (HTML + CSS + JS)
├── Dockerfile
├── package.json
└── README.md
```

---

## Configuration

| Env var       | Default                                | Description                  |
| ------------- | -------------------------------------- | ---------------------------- |
| `OLLAMA_HOST` | `http://host.docker.internal:11434`    | Where to reach your Ollama   |
| `PORT`        | `3456` (hard-coded in `server.js`)     | Port the Express app listens |

---

## License

MIT — free to use, modify, and distribute.
