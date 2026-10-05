# Project notes and diary

Running log for the owner and any AI agent working on this repo. Newest entry
on top. Add a line whenever you change something by hand or decide something.

## Status

- [x] Step 1: vault built and approved (17 topic notes, 26 concept notes).
- [x] Step 2: Quartz v4 + Reviewer tab, approved 2026-10-06.
      The Second Brain tab link 404s until step 3.
- [x] Cloudflare Workers config (`wrangler.jsonc`, static assets from `public/`).
      Worker name is `pa-102` to match the Worker in Cloudflare (builds fail on a
      name mismatch).
      Deploy command `npx wrangler deploy`; wrangler.jsonc `build.command` runs
      `npm run build` first, so the dashboard build command can stay empty.
      (2026-10-06: first Cloudflare deploy failed because no build ran and
      public/ did not exist.)
- [x] Step 3: Second Brain tab built 2026-10-06 (map, concept list with
      definitions, topics each concept connects). Awaiting owner's review.
- [x] GitHub: `OrangeJuice023/PA-102-reviewer` is PUBLIC by the owner's choice
      (2026-10-06; earlier specs said private, the owner reversed that). The
      remote URL pins the OrangeJuice023 account; its login lives in Windows Git
      Credential Manager. The `gh` CLI is still logged in as `gervi-kodeacross`
      (work account): do not use `gh` for this repo without checking the account.

## Open items

- Reference files are not in `references/` yet (4 PDFs + LTD-Midterms-Message.docx).

## Decisions

- 2026-10-06: Second Brain lists each concept once with its definition and its
  "Connects" topics (spec items 2 and 3 merged per concept). Home and Second
  Brain pages are left out of the whole-site map so they don't become hubs.
- 2026-10-06: Graph nodes are colored by type everywhere (sidebar graph too);
  the current note is marked with a ring instead of a color. Tag nodes are off.
- 2026-10-06: "Created with Quartz" footer removed (owner request).

- 2026-10-06: "Check:" notes use the `warning` callout titled "Check" (`check` is
  an Obsidian/Quartz alias of green `success`).
- 2026-10-06: Font is Atkinson Hyperlegible Next (Google Fonts, cached locally at
  build). Its slashed zero is intentional (0 vs O).
- 2026-10-06: Focus mode hides both sidebars and the tab bar; the reading toolbar
  stays so it can be turned off (Escape also works). Saved like theme and size.
- 2026-10-06: Single-page tab groups (Topic 4, Oct 3, Practice) link straight to
  their page instead of opening a one-item sub-tab row.
- 2026-10-06: Reviewer sidebar lists only Topics; concept notes live under the
  Second Brain tab.
- 2026-10-06: No analytics, RSS, sitemap or social preview images (local use only).

- 2026-10-06: Owner approved step 1 samples, the 3.3 banner merge, and answers
  under each question.
- 2026-10-06: Owner's named concept list is always included, even where a
  concept appears in only one topic (Diskarte, Pakikisama, Hiya, Pagdamay,
  Philippine Constabulary, Police Power, Due Process, Mestizo Legal System,
  Federalism).
- 2026-10-06: Added Martial Law, Judicial Review, Filipino First Policy,
  Informal Institutions, Patronage, Unincorporated Territory, Emergency Powers.
  Emergency Powers takes its definition from OCT 3 (Sir's wording).
- 2026-10-06: "Centralization vs Decentralization" renamed "Decentralization";
  second line "Model: one nation → one central state ..." added as context.
  Mentions of "centralized/centralization" still link to it.
- 2026-10-06: OCT 3 restores Sir's PDF formatting (bold run-in labels, italic
  "ad interim"); no word changes. List lives in `scripts/oct3-format.mjs`.
- 2026-10-06: OCT 3 gets no wikilinks. Concepts mentioned there list it under
  "Where it appears" (link from the concept side only).
- 2026-10-06: Patronage is not linked in 3.2 (royal patronage of the alcalde
  mayor, a different sense). Autonomy is not linked in 3.3 ("Filipino autonomy"
  there means self-rule under the US).
- 2026-10-06: Headings promoted one level per note (`##` becomes the note's H1).
- 2026-10-06: First mention of a concept is linked per note, not once per site.
  Headings and callout titles are never linked. How to Use gets no links.
- 2026-10-06: Constitutional Supremacy links "supreme law" in 2.1–2.2, because the
  exact phrase appears there only in a heading.
- 2026-10-06: Topics 3.3–4.1: the heading tag `[NEEDS VERIFICATION]` becomes a
  yellow banner at the top. In 3.3 the source paragraph that starts with the
  same tag becomes the banner body, so 3.3 shows the tag once instead of twice.
- 2026-10-06: Practice Questions: each answer sits under its question in a
  folded "Show answer" callout. The "Answer key" heading is dropped.
- 2026-10-06: The "Not in the notes, please verify:" blockquote in 2.1–2.2 stays
  a plain blockquote (it is not a "Check:" note).

## Changelog

- 2026-10-06: Concepts 19 → 26, Decentralization rename, OCT 3 formatting.
- 2026-10-06: Repo set up at `D:\PA 102`. Source copied byte-identical from
  `PA 102 Midterm Reviewer.md`. Vault build + verify scripts added.
