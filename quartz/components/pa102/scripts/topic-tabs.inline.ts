// Clicking a group tab shows its sub-tabs (one row open at a time).
document.addEventListener("nav", () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".topic-tabs [data-group-target]")

  const open = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const target = button.dataset.groupTarget
    for (const other of buttons) {
      other.setAttribute("aria-expanded", String(other === button))
    }
    for (const row of document.querySelectorAll<HTMLElement>(".topic-tabs .sub-tabs")) {
      row.hidden = row.id !== target
    }
  }

  for (const button of buttons) {
    button.addEventListener("click", open)
    window.addCleanup(() => button.removeEventListener("click", open))
  }

  // Keep the current tab visible in its sideways-scrolling row on narrow
  // screens, without scrolling the page itself.
  for (const current of document.querySelectorAll<HTMLElement>(
    ".topic-tabs .active, .topic-tabs [aria-current='page']",
  )) {
    const row = current.closest<HTMLElement>(".group-row, .sub-tabs")
    if (row && row.scrollWidth > row.clientWidth) {
      // Rows are position: relative, so offsetLeft is measured from the row.
      row.scrollLeft = current.offsetLeft - 16
    }
  }
})
