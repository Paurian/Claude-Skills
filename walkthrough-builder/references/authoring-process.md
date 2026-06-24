# Authoring Process — research, verify, and write for real readers

This is the discipline behind a good walkthrough. The HTML is just the container;
accuracy and clarity are the product. The promise to the reader is:
**easy to understand, shortest path to success, current exact steps — no guesswork,
no hallucination, no assumptions.**

## The loop, in order

1. **Research first.** Before asking the maker anything, search the web and read the
   current official docs for the product/version in question. Come to the interview
   already knowing the likely path so your questions are sharp.
2. **Interview the maker.** Ask focused questions about anything research can't settle
   (their environment, audience, access level, the exact branching they care about).
   If you genuinely don't know what comes after a given point, *ask the maker*: "After
   you click Submit, what screen do you land on?" Their answer becomes a verified step.
3. **Walk the steps yourself.** Mentally (and via the web) trace each step end to end.
   Confirm button names, menu paths, URLs, and version numbers as they exist now. If a
   path looks outdated, find the current one and use it.
4. **Write it** using the components in `html-contract.md`.
5. **Verify again after every change.** Re-read for broken paths, stale versions, and
   unclear steps. Call out any discrepancy you couldn't fully confirm rather than
   papering over it.

## Clarifying-question guidance

Ask about, at minimum:
- **Audience & platform**: Windows or Mac? Beginners or technical? This decides
  terminal-vs-PowerShell wording and how much you explain.
- **Access level**: Will readers have admin/owner rights, or will some steps be gated?
  Gated steps need an access note (who to ask, or which paid tier unlocks it).
- **Scope boundaries**: Where does the guide start and stop?
- **Branching**: Any "if X, do this; if Y, do that" forks? Capture both, or pick the
  common path and note the other.
- **Branding**: Neutral (default) or branded? (T-Mobile theme is available.)
- **Images**: Will they provide screenshots? (Intake flow below.)

Prefer tappable single-select questions when the answer is one of a few options.
Keep to a few questions at a time; don't interrogate.

## Accuracy rules (non-negotiable)

- **No invented UI.** If you can't confirm a button label, menu path, or field name,
  say so and either look it up or ask. Never guess a name to make a step read smoothly.
- **Cite freshness in the version tag.** State what you verified against and when.
- **Flag what you couldn't verify.** A short, honest "couldn't confirm this on the
  current version — check before relying on it" beats a confident wrong step.
- **Access-gated and paid features.** When a step needs a role, license, or paid tier,
  say it plainly and give the next action: who to contact, or that the feature exists
  only on (e.g.) the paid plan and how to request it.

## Version pinning

When you name a tool version:
- Pin a specific version that you've confirmed works: e.g. `Node v20 LTS`.
- Add **"or latest"** only when moving to a newer version is genuinely safe:
  e.g. `Node v20 LTS (or the latest LTS)`.
- If you suspect a newer version may break the steps, pin hard and say why:
  e.g. `use v18.x — v20 changed the CLI flags this guide relies on`.

## Terminal vs PowerShell (and similar tool choices)

Readers may not know the difference. State it explicitly the first time and stay
consistent:
- Windows command-line steps → **PowerShell** (the blue icon), not Command Prompt.
- Mac/Linux command-line steps → **Terminal**.
- If a command differs by platform, give both, each labeled.

## Reading level and tone

Write so a sharp 13-year-old can follow it, while keeping a professional tone and
accurate domain terms:
- Short sentences. One action per step. Say exactly what to click and where.
- Use the correct jargon (readers will see those exact words on screen), but the
  first time a term appears, add a half-sentence of plain meaning.
- Bold the action verb / key UI label so the eye finds it fast.
- Prefer "Click **Save** in the top-right" over "Persist your configuration."

## Capture-and-reference design

As you walk the steps, watch for any value the reader obtains that they'll need later
— IDs, tokens, keys, URLs, paths, names. For each:
- Add a **capture** in the step where it first appears (mask secrets with
  `type="password"`).
- Add a **reference** everywhere it's reused, with a `data-empty` that names its source.
- If it's used repeatedly or needed throughout, also add it to the value panel.

This is the core value of the format: the reader never has to scroll back to find the
thing they copied three steps ago — it's filled in for them.

