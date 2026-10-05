import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { DropTitleHeading } from "./quartz/plugins/transformers/dropTitleHeading"

/**
 * PA 102 Midterm Reviewer. Content lives in vault/ (generated from
 * content/reviewer.md by scripts/build-vault.mjs). Runs locally only:
 * no analytics, no external services.
 *
 * Colors are WCAG AA checked. The sepia theme and extra tokens are in
 * quartz/styles/custom.scss.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "PA 102 Reviewer",
    pageTitleSuffix: " · PA 102",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "localhost:8080",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: { name: "Atkinson Hyperlegible Next", weights: [400, 700] },
        body: { name: "Atkinson Hyperlegible Next", weights: [400, 700], includeItalic: true },
        code: { name: "Atkinson Hyperlegible Mono", weights: [400, 600] },
      },
      colors: {
        lightMode: {
          light: "#FAF8F3",
          lightgray: "#E3DED3",
          gray: "#6B665C",
          darkgray: "#2B2B2B",
          dark: "#2B2B2B",
          secondary: "#2F5F8A",
          tertiary: "#2E6E73",
          highlight: "rgba(47, 95, 138, 0.08)",
          textHighlight: "#f5e27a88",
        },
        darkMode: {
          light: "#1E1F22",
          lightgray: "#36383D",
          gray: "#A3A5AA",
          darkgray: "#D7D7D7",
          dark: "#D7D7D7",
          secondary: "#8DB6DA",
          tertiary: "#86C1B8",
          highlight: "rgba(141, 182, 218, 0.1)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      DropTitleHeading(),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({ maxDepth: 3 }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: false,
        enableRSS: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
