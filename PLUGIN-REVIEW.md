# Plugin code review — 22 September 2026

Five Illustrator ExtendScript (`.jsx`) files and five SVG icons reviewed. None is an installable Photoshop/Figma extension.

## Provenance and licensing

- Column ↔ Row Converter, Batch Text Replace, Reverse Text Lines: user-supplied scripts. `t3zrk` metadata and MIT packages have been prepared on the understanding that you have publishing rights; originality cannot be proven from these files alone.
- Contrast Checker: uploaded v0.1.1 code matches Sergey Osokin's open-source ContrastChecker.jsx. The uploaded copy omitted upstream attribution. The release restores the original author and an MIT notice and credits t3zrk only for packaging/maintenance. Do **not** claim exclusive authorship.
- Convert to Gradient: apparent adaptation of the upstream ConvertToGradient script in the same MIT-licensed collection. Exact revision history unknown; provenance caveat and upstream credit included. Do **not** claim exclusive authorship.

## Static review and fixes

- Removed global `ShowExternalJSXWarning = false` preference changes to avoid changing Illustrator's security setting for other scripts.
- Contrast Checker: removed the unnecessary temp HTML file/URL-opening helper and retained its upstream author credit.
- Column ↔ Row: added no-document validation, exactly-one-selection validation, a default conversion mode, and cross-platform line-ending parsing.
- Batch Text Replace: replacement strings use a callback so `$&` and `$1` are treated literally; the dialog supports five pairs. Exact/whole-word matching may not handle all languages or punctuation. Replacing a whole text frame may affect rich text formatting.
- Reverse Text Lines: validates exactly one selected text frame, and reverses paragraphs/lines, not characters. Setting `.contents` may affect character-level formatting.
- Convert to Gradient: the supplied implementation creates new gradients, changes fills, and applies an object gradient transform. It skips unsupported colours and can create many gradient definitions; test colour-space and clipping results on a copy.
- Contrast Checker: relies on selected solid fills and uses WCAG-style thresholds; results are not a certification of a whole page and should be confirmed visually.
- No obvious remote requests, credential collection or executable shell commands were found in the revised scripts. This is a limited static review, not a full security audit.
- All five revised `.jsx` files pass JavaScript syntax parsing via Node after stripping the ExtendScript `//@target` directive. Adobe Illustrator is not available in this environment, so interactive UI and document transformations were not tested there.
