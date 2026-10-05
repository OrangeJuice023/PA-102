// Dev helper: open a page in headless Edge and evaluate JS in it (Chrome DevTools Protocol).
// Usage: node scripts/dev/inspect.mjs <url> <width> <height> "<js expression>"
import { spawn } from "node:child_process"
import os from "node:os"
import path from "node:path"

const [url, width = "1440", height = "1000", expr = "document.title"] = process.argv.slice(2)
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
const port = 9333 + Math.floor(Math.random() * 500)
const profile = path.join(os.tmpdir(), `pa102-edge-${port}`)
const proc = spawn(edge, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, `--window-size=${width},${height}`, "about:blank"], { stdio: "ignore" })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let target
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page") } catch {}
  if (!target) await sleep(200)
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener("open", r))
let id = 0
const pending = new Map()
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id) })
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })) })

await send("Page.enable")
await send("Page.navigate", { url })
await sleep(3000)
const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })
console.log(JSON.stringify(res.result?.result?.value ?? res.result, null, 2))
ws.close()
proc.kill()
