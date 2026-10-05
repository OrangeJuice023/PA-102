// Dev helper: screenshot a page in headless Edge with a preset reading theme.
// Usage: node scripts/dev/shot.mjs <url> <out.png> [width] [height] [theme] [js-before-shot]
// theme: light | sepia | dark (stored the same way the site stores it).
import { spawn } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const [url, out, width = "1440", height = "1000", theme = "light", before = ""] = process.argv.slice(2)
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
const port = 9333 + Math.floor(Math.random() * 500)
const profile = path.join(os.tmpdir(), `pa102-edge-${port}`)
const proc = spawn(
  edge,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`, `--window-size=${width},${height}`, "about:blank"],
  { stdio: "ignore" },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let target
for (let i = 0; i < 50 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page")
  } catch {}
  if (!target) await sleep(200)
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener("open", r))
let id = 0
const pending = new Map()
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data)
  pending.get(m.id)?.(m)
  pending.delete(m.id)
})
const send = (method, params = {}) =>
  new Promise((r) => {
    const n = ++id
    pending.set(n, r)
    ws.send(JSON.stringify({ id: n, method, params }))
  })

const w = Number(width)
await send("Emulation.setDeviceMetricsOverride", {
  width: w, height: Number(height), deviceScaleFactor: 1, mobile: w < 700,
})
if (process.env.MEDIA) await send("Emulation.setEmulatedMedia", { media: process.env.MEDIA })
await send("Page.enable")
await send("Page.navigate", { url })
await sleep(1500)
await send("Runtime.evaluate", { expression: `localStorage.setItem("pa102-theme", "${theme}")` })
await send("Page.reload")
await sleep(2500)
if (before) {
  const r = await send("Runtime.evaluate", { expression: before, awaitPromise: true, returnByValue: true })
  if (r.result?.result?.value !== undefined) console.log(JSON.stringify(r.result.result.value))
  await sleep(600)
}
const shot = await send("Page.captureScreenshot", { format: "png" })
fs.writeFileSync(out, Buffer.from(shot.result.data, "base64"))
console.log(`saved ${out}`)
ws.close()
proc.kill()
