// Builds vault/ (Obsidian + Quartz) from content/reviewer.md.
// The source is never rewritten: notes are produced by splitting on "## ",
// promoting heading levels by one, converting callouts, and wrapping the
// first mention of each concept in a [[wikilink]] whose alias is the
// original text. Run: node scripts/build-vault.mjs
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CONCEPTS } from "./concepts.mjs"
import { OCT3_FORMAT } from "./oct3-format.mjs"
import { OWNER_DEFINITIONS } from "./owner-definitions.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const src = fs.readFileSync(path.join(root, "content", "reviewer.md"), "utf8").replace(/\r\n/g, "\n")
const vault = path.join(root, "vault")

// One entry per "##" heading, in source order.
const TOPICS = [
  { file: "00 How to Use", group: "Start", link: false },
  { file: "01 Foundational Concepts", group: "Start" },
  { file: "02 Topic 2", group: "Topic 2", topic: "2" },
  { file: "03 Topic 2.1-2.2", group: "Topic 2", topic: "2.1–2.2" },
  { file: "04 Topic 2.3", group: "Topic 2", topic: "2.3" },
  { file: "05 Topic 2.4", group: "Topic 2", topic: "2.4" },
  { file: "06 Topic 2.5", group: "Topic 2", topic: "2.5" },
  { file: "07 Topic 3.1", group: "Topic 3", topic: "3.1" },
  { file: "08 Topic 3.2", group: "Topic 3", topic: "3.2" },
  { file: "09 Topic 3.3", group: "Topic 3", topic: "3.3" },
  { file: "10 Topic 3.4", group: "Topic 3", topic: "3.4" },
  { file: "11 Topic 3.5", group: "Topic 3", topic: "3.5" },
  { file: "12 Topic 3.6", group: "Topic 3", topic: "3.6" },
  { file: "13 Topic 3.7", group: "Topic 3", topic: "3.7" },
  { file: "14 Topic 4.1", group: "Topic 4", topic: "4.1" },
  { file: "15 OCT 3 Raw Notes", group: "Oct 3", verbatim: true, tags: ["oct3"] },
  { file: "16 Practice Questions", group: "Practice", practice: true },
]

const NV = "\\[NEEDS VERIFICATION\\]"

// ---- split ------------------------------------------------------------
const lines = src.split("\n")
const starts = lines.flatMap((l, i) => (l.startsWith("## ") ? [i] : []))
if (starts.length !== TOPICS.length) {
  throw new Error(`Expected ${TOPICS.length} "##" sections, found ${starts.length}`)
}
const preamble = lines.slice(0, starts[0]).join("\n").trim()
const sections = starts.map((s, i) => ({
  heading: lines[s].slice(3).trim(),
  body: lines.slice(s + 1, starts[i + 1] ?? lines.length).join("\n").trim(),
}))

