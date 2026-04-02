
---

# SpellAI — Realtime Context-Aware Spell Checker

A **Python-powered spell checker** using **bigram language models, edit distance, and context-aware corrections**. SpellAI goes beyond traditional dictionary-based spellcheckers to understand context and suggest the **most likely correction** in a sentence.

It can catch errors like `"too"` vs `"to"`, `"grate"` vs `"great"`, or `"mourning"` vs `"morning"` that basic spellcheckers miss.

---

## Features

* **Realtime suggestions** — check text after typing or on demand (`Ctrl+Enter`)
* **Context-aware corrections** using **bigram probabilities**
* **Edit distance scoring** for typo corrections
* **Side-by-side view** — input vs corrected output
* **Highlighted diffs** — corrected words highlighted with original word on hover
* **Corrections list** — shows original → corrected mappings
* **Word / character / sentence counts**
* **Copy / Apply** corrected text
* **Dark / Light theme toggle**

---

## Prerequisites

* Python ≥ 3.10
* Required libraries:

```bash
pip install -r requirements.txt
```

**requirements.txt** includes:

* `numpy`
* `pandas`
* `nltk`
* `flask`
* `difflib`

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/spellai.git
cd spellai
pip install -r requirements.txt
python app.py
```

Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## How It Works

1. **Input text** is tokenized into words.
2. Candidate corrections are generated using **edit distance** (Levenshtein distance).
3. **Bigram language model** computes probabilities of each candidate in context.
4. The **best candidate** is selected based on **edit distance + bigram probability score**.
5. Changes are displayed **highlighted in the output** and listed in the corrections panel.

---

## Example

Input text:

```
Yestarday I went too the libary to studdy for my exams. The libarian was very helpfull
and she recomended a grate book about artifical inteligence. I was exited about the
oportunity to lern more about this fasinating feild of sciense.
```

SpellAI correction:

| Input      | Corrected   | Explanation                               |
| ---------- | ----------- | ----------------------------------------- |
| Yestarday  | Yesterday   | Correct typo using edit distance          |
| too        | to          | Bigram context: “went **to** the library” |
| libary     | library     | Edit distance + bigram probability        |
| studdy     | study       | Simple typo correction                    |
| libarian   | librarian   | Context-aware correction                  |
| grate      | great       | Context-aware using bigram probability    |
| exited     | excited     | Chooses word fitting sentence context     |
| fasinating | fascinating | Corrects spelling error                   |

---

## Algorithm

### **1. Bigram Language Model**

* Probability of a word given previous word:

[
P(w_i | w_{i-1}) = \frac{\text{count}(w_{i-1}, w_i) + 1}{\text{count}(w_{i-1}) + |V|}
]

* Laplace smoothing is applied for unseen bigrams.

### **2. Edit Distance**

* Levenshtein distance used to generate candidate corrections:

[
\text{EditDistance}(s_1, s_2) = \text{minimum number of insertions, deletions, substitutions}
]

* Candidates within 1–2 edits are considered.

### **3. Scoring**

* Each candidate is scored using a **combined metric**:

[
\text{Score} = \text{BigramProbability} \times \frac{1}{1 + \text{EditDistance}}
]

* Highest score candidate is chosen.

---

## Project Structure

```text
SpellAI/
├── app.py             # Flask backend + spell checker logic
├── templates/
│   └── index.html     # Frontend UI
├── static/
│   ├── styles.css     # UI styling
│   └── script.js      # Frontend JS
├── ngram_model.pkl    # Pre-trained bigram model
├── requirements.txt
└── README.md
```

---

## Tech Stack

* **Backend:** Python + Flask
* **Frontend:** HTML, CSS, JS (no build step)
* **AI/NLP:** Bigram language model, Edit Distance
* **Diff:** Python `difflib` for highlighting corrections

---

## License

MIT License — free to use, distribute, and modify.

---
