// Concept notes for the Second Brain. `definition` must be copied verbatim
// from content/reviewer.md (build-vault.mjs fails if it is not found there).
// `pattern` finds the first mention to link in each topic note; `exclude`
// lists notes where the match means something else.
export const CONCEPTS = [
  {
    name: "De Facto Government",
    pattern: /\bde facto\b/i,
    source: "01 Foundational Concepts",
    definition: `**De facto** = "of the fact": it occupies, so it rules (example: Japanese occupation).`,
  },
  {
    name: "Sovereignty",
    pattern: /\bsovereignty\b/i,
    source: "01 Foundational Concepts",
    definition: `**Sovereignty** = free from external influence; can be **transferred to a successor**.`,
  },
  {
    name: "Separation of Powers",
    pattern: /\bseparation of powers\b/i,
    source: "03 Topic 2.1-2.2",
    definition: `Separation of powers **prevents concentrating** legislative, executive, and judicial power in one branch.`,
  },
  {
    name: "Constitutional Supremacy",
    pattern: /\bconstitutional supremacy\b|\bsupreme law\b/i,
    source: "03 Topic 2.1-2.2",
    definition: `The Constitution is the **supreme law** that sets the boundaries of public power. Hierarchy: **Constitution → statutes → administrative rules/orders.**`,
  },
  {
    name: "Utang na Loob",
    pattern: /\butang na loob\b/i,
    source: "04 Topic 2.3",
    definition: `A **"debt of good will"** from receiving someone's kindness.`,
  },
  {
    name: "Diskarte",
    pattern: /\bdiskarte\b/i,
    source: "04 Topic 2.3",
    definition: `**Morales (2017):** diskarte = **creative problem-solving in response to practical problems and situational constraints**.`,
  },
  {
    name: "Pakikisama",
    pattern: /\bpakikisama\b/i,
    source: "04 Topic 2.3",
    definition: `**Pakikisama** = getting along; maintaining harmonious relationships.`,
  },
  {
    name: "Hiya",
    pattern: /\bhiya\b/i,
    source: "04 Topic 2.3",
    definition: `**Hiya** = shame; sensitivity to social judgment; concern about embarrassment and relationships.`,
  },
  {
    name: "Pagdamay",
    pattern: /\bpagdamay\b/i,
    source: "14 Topic 4.1",
    definition: `The PH has a **pangulo regime** where the **executive is supreme**, rooted in the value of **pagdamay** (fraternity).`,
  },
  {
    name: "Pangulo Regime",
    pattern: /\bpangulo(?: regime)?\b/i,
    source: "14 Topic 4.1",
    definition: [
      "| Regime | Origin | Supremacy | Core value |",
      "| --- | --- | --- | --- |",
      "| **Pangulo** | PH | **Executive** | **Fraternity / pagdamay** |",
    ].join("\n"),
  },
  {
    name: "Philippine Constabulary",
    pattern: /\b(?:Philippine )?Constabulary\b/,
    source: "09 Topic 3.3",
    definition: `**Philippine Constabulary (1901 to 1991):** a **gendarmerie** (military doing law enforcement) replacing the insular police.`,
  },
  {
    name: "Police Power",
    pattern: /\bpolice power\b/i,
    source: "11 Topic 3.5",
    definition: `**Police power** = the State's power to regulate private conduct, property, and business for **public welfare and self-protection**.`,
  },
  {
    name: "Due Process",
    pattern: /\bdue process\b/i,
    source: "11 Topic 3.5",
    definition: `**Due process:** violence is no longer private; the **State** uses it through the courts`,
  },
  {
    name: "Mestizo Legal System",
    pattern: /\bmestizo\b(?!s)(?: legal system)?/i,
    source: "11 Topic 3.5",
    definition: `**Main thesis:** **Spanish civil law + American common law + local/customary law = mestizo legal system.**`,
  },
  {
    name: "Centralization vs Decentralization",
    pattern: /\b(?:de)?centrali(?:zation|zed|st)\b/i,
    source: "12 Topic 3.6",
    definition: `**Decentralization** = transfer of authority from the center to lower levels.`,
  },
  {
    name: "Federalism",
    pattern: /\bfederalism\b/i,
    source: "12 Topic 3.6",
    definition: `Responds to excessive centralization: authority is **constitutionally divided** between national and regional/state governments.`,
  },
  {
    name: "Autonomy (CAR vs BARMM)",
    pattern: /\b[Aa]utonom(?:y|ous)\b|\bB?ARMM\b/,
    source: "13 Topic 3.7",
    // 3.3 uses "Filipino autonomy" for self-rule under the US, not regional autonomy.
    exclude: ["09 Topic 3.3"],
    definition: `**CAR** = administrative region. **BARMM** = autonomous region.`,
  },
  {
    name: "Malolos Constitution",
    pattern: /\bMalolos(?: Constitution)?\b/,
    source: "08 Topic 3.2",
    definition: `**Malolos Constitution:** free and independent republic, popular sovereignty, representative and responsible government, 3 branches, religious freedom, **separation of Church and State**.`,
  },
  {
    name: "Bureaucracy (Weber)",
    pattern: /\bbureaucrac(?:y|ies)\b/i,
    source: "01 Foundational Concepts",
    definition: `Bureaucracy = **rational-legal authority** + **division of labor (hierarchy)**.`,
  },
]
