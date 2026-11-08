// Topic-note metadata shared by build-vault.mjs and verify-vault.mjs.
// Each entry maps one "##" section of a content source to its note file.
// Array order is the reviewer order (frontmatter `order`); it must also
// match the alphabetical order of the note filenames, because
// verify-vault.mjs pairs generated files with sections by sorted name.
// The 14a–14f filenames sort between "14 ..." and "15 ..." both in plain
// string order and in the sidebar's numeric localeCompare, so Topics
// 4.2–4.7 sit between 4.1 and OCT 3 without renumbering anything.
// To add a future source: add its path to SOURCES and its entries here.
export const SOURCES = {
  reviewer: "content/reviewer.md",
  postMidterm: "content/reviewer-4-2-to-4-7.md",
}

export const TOPICS = [
  { file: "00 How to Use", source: "reviewer", section: 0, group: "Start", link: false },
  { file: "01 Foundational Concepts", source: "reviewer", section: 1, group: "Start" },
  { file: "02 Topic 2", source: "reviewer", section: 2, group: "Topic 2", topic: "2" },
  { file: "03 Topic 2.1-2.2", source: "reviewer", section: 3, group: "Topic 2", topic: "2.1–2.2" },
  { file: "04 Topic 2.3", source: "reviewer", section: 4, group: "Topic 2", topic: "2.3" },
  { file: "05 Topic 2.4", source: "reviewer", section: 5, group: "Topic 2", topic: "2.4" },
  { file: "06 Topic 2.5", source: "reviewer", section: 6, group: "Topic 2", topic: "2.5" },
  { file: "07 Topic 3.1", source: "reviewer", section: 7, group: "Topic 3", topic: "3.1" },
  { file: "08 Topic 3.2", source: "reviewer", section: 8, group: "Topic 3", topic: "3.2" },
  { file: "09 Topic 3.3", source: "reviewer", section: 9, group: "Topic 3", topic: "3.3" },
  { file: "10 Topic 3.4", source: "reviewer", section: 10, group: "Topic 3", topic: "3.4" },
  { file: "11 Topic 3.5", source: "reviewer", section: 11, group: "Topic 3", topic: "3.5" },
  { file: "12 Topic 3.6", source: "reviewer", section: 12, group: "Topic 3", topic: "3.6" },
  { file: "13 Topic 3.7", source: "reviewer", section: 13, group: "Topic 3", topic: "3.7" },
  { file: "14 Topic 4.1", source: "reviewer", section: 14, group: "Topic 4", topic: "4.1" },
  { file: "14a Topic 4.2", source: "postMidterm", section: 0, group: "Topic 4", topic: "4.2" },
  { file: "14b Topic 4.3", source: "postMidterm", section: 1, group: "Topic 4", topic: "4.3" },
  { file: "14c Topic 4.4", source: "postMidterm", section: 2, group: "Topic 4", topic: "4.4" },
  { file: "14d Topic 4.5", source: "postMidterm", section: 3, group: "Topic 4", topic: "4.5" },
  { file: "14e Topic 4.6", source: "postMidterm", section: 4, group: "Topic 4", topic: "4.6" },
  { file: "14f Topic 4.7", source: "postMidterm", section: 5, group: "Topic 4", topic: "4.7" },
  { file: "15 OCT 3 Raw Notes", source: "reviewer", section: 15, group: "Oct 3", verbatim: true, tags: ["oct3"] },
  { file: "16 Practice Questions", source: "reviewer", section: 16, group: "Practice", practice: true },
]
