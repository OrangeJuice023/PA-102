// Reading preferences: theme (light / sepia / dark), text size and focus mode.
// Runs before the DOM loads so the saved choices apply without a flash.
// Quartz's own components only know "light" and "dark" (saved-theme), so
// sepia maps to saved-theme="light" plus data-reading-theme="sepia".

type Mode = "light" | "sepia" | "dark"

const THEME_KEY = "pa102-theme"
const SIZE_KEY = "pa102-text-size"
const FOCUS_KEY = "pa102-focus"
const MIN_SIZE = 16
const MAX_SIZE = 22
const DEFAULT_SIZE = 18

const root = document.documentElement

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit.
  }
}

const systemMode = (): Mode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

function storedMode(): Mode | null {
  const value = read(THEME_KEY)
  return value === "light" || value === "sepia" || value === "dark" ? value : null
}

function applyMode(mode: Mode) {
  const quartzTheme = mode === "dark" ? "dark" : "light"
  const changed = root.getAttribute("saved-theme") !== quartzTheme
  root.setAttribute("data-reading-theme", mode)
  root.setAttribute("saved-theme", quartzTheme)
  if (changed) {
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: quartzTheme } }))
  }
}

const clampSize = (n: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(n)))
const currentSize = () =>
  clampSize(parseInt(root.style.getPropertyValue("--reading-size")) || DEFAULT_SIZE)
const applySize = (px: number) => root.style.setProperty("--reading-size", `${px}px`)

const focusOn = () => root.getAttribute("reader-mode") === "on"
const applyFocus = (on: boolean) => root.setAttribute("reader-mode", on ? "on" : "off")

applyMode(storedMode() ?? systemMode())
applySize(clampSize(Number(read(SIZE_KEY)) || DEFAULT_SIZE))
applyFocus(read(FOCUS_KEY) === "on")

function syncControls() {
  const mode = root.getAttribute("data-reading-theme")
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-choice]")) {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === mode))
  }

  const size = currentSize()
  for (const label of document.querySelectorAll(".text-size-value")) {
    label.textContent = `${size}px`
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-size-step]")) {
    button.disabled = Number(button.dataset.sizeStep) < 0 ? size <= MIN_SIZE : size >= MAX_SIZE
  }

  const focus = focusOn()
  for (const button of document.querySelectorAll<HTMLButtonElement>(".focus-toggle")) {
    button.setAttribute("aria-pressed", String(focus))
    button.textContent = focus ? "Exit focus" : "Focus"
  }
}

function setFocus(on: boolean) {
  applyFocus(on)
  write(FOCUS_KEY, on ? "on" : "off")
  syncControls()
}

document.addEventListener("nav", () => {
  const onTheme = (event: Event) => {
    const mode = (event.currentTarget as HTMLElement).dataset.themeChoice as Mode
    write(THEME_KEY, mode)
    applyMode(mode)
    syncControls()
  }

  const onSize = (event: Event) => {
    const step = Number((event.currentTarget as HTMLElement).dataset.sizeStep)
    const size = clampSize(currentSize() + step)
    applySize(size)
    write(SIZE_KEY, String(size))
    syncControls()
  }

  const onFocus = () => setFocus(!focusOn())
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && focusOn()) setFocus(false)
  }

  // Follow the system theme until the reader picks one.
  const onSystemTheme = () => {
    if (storedMode() === null) {
      applyMode(systemMode())
      syncControls()
    }
  }

  const listen = <E extends Event>(
    target: EventTarget,
    type: string,
    handler: (event: E) => void,
  ) => {
    target.addEventListener(type, handler as EventListener)
    window.addCleanup(() => target.removeEventListener(type, handler as EventListener))
  }

  for (const button of document.querySelectorAll("[data-theme-choice]")) {
    listen(button, "click", onTheme)
  }
  for (const button of document.querySelectorAll("[data-size-step]")) {
    listen(button, "click", onSize)
  }
  for (const button of document.querySelectorAll(".focus-toggle")) {
    listen(button, "click", onFocus)
  }
  document.addEventListener("keydown", onKey)
  window.addCleanup(() => document.removeEventListener("keydown", onKey))
  listen(window.matchMedia("(prefers-color-scheme: dark)"), "change", onSystemTheme)

  syncControls()
})
