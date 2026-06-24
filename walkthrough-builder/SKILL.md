---
name: walkthrough-builder
description: Build interactive, shareable HTML walkthroughs (step-by-step setup guides, how-tos, runbooks, onboarding and configuration guides) where readers tick off each step, their progress is saved in the browser, and values they collect along the way (IDs, tokens, keys, URLs, paths) are captured once and shown back automatically wherever they're needed later. Use this skill whenever someone wants to create, write, generate, or update a walkthrough, a step-by-step guide, an interactive checklist, a setup or installation guide, a runbook, or any "how to do X" document that people follow and check off — even if they don't say the word "walkthrough." Also use it to add screenshots to such a guide, to make a guide that saves progress, or to turn rough instructions into a polished, verified, shareable guide. Research and verify every step before writing; never guess UI labels, paths, or versions.
---

# Walkthrough Builder

Turn a request into a verified HTML walkthrough (one HTML file plus a small relative
`./artifacts/` folder of CSS/JS/images): collapsible sections,
a checkbox on every step (progress saved in the browser), light/dark theming, a
floating panel of values the reader saves as they go, and live read-only references
that fill those values back in wherever they're needed later. Optional per-step
screenshots are wired in from images the maker uploads.

Your job has two halves that matter equally: **get the steps right** (research and
verify — no guessing) and **render them well** (the template and contract below).

## Reference map — read these as you need them

- `assets/template.html` + `assets/artifacts/` — the canonical template and its
  CSS/JS. **Always start by copying `template.html` to the output and copying the whole
  `assets/artifacts/` folder beside it**, then replace the token placeholders and swap
  the demo content for real sections. `base.css` and `app.js` are copied verbatim.
- `references/html-contract.md` — how the template works: tokens, the localStorage
  scheme, the component snippets, live references, images, the floating panel,
  theming/branding, and the rare case for a service worker. Read before editing HTML.
- `references/authoring-process.md` — the research → interview → verify loop, accuracy
  rules, version pinning, reading level, terminal-vs-PowerShell wording, and the image
  intake flow. Read before writing content.

## The workflow

1. **Research first.** Search the web and read the current official docs for the exact
   product and version before anything else. Arrive at the interview already knowing
   the likely path.
2. **Ask a few sharp clarifying questions** (audience, platform, access level, scope,
   branching, branding, whether screenshots are coming). If you can't tell what comes
   after a given point, ask the maker directly — their answer becomes a verified step.
   Prefer tappable single-select questions; don't interrogate.
3. **Walk every step yourself**, confirming button names, menu paths, URLs, and version
   numbers as they exist now. If a path looks outdated, find the current one.
4. **Build** from `assets/template.html` using the component snippets in the contract.
   At each step where a layman would be unsure what to look for or aim at, queue an image
   slot: a visible `📷 example photo on the way` marker plus a ready-to-fill `<figure>`.
5. **Verify again after every change** — re-check paths, versions, and clarity, going
   back online if anything could have changed. Surface any discrepancy you couldn't
   fully confirm instead of hiding it.
6. **Ask for images, then wait.** List each image step with its suggested generation
   prompt inline (see `authoring-process.md`), and clearly give the maker three choices per
   image: upload it, **skip** it (no image and no placeholder), or **keep a placeholder**
   (a "coming soon" marker plus an empty slot to fill later). Then **stop and wait** for
   the maker's reply in the prompt box; do **not** generate the final walkthrough files
   until they respond.
7. **Finalize images.** For each provided image, wire its `<figure>` and remove the marker;
   for each **skip**, delete the marker and slot entirely so the step is clean text; for
   each **keep-placeholder**, leave a clean self-contained `📷` marker and the ready-to-fill
   slot. Show a sample and get approval.
8. **Deliver both forms.** Ship the structured distributable `.zip` (only
   `walkthrough.html` + `artifacts/`) **and** a self-contained `merged-walkthrough.html`
   (all CSS/JS — and any images, as data URIs — folded into the one file). Keep the inline
   preview and, if images were involved, `image-prompts.html` in the output root beside them.

## Non-negotiable rules

These exist because a walkthrough that's wrong is worse than none — the reader trusts
it and acts on it.

- **No invented UI, paths, or versions.** If you can't confirm a label or step, look it
  up or ask. Never smooth over a gap with a plausible guess.
- **Date your confidence.** The version tag states what you verified against and when.
- **Flag the unverified.** An honest "couldn't confirm on the current version" is
  required when you couldn't check something.
- **Name the gate.** Any step that needs a role, license, or paid tier gets an access
  note saying who to contact or how to unlock it (see the `.access-note` component).
