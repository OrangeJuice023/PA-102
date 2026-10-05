import { QuartzComponent, QuartzComponentConstructor } from "../types"
// @ts-ignore
import script from "./scripts/reading-prefs.inline"
import style from "./styles/toolbar.scss"

// Theme (light / sepia / dark), text size (A- / A+) and focus mode.
// Lives in the page header so it stays reachable when focus mode hides the sidebars.
const ReadingToolbar: QuartzComponent = () => (
  <div class="reading-toolbar" role="toolbar" aria-label="Reading settings">
    <div class="toolbar-group theme-picker" role="group" aria-label="Color theme">
      <button type="button" data-theme-choice="light" aria-pressed="false">
        Light
      </button>
      <button type="button" data-theme-choice="sepia" aria-pressed="false">
        Sepia
      </button>
      <button type="button" data-theme-choice="dark" aria-pressed="false">
        Dark
      </button>
    </div>
    <div class="toolbar-group text-size" role="group" aria-label="Text size">
      <button type="button" data-size-step="-1" aria-label="Smaller text">
        A−
      </button>
      <span class="text-size-value" aria-live="polite">
        18px
      </span>
      <button type="button" data-size-step="1" aria-label="Larger text">
        A+
      </button>
    </div>
    <button type="button" class="focus-toggle" aria-pressed="false">
      Focus
    </button>
  </div>
)

ReadingToolbar.beforeDOMLoaded = script
ReadingToolbar.css = style

export default (() => ReadingToolbar) satisfies QuartzComponentConstructor
