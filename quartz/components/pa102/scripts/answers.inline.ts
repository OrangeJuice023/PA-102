// Practice answers are folded callouts (`> [!answer]- Show answer`). Quartz
// toggles them by flipping `is-collapsed` on click. This script:
//  - makes each answer title a keyboard-usable button,
//  - relabels it "Show answer" / "Hide answer" to match its state,
//  - drives the "Show all / Hide all answers" button.

const answers = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.callout[data-callout="answer"].is-collapsible'))

function setOpen(callout: HTMLElement, open: boolean) {
  callout.classList.toggle("is-collapsed", !open)
  const content = callout.querySelector<HTMLElement>(":scope > .callout-content")
  if (content) content.style.gridTemplateRows = open ? "1fr" : "0fr"
}

function syncLabels() {
  const all = answers()
  for (const callout of all) {
    const open = !callout.classList.contains("is-collapsed")
    const title = callout.querySelector<HTMLElement>(":scope > .callout-title")
    const label =
      title?.querySelector<HTMLElement>(".callout-title-inner > p") ??
      title?.querySelector<HTMLElement>(".callout-title-inner")
    title?.setAttribute("aria-expanded", String(open))
    if (label) label.textContent = open ? "Hide answer" : "Show answer"
  }

  const allOpen = all.length > 0 && all.every((c) => !c.classList.contains("is-collapsed"))
  for (const button of document.querySelectorAll<HTMLButtonElement>(".answer-toggle-button")) {
    button.textContent = allOpen ? "Hide all answers" : "Show all answers"
    button.setAttribute("aria-pressed", String(allOpen))
  }
}

document.addEventListener("nav", () => {
  const all = answers()
  if (all.length === 0) return

  for (const callout of all) {
    const title = callout.querySelector<HTMLElement>(":scope > .callout-title")
    if (!title) continue
    title.setAttribute("role", "button")
    title.setAttribute("tabindex", "0")
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        title.click()
      }
    }
    title.addEventListener("keydown", onKey)
    window.addCleanup(() => title.removeEventListener("keydown", onKey))
  }

  // Quartz flips the class on click; relabel whenever any answer changes state.
  const observer = new MutationObserver(syncLabels)
  for (const callout of all) {
    observer.observe(callout, { attributes: true, attributeFilter: ["class"] })
  }
  window.addCleanup(() => observer.disconnect())

  const toggleAll = () => {
    const openAll = answers().some((c) => c.classList.contains("is-collapsed"))
    for (const callout of answers()) setOpen(callout, openAll)
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>(".answer-toggle-button")) {
    button.addEventListener("click", toggleAll)
    window.addCleanup(() => button.removeEventListener("click", toggleAll))
  }

  syncLabels()
})
