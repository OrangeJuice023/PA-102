import { Root } from "mdast"
import { QuartzTransformerPlugin } from "../types"

// Vault notes open with "# <title>" so the title shows in Obsidian. On the
// site, ArticleTitle already renders the frontmatter title, so drop that
// leading H1 to avoid printing the title twice.
export const DropTitleHeading: QuartzTransformerPlugin = () => ({
  name: "DropTitleHeading",
  markdownPlugins() {
    return [
      () => (tree: Root) => {
        const first = tree.children.findIndex((node) => node.type !== "yaml")
        const node = tree.children[first]
        if (node?.type === "heading" && node.depth === 1) {
          tree.children.splice(first, 1)
        }
      },
    ]
  },
})
