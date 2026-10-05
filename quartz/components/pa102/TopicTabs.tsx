import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import {
  SECOND_BRAIN,
  SECOND_BRAIN_SLUG,
  TOPIC_GROUPS,
  groupOf,
  shortLabel,
  titleOf,
  topicPages,
} from "./topics"
// @ts-ignore
import script from "./scripts/topic-tabs.inline"
import style from "./styles/topic-tabs.scss"

const idFor = (group: string) => `subtabs-${group.toLowerCase().replace(/\s+/g, "-")}`

// Top tab bar. A group with several pages opens a row of sub-tabs; a group
// with a single page (Topic 4, Oct 3, Practice) links straight to it.
const TopicTabs: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const here = fileData.slug as FullSlug
  const currentGroup = groupOf(fileData)
  const pages = topicPages(allFiles)
  const groups = TOPIC_GROUPS.map((name) => ({
    name,
    pages: pages.filter((page) => groupOf(page) === name),
  })).filter((group) => group.pages.length > 0)

  return (
    <nav class="topic-tabs" aria-label="Reviewer topics">
      <div class="group-row">
        {groups.map(({ name, pages }) => {
          const active = name === currentGroup
          if (pages.length === 1) {
            const page = pages[0]
            return (
              <a
                class={`group-tab${active ? " active" : ""}`}
                href={resolveRelative(here, page.slug as FullSlug)}
                aria-current={page.slug === here ? "page" : undefined}
                title={titleOf(page)}
              >
                {name}
              </a>
            )
          }
          return (
            <button
              type="button"
              class={`group-tab${active ? " active" : ""}`}
              data-group-target={idFor(name)}
              aria-controls={idFor(name)}
              aria-expanded={active ? "true" : "false"}
            >
              {name}
            </button>
          )
        })}
        <a
          class={`group-tab second-brain-tab${currentGroup === SECOND_BRAIN ? " active" : ""}`}
          href={resolveRelative(here, SECOND_BRAIN_SLUG)}
          aria-current={here === SECOND_BRAIN_SLUG ? "page" : undefined}
        >
          {SECOND_BRAIN}
        </a>
      </div>
      {groups
        .filter((group) => group.pages.length > 1)
        .map(({ name, pages }) => (
          <ul class="sub-tabs" id={idFor(name)} hidden={name !== currentGroup}>
            {pages.map((page) => (
              <li>
                <a
                  href={resolveRelative(here, page.slug as FullSlug)}
                  aria-current={page.slug === here ? "page" : undefined}
                  title={titleOf(page)}
                >
                  {shortLabel(page)}
                </a>
              </li>
            ))}
          </ul>
        ))}
    </nav>
  )
}

TopicTabs.afterDOMLoaded = script
TopicTabs.css = style

export default (() => TopicTabs) satisfies QuartzComponentConstructor
