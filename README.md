# SpellAI - Realtime AI Spell Checker

A context-aware spelling and grammar checker powered by **Gemma 3 1B** running locally via **Ollama**. Unlike traditional spellcheckers, SpellAI uses an LLM to understand context — catching errors like "too" vs "to", "grate" vs "great", and "mourning" vs "morning" that dictionary-based tools miss.

## Features

- **Realtime checking** — auto-checks 800ms after you stop typing, or press `Ctrl+Enter`
- **Context-aware corrections** — uses LLM understanding, not just dictionary lookup
- **Side-by-side view** — input on the left, corrected output on the right
- **Highlighted diffs** — green highlights on corrected words, hover to see the original
- **Changes list** — all corrections listed with original → fixed
- **Word / character / sentence counts**
- **Copy** corrected text or **Apply** to replace input
- **Paste** from clipboard
- **Dark / Light theme** toggle
- **Ollama status indicator**

## Prerequisites

- [Ollama](https://ollama.com) installed and running
- Gemma 3 1B model pulled:
  ```bash
  ollama pull gemma3:1b
  ```

## Run with Docker (one command)

Make sure Ollama is running on your host machine, then:

```bash
docker build -t spellai . && docker run --rm -p 3456:3456 --add-host=host.docker.internal:host-gateway spellai
```

Open **http://localhost:3456** in your browser.

### Linux note

On Linux, `host.docker.internal` may not resolve by default. The `--add-host=host.docker.internal:host-gateway` flag handles this. If you still have issues, pass the host IP directly:

```bash
docker run --rm -p 3456:3456 -e OLLAMA_HOST=http://172.17.0.1:11434 spellai
```

### Custom Ollama host

If Ollama runs on a different machine or port:

```bash
docker run --rm -p 3456:3456 -e OLLAMA_HOST=http://your-ollama-host:11434 spellai
```

## Run without Docker

```bash
npm install
node server.js
```

Open **http://localhost:3456**.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_HOST` | `http://host.docker.internal:11434` | Ollama API endpoint |

## How it works

1. You type text in the input panel
2. After 800ms of inactivity, the text is sent to Gemma 3 1B via Ollama
3. The LLM returns corrected text, preserving your original meaning and style
4. An LCS-based word diff algorithm identifies exactly what changed
5. Corrections are highlighted in the output and listed in the changes panel

## Example

Try pasting this text full of context-dependent errors:

```
Yestarday I went too the libary to studdy for my exams. The libarian was very helpfull
and she recomended a grate book about artifical inteligence. I was exited about the
oportunity to lern more about this fasinating feild of sciense.
```

Context-aware catches that a regular spellchecker would miss:

| Input | Corrected | Why |
|---|---|---|
| too | to | "too" is valid, but context says "went **to** the library" |
| grate | great | "grate" is a word, but "a **great** book" fits |
| exited | excited | "exited" means left, but "**excited** about the opportunity" |

## Tech Stack

- **Backend**: Node.js + Express (proxy to Ollama)
- **Frontend**: Vanilla HTML/CSS/JS (no build step)
- **AI**: Gemma 3 1B via Ollama
- **Diff**: LCS-based word alignment algorithm
