import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as PA from "./quartz/components/pa102"

// Sidebar lists the topic notes in reviewer order (filenames are numbered 00–16).
// Concept notes belong to the Second Brain tab, so they are left out here.
const topicExplorer = Component.Explorer({
  title: "Topics",
  folderDefaultState: "open",
  folderClickBehavior: "collapse",
  filterFn: (node) => node.slugSegment !== "tags" && node.slugSegment !== "Concepts",
  sortFn: (a, b) => {
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    return a.slugSegment.localeCompare(b.slugSegment, undefined, { numeric: true })
  },
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [PA.ReadingToolbar(), PA.TopicTabs()],
  afterBody: [PA.PrevNext()],
  footer: PA.NoFooter(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
    PA.AnswerToggle(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    topicExplorer,
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    topicExplorer,
  ],
  right: [],
}
