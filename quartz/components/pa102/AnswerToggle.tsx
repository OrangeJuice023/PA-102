import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
// @ts-ignore
import script from "./scripts/answers.inline"
import style from "./styles/answers.scss"

// "Show all / Hide all answers" for the Practice Questions note. The answers
// themselves are folded "answer" callouts written by scripts/build-vault.mjs.
const AnswerToggle: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if ((fileData.frontmatter as Record<string, unknown> | undefined)?.group !== "Practice") {
    return null
  }
  return (
    <div class="answer-toggle">
      <button type="button" class="answer-toggle-button" aria-pressed="false">
        Show all answers
      </button>
    </div>
  )
}

AnswerToggle.afterDOMLoaded = script
AnswerToggle.css = style

export default (() => AnswerToggle) satisfies QuartzComponentConstructor
