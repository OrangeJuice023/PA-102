# PA 102 Reviewer: agent guide

Study site for the PA 102 midterm. Read `NOTES.md` first: it is the running
diary of decisions, open questions, and what the owner changed by hand.

## Source of truth

- `content/reviewer.md` is the ONLY source. Never rewrite, summarize, or add facts.
- "OCT 3 - RAW NOTES" stays word for word (checked byte for byte).
- Keep every table, "Check:" note, and `[NEEDS VERIFICATION]` tag.
- `PA 102 Midterm Reviewer.md` in the repo root is the original export, kept
  untouched and not committed. Edit `content/reviewer.md` instead.

## Reference files (cross-checking only)

`content/reviewer.md` was written from these. They are NOT site content: never
copy text from them into the vault. Use them only to answer "is the reviewer
faithful to the source?" and log any finding in `NOTES.md` for the owner.
Local copies go in `references/` (gitignored: personal and classmate notes).

| File | What it is | Covers |
| --- | --- | --- |
| `03Oct2026-LTD-Async-Summary-102 (1).pdf` | Sir's Oct 3 asynchronous study guide | Presidency and Executive Bureaucracy (= OCT 3 - RAW NOTES) |
| `PA 102 2-3.7 notes so far - for my eyes only (2).pdf` | Owner's own lecture notes | Topics 2 to 3.7 |
| `4,1 hyper pangulo storyline.pdf` | Owner's 4.1 notes | Topic 4.1 |
| `Copy of PA102 NOTES - Galindez.pdf` | Classmate's lecture notes | Foundational, 2 to 2.5, 3.3 to 3.7, 4.1 (main cross-check for 3.3 to 4.1) |
| `LTD-Midterms-Message.docx` | Sir's midterms message | Exam format and coverage only |

Priority when they disagree (from reviewer.md): Sir's own materials win.

## Layout

- `vault/`: Obsidian vault, also the Quartz content folder. GENERATED from
  `content/reviewer.md` except `vault/.obsidian/`.
  - `vault/Topics/`: one note per `##` heading, numbered `00`–`16`.
  - `vault/Concepts/`: one note per concept (data in `scripts/concepts.mjs`).
- `scripts/build-vault.mjs`: splits the source, converts callouts, links the
  first mention of each concept. Concept definitions must be verbatim.
- `scripts/verify-vault.mjs`: word-level check of every note against the source.

## After changing reviewer.md or concepts.mjs

```
node scripts/build-vault.mjs
node scripts/verify-vault.mjs
```

Expected verify output: OCT 3 byte-for-byte OK (after undoing the formatting in
`scripts/oct3-format.mjs`), everything else OK except 3.3 (its two NEEDS VERIFICATION
tags merge into one banner) and Practice Questions (answers move under their
questions as "Show answer" callouts, so the "Answer key" heading and answer
numbers are gone). Anything else is a regression.

Do not hand-edit files in `vault/Topics` or `vault/Concepts`; they are
overwritten on every build. Log any decision in `NOTES.md`.

## Callout types (Obsidian snippet + Quartz CSS share these names)

`check` (amber, "Check:" notes), `verify` (yellow NEEDS VERIFICATION banner),
`plain` (tinted "In plain words" card), `answer` (folded, practice answers).