// ---- transforms ---------------------------------------------------------
const promoteHeadings = (md) => md.replace(/^(#{3,6}) /gm, (_, h) => h.slice(1) + " ")

function convertCallouts(md) {
  return md
    .split("\n")
    .flatMap((line) => {
      let m = line.match(/^> \*\*Check:\*\* (.*)$/)
      if (m) return ["> [!warning] Check", `> ${m[1]}`]
      m = line.match(/^\*\*In plain words:\*\* (.*)$/)
      if (m) return ["> [!plain] In plain words", `> ${m[1]}`]
      return [line]
    })
    .join("\n")
}

// Topics 3.3–4.1: the heading tag becomes a banner at the top of the note.
// In 3.3 the source paragraph that opens with the tag becomes the banner body.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function verificationBanner(md) {
  const para = new RegExp(`^\\*\\*${escapeRe(NV)} (.*)$`, "m")
  const m = md.match(para)
  if (m) {
    return md.replace(para, `> [!verify] ${NV}\n> **${m[1]}`)
  }
  return `> [!verify] ${NV}\n\n${md}`
}

// Practice questions: each answer moves directly under its question as a
// folded callout ("Show answer"). Supports multi-part practice sections
// (Written exam, Essay prompts, Jeopardy bank, Final Jeopardy) while
// remaining backwards-compatible with the original single-list format.
function practice(md) {
  const items = (block) =>
    block
      .trim()
      .split(/\n(?=\d+\. )/)
      .map((s) => s.trim())

  if (md.includes("### Written exam practice questions")) {
    const parts = md.split(/^### (?=Written exam practice questions|Essay and synthesis prompts|Jeopardy question bank|Final Jeopardy)/m)
    const intro = parts[0].trim()
    const outParts = []
    if (intro) outParts.push(intro)

    for (const part of parts.slice(1)) {
      if (part.startsWith("Written exam practice questions")) {
        const [wIntro, wRest] = part.split(/^#### Questions\n/m)
        const [qs, as] = wRest.split(/^#### Answer key\n/m)
        const q = items(qs)
        const a = items(as)
        if (q.length !== a.length) throw new Error(`Written Q/A mismatch: ${q.length} vs ${a.length}`)
        const pairs = q.map((question, i) => {
          const ans = a[i].replace(/^\d+\. /, "")
          return `${question}\n\n> [!answer]- Show answer\n> ${ans}`
        })
        const headerText = wIntro.replace(/^Written exam practice questions\n*/, "").trim()
        const headerBlock = headerText ? `\n\n${headerText}` : ""
        outParts.push(`### Written exam practice questions${headerBlock}\n\n#### Questions\n\n${pairs.join("\n\n")}`.trim())
      } else if (part.startsWith("Jeopardy question bank") || part.startsWith("Final Jeopardy")) {
        const transformed = part.replace(/^##### Answer\n([\s\S]*?)(?=(?:\n#### |\n### |$))/gm, (match, ansText) => {
          const cleaned = ansText.trim().split("\n").map((l) => `> ${l}`).join("\n")
          return `> [!answer]- Show answer\n${cleaned}\n`
        })
        outParts.push("### " + transformed.trim())
      } else {
        outParts.push("### " + part.trim())
      }
    }
    return outParts.join("\n\n")
  } else {
    const [intro, rest] = md.split(/^### Questions\n/m)
    const [qs, as] = rest.split(/^### Answer key\n/m)
    const q = items(qs)
    const a = items(as)
    if (q.length !== a.length) throw new Error("Question/answer count mismatch")
    const out = q.map((question, i) => {
      const answer = a[i].replace(/^\d+\. /, "")
      return `${question}\n\n> [!answer]- Show answer\n> ${answer}`
    })
    return `${intro.trim()}\n\n### Questions\n\n${out.join("\n\n")}`
  }
}

function oct3Format(md) {
  for (const [from, to] of OCT3_FORMAT) {
    if (md.split(from).length !== 2) throw new Error(`OCT 3: expected exactly one "${from}"`)
    md = md.replace(from, to)
  }
  return md
}

// Wrap the first mention of each concept (outside headings, callout titles
// and existing links). Returns the new markdown and the concepts linked.
function linkConcepts(md, noteFile) {
  const linked = []
  const out = md.split("\n")
  for (const c of CONCEPTS) {
    if (c.exclude?.includes(noteFile)) continue
    let done = false
    for (let i = 0; i < out.length && !done; i++) {
      const line = out[i]
      if (/^#/.test(line) || /^> \[!/.test(line)) continue
      const re = new RegExp(c.pattern.source, c.pattern.flags.replace("g", "") + "g")
      let m
      while ((m = re.exec(line))) {
        const before = line.slice(0, m.index)
        const opens = (before.match(/\[\[/g) || []).length
        const closes = (before.match(/\]\]/g) || []).length
        if (opens > closes) continue // inside an existing link
        const text = m[0]
        const sep = line.trimStart().startsWith("|") ? "\\|" : "|"
        const link = text === c.name ? `[[${c.name}]]` : `[[${c.name}${sep}${text}]]`
        out[i] = before + link + line.slice(m.index + text.length)
        linked.push(c.name)
        done = true
        break
      }
    }
  }
  return { md: out.join("\n"), linked }
}

const yamlStr = (s) => JSON.stringify(s)
function frontmatter(obj) {
  const rows = Object.entries(obj)
    .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => (Array.isArray(v) ? `${k}:\n${v.map((x) => `  - ${x}`).join("\n")}` : `${k}: ${typeof v === "string" ? yamlStr(v) : v}`))
  return `---\n${rows.join("\n")}\n---\n`
}

for (const name of Object.keys(OWNER_DEFINITIONS)) {
  if (!CONCEPTS.some((c) => c.name === name)) throw new Error(`Owner definition for unknown concept "${name}"`)
}

const sourceLabel = (owner) => (owner.source ? `Source: ${owner.source}` : "Source not given")

// The owner's fuller definition as a "Definition" card (callout), with its source.
function ownerCard(name) {
  const owner = OWNER_DEFINITIONS[name]
  const body = `${owner.text}\n\n*${sourceLabel(owner)}*`
  const quoted = body.split("\n").map((line) => (line ? `> ${line}` : ">"))
  return ["> [!plain] Definition", ...quoted].join("\n")
}

for (const c of CONCEPTS) {
  for (const row of c.definition.split("\n")) {
    if (!src.includes(row)) throw new Error(`Definition for "${c.name}" is not verbatim from reviewer.md: ${row}`)
  }
}

// ---- build ----------------------------------------------------------------
fs.rmSync(path.join(vault, "Topics"), { recursive: true, force: true })
fs.rmSync(path.join(vault, "Concepts"), { recursive: true, force: true })
fs.mkdirSync(path.join(vault, "Topics"), { recursive: true })
fs.mkdirSync(path.join(vault, "Concepts"), { recursive: true })

const appearances = new Map(CONCEPTS.map((c) => [c.name, []]))
const titles = {}

sections.forEach((sec, i) => {
  const t = TOPICS[i]
  const needsVerification = sec.heading.includes(NV)
  const title = sec.heading.replace(NV, "").trim()
  titles[t.file] = title
  const tags = [...(t.tags ?? []), ...(needsVerification ? ["needs-verification"] : [])]

  let body = sec.body
  if (t.verbatim) {
    for (const c of CONCEPTS) {
      if ((c.verbatimPattern ?? c.pattern).test(body)) appearances.get(c.name).push(t.file)
    }
    body = oct3Format(body)
  } else {
    if (t.practice) body = practice(body)
    body = promoteHeadings(body)
    body = convertCallouts(body)
    if (needsVerification) body = verificationBanner(body)
    if (t.link !== false) {
      const r = linkConcepts(body, t.file)
      body = r.md
      r.linked.forEach((name) => appearances.get(name).push(t.file))
    }
  }

  const fm = frontmatter({
    title,
    topic: t.topic,
    order: i,
    group: t.group,
    tags,
  })
  fs.writeFileSync(path.join(vault, "Topics", `${t.file}.md`), `${fm}\n# ${title}\n\n${body}\n`)
})

for (const c of CONCEPTS) {
  const where = appearances.get(c.name)
  const fm = frontmatter({ title: c.name, tags: ["concept"], topics: where.map((f) => yamlStr(`[[${f}]]`)) })
  const list = where.map((f) => `- [[${f}|${titles[f]}]]`).join("\n")
  const copied = `*Copied from [[${c.source}|${titles[c.source]}]].*`
  const definition = OWNER_DEFINITIONS[c.name]
    ? `${ownerCard(c.name)}\n\n**From the reviewer, word for word:**\n\n${c.definition}\n\n${copied}`
    : `${c.definition}\n\n${copied}`
  const md = `${fm}\n# ${c.name}\n\n${definition}\n\n## Where it appears\n\n${list}\n`
  fs.writeFileSync(path.join(vault, "Concepts", `${c.name}.md`), md)
}

// Home page: the reviewer's own title and byline, then links to every topic
// grouped like the site's tab bar (navigation only, no reviewer text added).
const groups = [...new Set(TOPICS.map((t) => t.group))]
const contents = groups
  .map((group) => {
    const links = TOPICS.filter((t) => t.group === group).map((t) => `- [[${t.file}|${titles[t.file]}]]`)
    return `**${group}**\n\n${links.join("\n")}`
  })
  .join("\n\n")
fs.writeFileSync(
  path.join(vault, "index.md"),
  `${frontmatter({ title: "PA 102 Midterm Reviewer" })}\n${preamble.replace(/^# .*\n+/, "")}\n\n## Contents\n\n${contents}\n`,
)

// Second Brain page: every concept (alphabetical) with its copied definition
// and the topics it connects. The interactive map is drawn by the website
// (quartz/components/pa102/SecondBrainGraph.tsx); in Obsidian use Graph view.
const shortName = (file) => {
  const t = TOPICS.find((x) => x.file === file)
  return t?.topic ? `Topic ${t.topic}` : file.replace(/^\d+ /, "")
}
const conceptBlocks = [...CONCEPTS]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => {
    const topics = appearances.get(c.name).map((f) => `[[${f}|${shortName(f)}]]`).join(" · ")
    // Prefer the owner's fuller definition here; the concept note keeps both.
    const owner = OWNER_DEFINITIONS[c.name]
    const definition = owner ? `${owner.text}\n\n*${sourceLabel(owner)}*` : c.definition
    return `### [[${c.name}]]\n\n${definition}\n\n**Connects:** ${topics}`
  })
  .join("\n\n")
fs.writeFileSync(
  path.join(vault, "Second Brain.md"),
  `${frontmatter({ title: "Second Brain" })}\n# Second Brain\n\n## Concepts\n\n${conceptBlocks}\n`,
)

// ---- report ---------------------------------------------------------------
const single = CONCEPTS.filter((c) => appearances.get(c.name).length < 2)
console.log(`Wrote ${TOPICS.length} topic notes and ${CONCEPTS.length} concept notes.`)
for (const c of CONCEPTS) console.log(`  ${c.name}: ${appearances.get(c.name).join(", ")}`)
if (single.length) console.log(`\nIn fewer than 2 topics: ${single.map((c) => c.name).join(", ")}`)
