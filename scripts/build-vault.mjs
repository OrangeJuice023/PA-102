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
      if (m) return ["> [!check] Check", `> ${m[1]}`]
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
// folded callout ("Show answer"). Question and answer text is unchanged.
function practice(md) {
  const [intro, rest] = md.split(/^### Questions\n/m)
  const [qs, as] = rest.split(/^### Answer key\n/m)
  const items = (block) =>
    block
      .trim()
      .split(/\n(?=\d+\. )/)
      .map((s) => s.trim())
  const q = items(qs)
  const a = items(as)
  if (q.length !== a.length) throw new Error("Question/answer count mismatch")
  const out = q.map((question, i) => {
    const answer = a[i].replace(/^\d+\. /, "")
    return `${question}\n\n> [!answer]- Show answer\n> ${answer}`
  })
  return `${intro.trim()}\n\n### Questions\n\n${out.join("\n\n")}`
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
  const md = `${fm}\n# ${c.name}\n\n${c.definition}\n\n*Definition copied from [[${c.source}|${titles[c.source]}]].*\n\n## Where it appears\n\n${list}\n`
  fs.writeFileSync(path.join(vault, "Concepts", `${c.name}.md`), md)
}

fs.writeFileSync(path.join(vault, "index.md"), `${frontmatter({ title: "PA 102 Midterm Reviewer" })}\n${preamble.replace(/^# .*\n+/, "")}\n`)

// ---- report ---------------------------------------------------------------
const single = CONCEPTS.filter((c) => appearances.get(c.name).length < 2)
console.log(`Wrote ${TOPICS.length} topic notes and ${CONCEPTS.length} concept notes.`)
for (const c of CONCEPTS) console.log(`  ${c.name}: ${appearances.get(c.name).join(", ")}`)
if (single.length) console.log(`\nIn fewer than 2 topics: ${single.map((c) => c.name).join(", ")}`)
