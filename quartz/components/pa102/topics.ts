import { QuartzPluginData } from "../../plugins/vfile"
import { FullSlug } from "../../util/path"

// Reviewer tab groups, in tab-bar order. Topic notes carry `group` and
// `order` in their frontmatter (written by scripts/build-vault.mjs).
export const TOPIC_GROUPS = ["Start", "Topic 2", "Topic 3", "Topic 4", "Oct 3", "Practice"]
export const SECOND_BRAIN = "Second Brain"
export const SECOND_BRAIN_SLUG = "Second-Brain" as FullSlug

const frontmatterOf = (file: QuartzPluginData) =>
  (file.frontmatter ?? {}) as Record<string, unknown>

export const isTopic = (file: QuartzPluginData) => file.slug?.startsWith("Topics/") ?? false

export function topicPages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  return allFiles
    .filter(isTopic)
    .sort((a, b) => Number(frontmatterOf(a).order ?? 0) - Number(frontmatterOf(b).order ?? 0))
}

// Which tab a page belongs to. Concept notes live under the Second Brain tab.
export function groupOf(file: QuartzPluginData): string | undefined {
  const slug = file.slug ?? ""
  if (slug.startsWith("Concepts/") || slug === SECOND_BRAIN_SLUG) return SECOND_BRAIN
  if (slug === "index") return "Start"
  const group = frontmatterOf(file).group
  return typeof group === "string" ? group : undefined
}

// Short sub-tab label: the topic number when there is one ("2.1–2.2"),
// otherwise the filename without its number ("How to Use").
export function shortLabel(file: QuartzPluginData): string {
  const topic = frontmatterOf(file).topic
  if (typeof topic === "string" && topic.length > 0) return topic
  const segment = (file.slug ?? "").split("/").pop() ?? ""
  return segment.replace(/^\d+-/, "").replace(/-/g, " ")
}

export const titleOf = (file: QuartzPluginData) => String(frontmatterOf(file).title ?? file.slug)
