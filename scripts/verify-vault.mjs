// Checks that vault/Topics/ still says exactly what content/reviewer.md says.
// Strips the markup the build adds (wikilinks, callout markers, heading
// levels), then compares the word sequence of each note with its source
// section. OCT 3 must match byte for byte. Run: node scripts/verify-vault.mjs
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { OCT3_FORMAT } from "./oct3-format.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const src = fs.readFileSync(path.join(root, "content", "reviewer.md"), "utf8").replace(/\r\n/g, "\n")
const dir = path.join(root, "vault", "Topics")
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()

const lines = src.split("\n")
const starts = lines.flatMap((l, i) => (l.startsWith("## ") ? [i] : []))
const sections = starts.map((s, i) => lines.slice(s, starts[i + 1] ?? lines.length).join("\n").trim())

const words = (md) =>
  md
    .replace(/\[\[[^\]|]+?(?:\\?\|([^\]]+))?\]\]/g, (m, alias) => alias ?? m.slice(2, -2))
    .replace(/^> \[![\w-]+\][+-]? ?/gm, "")
    .split(/\s+/)
    .map((w) => w.replace(/^[#>*|`\\\-]+|[*|:\\]+$/g, "").replace(/\*\*/g, "").toLowerCase())
    .filter(Boolean)

function diff(a, b) {
  // Longest-common-subsequence diff over word arrays; returns removed/added runs.
  const n = a.length, m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const out = []
  let i = 0, j = 0
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { i++; j++; continue }
    if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) out.push(`+ ${b[j++]}`)
    else out.push(`- ${a[i++]}`)
  }
  return out
}

let problems = 0
files.forEach((f, i) => {
  const note = fs.readFileSync(path.join(dir, f), "utf8").replace(/^---\n[\s\S]*?\n---\n/, "").trim()
  if (f.startsWith("15 ")) {
    let body = note.replace(/^# .*\n+/, "")
    for (const [from, to] of OCT3_FORMAT) body = body.replace(to, from)
    const expected = sections[i].replace(/^## .*\n+/, "")
    const ok = body === expected
    console.log(`${ok ? "OK  " : "FAIL"} ${f} (byte-for-byte)`)
    if (!ok) problems++
    return
  }
  let d = diff(words(sections[i]), words(note))
  if (f.startsWith("16 ")) {
    // Answers move under their questions; compare as word multisets instead.
    const count = (ws) => ws.reduce((m, w) => m.set(w, (m.get(w) ?? 0) + 1), new Map())
    const a = count(words(sections[i])), b = count(words(note))
    d = []
    for (const w of new Set([...a.keys(), ...b.keys()])) {
      const delta = (b.get(w) ?? 0) - (a.get(w) ?? 0)
      if (delta) d.push(`${delta > 0 ? "+" : "-"} ${w} x${Math.abs(delta)}`)
    }
  }
  console.log(`${d.length ? "DIFF" : "OK  "} ${f}${d.length ? ": " + d.join(", ") : ""}`)
})
process.exitCode = problems ? 1 : 0
