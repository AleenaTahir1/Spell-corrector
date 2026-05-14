# NLP Spell Corrector

A basic but effective spell corrector built in Python using Norvig's Edit Distance algorithm with a Google-style web UI.

---

## How It Works

Uses **Norvig's noisy channel model**:
1. Regex cleans and tokenizes the input
2. Generates all words within edit distance 1 and 2 from the misspelled word
3. Picks the candidate that appears most frequently in the corpus
4. Flask serves the UI and exposes a REST API

---

## Project Structure

```
spell_corrector/
│
├── spell_corrector.py   # Core NLP logic (edit distance + corpus)
├── app.py               # Flask web server + API routes
├── requirements.txt     # Dependencies
├── static/
│   └── index.html       # Google-style frontend UI
└── README.md
```

---

## Setup & Run

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the app
python app.py

# 3. Open browser
http://localhost:5000
```

---

## API Usage

**POST /api/correct**
```json
Request:  { "text": "I luv speling" }
Response: {
  "corrected": "I love spelling",
  "corrections": [
    { "original": "luv",     "suggestion": "love" },
    { "original": "speling", "suggestion": "spelling" }
  ]
}
```

**POST /api/suggest**
```json
Request:  { "word": "speling" }
Response: { "suggestions": ["spelling", "spilling"] }
```

---

## Key Concepts

| Concept | Detail |
|---|---|
| Edit Distance | Levenshtein — insert, delete, substitute, transpose |
| Regex Usage | Input cleaning, tokenization, word validation |
| Corpus | Frequency dict built from a text corpus |
| Ranking | P(word) = word_count / total_words |
| UI | Google-style, single page, no frameworks |

---

## Limitations

- Corpus is small (built-in) — accuracy improves with a bigger text file
- No context awareness — corrects word by word, not by sentence meaning
- English only

---

**Author:** Eman Asghar Kiani | F23607010 | National University of Technology | Semester 6
