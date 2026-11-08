# Project notes and diary

Running log for the owner and any AI agent working on this repo. Newest entry
on top. Add a line whenever you change something by hand or decide something.

## Status

- [ ] Step 4 (2026-11-08): Topics 4.2–4.7 added from the consolidated draft
  (`content/reviewer-4-2-to-4-7.md` → notes 14a–14f). Awaiting owner's review.
  `content/reviewer.md` byte-identical; 4.1/Hyperpangulo untouched.
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

- Reference files are not in `references/` yet (4 old PDFs + LTD-Midterms-Message.docx).
  The 3 NEW references (Second Year notes, Galindez (2), nov 7 docx) ARE in
  `references/` locally since 2026-11-08 (gitignored, never commit).
- 4.2–4.7 flagged cites still need owner/Sir confirmation (each has a `Check:`
  note in the source): RA 6770, RA 7160 (numbers not in the notes); Art. IX-A
  framework extras + B–D qualifications wording; 4.7F Shari'ah/fiscal/transition
  bullets. Resolved 2026-11-08 with official sources: PDIC ₱1M coverage,
  PDIC 1992/RA 7400 transfer, PD 1445 title, RA 11232/8799, 46 PRBs,
  BTr Secs. 29–32, DepDev Council name.

## Decisions

- 2026-11-08: 4.4 micro-fix (same PR): "up to five" → "five (5)" Undersecretaries
  and Assistant Secretaries per EO 292 Secs. 6–7. Only the DOF sentence changed.
- 2026-11-08: 4.4 final corrections (same PR): DOF Usec-to-group mapping fixed
  per EO 292 Sec. 6 (one policy group + four operations groups); bancassurance
  reworded (equity not required, RA 10607 Sec. 375); PDIC 1992/RA 7400, PDIC
  ₱1M, PD 1445, RA 11232/8799, and 46 PRBs converted from warnings to sourced
  notes with official links; unprogrammed-appropriations note updated with the
  Oct 20 2026 SC ruling and Oct 25 2026 DBM statement. Only §4.4 changed.
- 2026-11-08: Topic 4.4 expanded per owner review (same PR): DOF/BIR/BOC/BTr
  structures, in-between classification, PDIC 1992 transfer, Basel standards,
  SEC 5-member/7-year terms, insurance detail, 46 PRBs, LGU/Sec. 133
  qualification, unprogrammed-appropriations qualification, UP/25(1) framing.
  Corrections: BTr Secs. 29–32 confirmed in Galindez (wrong Check removed),
  DepDev Council warning removed. Only §4.4 changed.
- 2026-11-08: Topic 4.3 expanded per owner review (same PR): three-commission
  distinction, regular-vs-initial-staggered terms (CSC 7/5/3), Ombudsman
  functions + Swedish/Integrity Board context, CHR EO 163, electoral
  tribunals + Macalintal v. PET, full Impeachment Court subsection (Art. XI
  procedure, officials, grounds, judgment limit). Only §4.3 changed.
- 2026-11-08: 4.2 corrections (same PR): Sec. 25(2)/(3) renumbered per the
  Constitution (the Galindez notes had them swapped); Sec. 22 Journal-recording
  claim removed; political-question lecture shorthand qualified with the
  Art. VIII, Sec. 1 grave-abuse clause.
- 2026-11-08: Topic 4.2 expanded per owner review (same PR): Senate/House
  leadership, Senate departments, OIRP services, EDP-MIS/PRIB, BROOM Policy
  Order 2004-001, SEPO Res. 65, Art. VI Secs. 20/22/23/25/29, court structure
  and administration, JBC, Sec. 4(2)–(3)/Sec. 5 detail, fact/law/policy,
  Shari'ah courts (High Court kept as forthcoming), BP 129/RA 11576,
  RA 12233, Muslim Code/RA 12018, Macalintal 25(5)+term/tenure, ABAKADA as
  mention-only. Only content/reviewer-4-2-to-4-7.md §4.2 changed.
- 2026-11-08: Tabs regrouped into Start / Midterm / Finals / Resources /
  Second Brain (owner request, same PR). Midterm = everything before 4.2;
  Finals = 4.2–4.7 (future 4.8–5.3 join Finals as 14g+); Resources = OCT 3 +
  Practice. No component logic changed except AnswerToggle, which now
  matches the Practice page by slug instead of the retired "Practice" group.
  Prev/Next still runs across the whole reviewer (4.1→4.2→…→4.7→OCT 3).
- 2026-11-08: Topics 4.2–4.7 live in a second committed source,
  `content/reviewer-4-2-to-4-7.md` (consolidated draft + 9 traceability
  `Check:` notes + cross-links; `---` separators dropped as formatting).
  `content/reviewer.md` stays byte-identical (frozen midterm source).
- 2026-11-08: New notes are `14a Topic 4.2`–`14f Topic 4.7`, sorting between
  14 and 15 with no renumbering (verified for both the verifier's string
  sort and the sidebar's numeric localeCompare). OCT 3 / Practice keep
  their filenames and URLs; only their `order` frontmatter moved (15→21,
  16→22). No blanket NEEDS VERIFICATION banners (owner decision); only
  specific lines are flagged.
- 2026-11-08: Topic metadata extracted to `scripts/topics.mjs`, shared by
  the builder and verifier (each entry names its source file + section
  index). Verifier now asserts the filename↔entry pairing instead of
  assuming it. Topic 4 tab auto-became a 4.1–4.7 sub-tab row; no component
  logic changed (only two stale comments).
- 2026-11-08: Autonomy (CAR vs BARMM) is not linked in 14a/14b/14d (House
  procedure, commission fiscal matters, instrumentality operations are
  different senses — same precedent as the 3.2/3.3 excludes).
- 2026-11-08: Draft-vs-notes discrepancies (draft follows the constitution/
  statute in each case, logged here per the no-silent-choice rule): COA
  CPA experience — Galindez says 7 years, draft says 10 (Art. IX-D);
  RA 6975 year — Galindez says (1991), draft says (1990); BESF —
  Galindez "sources of funds", draft "Sources of Financing" (official);
  RA 9851 — Galindez (2010), draft (2009) with note; LRTA v. Pasay —
  notes June 29 2022, draft June 28 with note; Macalintal second
  G.R. No. 263673 confirmed present in Galindez; AFP "four branches
  incl. Marines" (Second Year) vs 3 services (Galindez) — draft cautions;
  RA 7227 — Galindez labels it "[SBMA Act]", draft uses the official
  short title.
- 2026-10-06: Owner supplied fuller definitions for 13 concepts (from Galindez's
  notes, the SWX class notes, the 2–3.7 notes, Sir's Oct 3 guide and the
  reviewer). They live in `scripts/owner-definitions.mjs` and show as a
  "Definition" card with the source, ABOVE the word-for-word reviewer line,
  which is kept. The Second Brain list shows the owner's version. Note: the SWX
  class notes are the 177-page set the reviewer had deliberately left out.
- 2026-10-06: Centralization and Decentralization split into two concept notes
  (owner gave separate definitions). Centralization's reviewer line is the
  "Logic of extraction ... one nation → one central state" bullet from 3.6.

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

- 2026-11-08: Topics 4.2–4.7 added (second source, notes 14a–14f, 23 topic notes total).
- 2026-10-06: Concepts 19 → 26, Decentralization rename, OCT 3 formatting.
- 2026-10-06: Repo set up at `D:\PA 102`. Source copied byte-identical from
  `PA 102 Midterm Reviewer.md`. Vault build + verify scripts added.
