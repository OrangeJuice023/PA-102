// OCT 3 keeps every word of reviewer.md; only Sir's own formatting from his
// Oct 3 PDF is restored (bold run-in labels, italic "ad interim").
// verify-vault.mjs undoes exactly these before its byte-for-byte comparison.
export const OCT3_FORMAT = [
  ["- General veto power.", "- **General veto power.**"],
  ["- Line-item veto power.", "- **Line-item veto power.**"],
  ["- Budget control.", "- **Budget control.**"],
  ["- Legislative agenda.", "- **Legislative agenda.**"],
  ["rules on ad interim appointments", "rules on *ad interim* appointments"],
]