- **Write for a sharp 13-year-old**, professional tone, accurate jargon, with a
  half-sentence of plain meaning the first time a term appears. One action per step.
- **Tell them which tool.** State terminal vs PowerShell (or other tool choices)
  explicitly and stay consistent.

## What makes this format worth using

Two features carry the value; make sure both show up whenever they apply:

- **Capture-and-reference.** Any value the reader obtains that they'll need later (an
  ID, token, key, URL, path, name) gets a capture box in the step where it appears and
  a live read-only reference everywhere it's reused — so a later step can literally
  read "Enter `1234-ABCD` for the key" with the reader's own saved value filled in.
  Mask secrets with `type="password"`. See the contract, section 4.
- **One value per field, always.** Never combine several values in one box. A step that
  yields multiple values uses a side-by-side multi-field group (one labeled field each,
  wrapping to stacked when narrow). Every date uses a `type="date"` calendar picker that
  stores and shows ISO 8601 (`YYYY-MM-DD`). These are defaults, not options.
- **Saved progress, locally.** Checkboxes and captured values persist in the browser
  via localStorage — no server, nothing transmitted. Default to localStorage only; add
  a service worker only if the maker truly needs a *hosted* copy to keep working after
  the network drops (contract, section 8).

## Design defaults

- **Local-first, offline-capable.** The HTML links its CSS/JS from a flat, relative
  `./artifacts/` folder. Use only classic `<link>`/`<script src>` — no `type="module"`,
  no local `fetch()`, no cross-origin fonts/CDNs — so it works both double-clicked
  (`file://`) and hosted. Copy `base.css` and `app.js` verbatim from the skill's assets.
- **Two palette files, neutral by default.** `theme-neutral.css` (default) and
  `theme-x.css` are the brand split; the HTML links exactly one. To go branded,
  switch the theme `<link>` and consult the X brand guidelines skill (if installed).
- **Themeable light/dark**, defaulting to the reader's system setting.
- **Images** live in `./artifacts/`, display at content width when wider / centered
  when narrower, and click to open the untouched original in a new tab.
- **JSON caveat:** a fetched local `.json` is blocked under `file://`; if a guide needs
  data, ship it as `artifacts/data.js` (see the contract, section 9).

## Packaging and delivery

The output of *using* this skill is the walkthrough files for the maker, not a skill
package. Assemble the finished `walkthrough.html` next to its `artifacts/` folder (CSS,
JS, and any wired images), then **deliver it as a single `.zip` containing only
`walkthrough.html` + `artifacts/`**, structure already in place, so the maker just unzips
and opens. Present the zip. Also state the one-line manual layout: keep `walkthrough.html`
and the `artifacts/` folder side by side in one folder.

**Always also produce a single-file `merged-walkthrough.html`.** This is the same finished
walkthrough with `base.css`, the one chosen theme file, and `app.js` (plus `data.js` and any
wired images, as base64 data URIs) folded inline, so it travels as one self-contained file —
useful for emailing, pasting into a wiki, or anywhere a folder can't be hosted. Build it
*from* the finished structured version so the two never drift, and present it on its own (it
needs no zip — it is already one portable file). The structured `.zip` stays exactly as
defined: only `walkthrough.html` + `artifacts/`, never the merged file inside it. The
structured option remains the default for makers who want clean structure or plan to host
several walkthroughs on one site sharing the same `artifacts/`; the merged file is the
single-file alternative. See `html-contract.md`, section 12, for the mechanical merge steps.

If the walkthrough needs images, queue a slot at each image step (a `📷` marker plus a
ready-to-fill `<figure>`), and when asking the maker to upload, **list each step's image
description with its suggested generation prompt directly beneath it, inline in chat**, so
the maker can round-trip it through their own image generator and return with the file.
**Always** produce an **`image-prompts.html`** sheet (from
`assets/image-prompts-template.html`) with the same prompts and copy buttons whenever the
walkthrough has image steps — **even if the maker provides or skips every image** — and
save it in the **same folder as the inline preview**; never put it inside the distributable
zip (the zip holds only `walkthrough.html` + `artifacts/`). After asking, **stop and wait** for the maker's reply
before generating the final files. Give them three choices per image — upload it, **skip**
it (reply e.g. `skip 4.1` or `skip all`; leaves **no marker or slot**), or **keep a
placeholder** (reply e.g. `placeholder 4.1`; leaves a clean "coming soon" marker and an
empty slot to wire later). See `authoring-process.md` for the full flow.

Tell the maker each reader's progress lives only in their own browser.