**One value per field.** Never combine multiple values in a single box. If a step
produces several things (e.g., a company, a confirmation number, and a date), give each
its own labeled field in a side-by-side group (it wraps to stacked on narrow screens).
A field's label and its placeholder must describe only that one value.

**Dates get a date picker.** For every date, use a `type="date"` input so the reader
gets a calendar popup, the value is stored and shown in ISO 8601 (`YYYY-MM-DD`), and the
picker matches the theme. See the contract for both patterns.

## Image intake flow (maker uploads in chat; you wire and package)

1. Identify the steps where a layman is most likely to be unsure what to look for or aim
   at, and **queue an image slot at each** in the HTML: keep a visible
   `📷 example photo on the way` marker plus a ready-to-fill commented `<figure>` slot so
   wiring later is trivial.
2. **Ask the maker to upload, with the prompt inline, then wait.** In chat, list each
   image-needed step and, **directly beneath it, the suggested generation prompt as a
   Markdown blockquote** (a `>` line) — with **no `Prompt:` label**. The blockquote drops
   the prompt onto its own line and indents it beneath the step automatically; do not use
   raw HTML like `<br>`, which renders literally in some chat surfaces:

       **Step X.X — <what the image should show>**
       > Create a diagram image to help people visualize what to do: Scene: <a concrete
       > description of what the image should depict for that step>

   The maker copies a prompt, generates the image in their preferred tool, and returns
   with it (or uploads their own photo/screenshot for any step). **In the same message,
   tell the maker plainly that each image step has three options** — for example:
   *"For each image you can: (1) upload it, (2) reply `skip 4.1` (or `skip all`) — skipped
   steps get no image and no placeholder, or (3) reply `placeholder 4.1` to leave a 'coming
   soon' placeholder and an empty slot you can fill in later."* Then **stop and wait**: do
   not generate the final walkthrough files until the maker provides images and/or
   skip/placeholder requests in the prompt box.
3. **Always generate `image-prompts.html`** (from `assets/image-prompts-template.html`) —
   the same prompts with copy buttons — whenever the walkthrough has image-needed steps,
   **even if the maker provides or skips every image** (it stays useful for regenerating or
   updating images later). Save it in the **same folder as the inline preview** so the two
   sit together; never put it inside the distributable zip.
4. **Once the maker replies, finalize each image step one of three ways:**
   - **Image provided** → place it in `./artifacts/` named `step-<section>-<step>.png`,
     wire the `<figure class="step-figure">` snippet (resizes to content width, centers
     smaller images, links to the untouched original), and remove that step's `📷` marker.
   - **Image skipped** → delete that step's `📷` marker *and* its `<figure>` slot entirely.
     The step is left as clean text with **no placeholder of any kind**.
   - **Keep placeholder** → leave a clean, self-contained marker (e.g.
     `📷 Example image for this step coming soon.` — not the interim "on the way" wording)
     and keep the ready-to-fill commented `<figure>` slot, so dropping the image in later
     is a one-line wire.
5. **Show a sample** of how the wired images render and get the maker's approval.
6. **Deliver the distributable as a `.zip` containing only `walkthrough.html` +
   `artifacts/`** (with the wired images inside `artifacts/`), folder structure in place so
   the maker just unzips and opens. The zip never contains `image-prompts.html`.

If the maker skips every image, ship the HTML + `artifacts/` with no figure markup at all
— fully functional.

## Final delivery

- The distributable is a single `.zip` containing **only** `walkthrough.html` and the
  `artifacts/` folder (CSS, JS, and any wired images) — folder structure in place so the
  maker just unzips and opens. State the manual layout too: keep the HTML and `artifacts/`
  together in one folder.
- **Also ship a self-contained `merged-walkthrough.html`** in the output root — the same
  finished walkthrough with CSS, JS, and any images inlined into one file — built from the
  structured version, for makers who want a single portable file instead of a folder.
  Present it on its own (no zip needed). See the contract, section 12.
- Keep the inline preview and (when images were involved) `image-prompts.html` in the
  output root, alongside the zip — never inside it.
- Remind the maker that progress and saved values are stored only in the reader's
  browser, and that to share, they send the unzipped folder (HTML + `artifacts/`).
