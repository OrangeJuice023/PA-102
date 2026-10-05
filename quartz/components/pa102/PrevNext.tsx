import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { isTopic, titleOf, topicPages } from "./topics"
import style from "./styles/prev-next.scss"

// Previous / Next topic links at the bottom of every topic note, in reviewer order.
const PrevNext: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (!isTopic(fileData)) return null
  const pages = topicPages(allFiles)
  const index = pages.findIndex((page) => page.slug === fileData.slug)
  const prev = pages[index - 1]
  const next = pages[index + 1]
  const here = fileData.slug as FullSlug

  return (
    <nav class="prev-next" aria-label="Previous and next topic">
      {prev ? (
        <a class="prev" href={resolveRelative(here, prev.slug as FullSlug)} rel="prev">
          <span class="direction">← Previous</span>
          <span class="title">{titleOf(prev)}</span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a class="next" href={resolveRelative(here, next.slug as FullSlug)} rel="next">
          <span class="direction">Next →</span>
          <span class="title">{titleOf(next)}</span>
        </a>
      ) : (
        <span />
      )}
    </nav>
  )
}

PrevNext.css = style

export default (() => PrevNext) satisfies QuartzComponentConstructor
