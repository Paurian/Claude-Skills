# HTML Contract — how the walkthrough works

Read this before editing the template or hand-writing any walkthrough HTML. The
files in `assets/` are the source of truth; this explains how they fit together so
you can add steps, captures, references, and images correctly.

## Table of contents
1. File structure and relative paths
2. Tokens to replace
3. The localStorage scheme
4. Component catalog (copy-paste snippets)
5. Live variable references — the headline feature
6. Images
7. The floating value panel
8. Theming and branding (two palette files)
9. JSON / data files (the file:// caveat)
10. When (and only when) to add a service worker
11. Self-check before you hand it over
12. Single-file merged build (`merged-walkthrough.html`)

---

## 1. File structure and relative paths

A walkthrough is one HTML file next to a flat folder named **`artifacts`**. Nothing
is nested deeper than that. Expect at most a handful of files plus images.

```
my-walkthrough.html
artifacts/
  base.css            <- structure + components (always)
  theme-neutral.css   <- neutral palette  (link exactly ONE of these two)
  theme-x.css         <- X palette
  app.js              <- behavior (always; copied verbatim)
  step-2-1.png ...    <- images (added after the maker uploads them)
  data.js             <- optional; only if the guide is data-driven (see section 9)
```

Everything is referenced with **relative paths** (`./artifacts/...`). Classic
`<link rel="stylesheet">` and `<script src>` load fine from a double-clicked local
`file://` page, so the walkthrough works offline as well as hosted. Do **not** use
`type="module"`, `fetch()` of local files, or cross-origin fonts/CDNs — those break
under `file://`. Copy `base.css`, both theme files, and `app.js` verbatim from
`assets/artifacts/`; you normally edit only the HTML.

---

## 2. Tokens to replace

The template HTML has `TOKEN` placeholders wrapped in corner brackets. Replace each,
then delete the top comment and the DEMO sample blocks.

| Token | What to put | Example |
|---|---|---|
| TITLE | Short, plain title | `Set Up a GitLab CI Runner` |
| SUBTITLE | One sentence: what they'll have at the end | `A working runner that builds your project automatically.` |
| VERSION_TAG | Version + date + what you verified against | `v1.0 — Jun 2026 — verified against GitLab 17.x` |
| STORE_PREFIX | Unique localStorage prefix on `<body data-store="...">`, slug + `_`, no spaces | `wt_gitlab_runner_` |

The storage prefix lives only in the HTML (on `<body data-store>`); `app.js` reads it
from there, which is why `app.js` never needs editing. Make the prefix unique per
walkthrough so two guides open in the same browser never collide.

To brand the page X, change the theme link in `<head>` from
`./artifacts/theme-neutral.css` to `./artifacts/theme-x.css`.

---

## 3. The localStorage scheme

Everything is namespaced under the `data-store` prefix. Three key shapes:

- `<prefix>check_<step-id>` -> `"true"` / `"false"` (one per checkbox)
- `<prefix>var_<NAME>` -> the saved value (one per captured value)
- `<prefix>theme` -> `"light"` / `"dark"` (set only once the reader clicks the toggle)

No server, no network call, nothing transmitted. `resetAll()` clears only keys that
start with this walkthrough's prefix.

---

## 4. Component catalog

### Section (collapsible, with a completion badge)
Number sections sequentially. `data-section`, `id="sn-N"`, and `id="sb-N"` use the same N.

```html
<div class="section" data-section="3">
  <div class="section-header" onclick="toggleSection(this)">
    <div class="section-number" id="sn-3">3</div>
    <div class="section-title">Section title in plain words</div>
    <span class="section-toggle">&#9660;</span>
  </div>
  <div class="section-body" id="sb-3">
    <!-- steps -->
  </div>
</div>
```

### Step (checkbox + content)
`data-step` unique; convention `"<section>-<step>"`, e.g. `"3-2"`.

```html
<div class="step">
  <input type="checkbox" class="step-check" data-step="3-2" onchange="saveCheck(this)">
  <div class="step-content">
    <p><strong>Do the thing.</strong> Plain instruction here.</p>
  </div>
</div>
```

### Code block (copy button copies the resolved text, incl. filled references)
```html
<div class="code-block">
  <span class="code-lang">PowerShell</span>
  <button class="btn-copy" onclick="copyCode(this)">Copy</button>
<pre>npm install</pre>
</div>
```

### Callouts — `tip` (blue), `warn` (amber), `danger` (red), `success` (green)
```html
<div class="callout warn"><span class="callout-icon">!</span>Heads up about a common mistake.</div>
```

### Access / permission gotcha — always say who to ask or what to do
```html
<div class="access-note"><strong>Don't see this option?</strong> It requires the Admin role.
Ask your workspace Owner to enable it, or request elevated access through your IT portal.</div>
```

### Troubleshooting drawer (collapsed by default)
```html
<details class="troubleshoot">
  <summary>Exact error message the reader might see</summary>
  <div class="ts-body"><p>What it means and how to fix it.</p></div>
</details>
```

### Info table
```html
<table class="info-table">
  <tr><th>Setting</th><th>Value</th></tr>
  <tr><td>Node</td><td><code>v20 LTS</code> (or latest LTS)</td></tr>
</table>
```

---

## 5. Live variable references — the headline feature

A **capture** is where the reader records a value; a **reference** shows it back,
read-only, in fixed-width style, wherever it's needed later. They link by a shared
NAME (uppercase with underscores).

**Capture** — in the step where the value first appears (mask secrets with `type="password"`):
```html
<div class="capture">
  <label>RUNNER_TOKEN</label>
  <div class="capture-row">
    <input data-var="RUNNER_TOKEN" type="password" placeholder="paste it here right away" oninput="saveVar(this)">
    <button class="btn-copy-var" onclick="copyVar(this)" title="Copy">Copy</button>
  </div>
  <p class="hint">Why it matters / where it came from.</p>
</div>
```

**One value per field (multi-field group).** Never ask for several things in one box.
If a step yields more than one value, give each its own labeled field. They lay out
side by side and wrap to stacked automatically when the screen is narrow:

```html
<div class="capture">
  <label>Movers (record all three)</label>            <!-- optional group title -->
  <div class="capture-grid">
    <div class="field">
      <span class="field-label">MOVER_NAME</span>
      <div class="capture-row">
        <input data-var="MOVER_NAME" placeholder="company or rental" oninput="saveVar(this)">
        <button class="btn-copy-var" onclick="copyVar(this)" title="Copy">📋</button>
      </div>
    </div>
    <div class="field">
      <span class="field-label">CONFIRMATION</span>
      <div class="capture-row">
        <input data-var="MOVER_CONFIRMATION" placeholder="confirmation #" oninput="saveVar(this)">
        <button class="btn-copy-var" onclick="copyVar(this)" title="Copy">📋</button>
      </div>
    </div>
    <div class="field">
      <span class="field-label">MOVE_DATE</span>
      <div class="capture-row">
        <input type="date" data-var="MOVE_DATE" oninput="saveVar(this)">
        <button class="btn-copy-var" onclick="copyVar(this)" title="Copy">📋</button>
      </div>
    </div>
  </div>
</div>
```

Each `field-label` names exactly the one value in that box, and each placeholder
describes only that box — the label and placeholder must never ask for more than the
single value the field holds. A single-value capture still uses the simple form above
(its `<label>` is the field label; no `.capture-grid` needed).

**Dates use a real date picker.** For any date, use `type="date"`. It shows a calendar
popup, stores and displays the value as ISO 8601 (`YYYY-MM-DD`), and the picker matches
the active light/dark theme. A live reference to a date therefore shows `YYYY-MM-DD`
automatically. Don't add a placeholder to a date input — browsers ignore it; rely on the
label.

```html
<div class="capture">
  <label>CLOSING_DATE</label>
  <div class="capture-row">
    <input type="date" data-var="CLOSING_DATE" oninput="saveVar(this)">
    <button class="btn-copy-var" onclick="copyVar(this)" title="Copy">📋</button>
  </div>
</div>
```

**Reference** — anywhere later, including inside `<pre>` code:
```html
Enter <span class="var-ref" data-ref="RUNNER_TOKEN" data-empty="(RUNNER_TOKEN - set it in step 2.1)"></span> when prompted.
```

Rules:
- `data-ref` must equal the capture's `data-var`.
- Always give a `data-empty` that names *where the value comes from*, so an unfilled
  reference still guides the reader.
- A filled reference is clickable to copy; an empty one is dimmed and inert.
- Editing the value anywhere updates every copy and every reference instantly.
- Put a value in the panel (section 7) only if it's reused or needed throughout; a
  one-off capture can live in its step alone.

This is what lets a later step read *"Enter `1234-ABCD` for the key"* with the
reader's own saved value filled in automatically.

---

## 6. Images

Wired in by you (Claude) **after the maker uploads them in chat and approves a
sample** — never invented. Each image lives in `./artifacts/`, displays at content
width when wider / centered when narrower (CSS handles both), and links to the
untouched original opening in a new tab.

```html
<figure class="step-figure">
  <a href="./artifacts/step-3-2.png" target="_blank" rel="noopener">
    <img src="./artifacts/step-3-2.png" alt="What the reader should see on screen">
  </a>
  <figcaption>One line describing what to look at. Click to view full size.</figcaption>
</figure>
```

Name images `step-<section>-<step>.png` so they trace back to steps. Keep the
maker's original untouched in `artifacts/`; the page only *displays* it smaller.
Write a real, descriptive `alt` — it doubles as accessibility text and as the
fallback if a file is missing.

When you flag image-needed steps, surface each step's image description with its
suggested generation prompt **inline in chat** so the maker can generate and return the
image, and also generate an `image-prompts.html` sheet from
`assets/image-prompts-template.html` (same prompts, copy buttons) for reuse. The
distributable `.zip` holds only `walkthrough.html` + `artifacts/`; keep
`image-prompts.html` and the preview in the output root, never in the zip. See
`authoring-process.md` for the full flow.

---

## 7. The floating value panel

The `<aside class="panel">` holds values worth keeping in view. At >=1200px it becomes
a sticky right-hand rail ("if there's room"); below that it collapses to the top of
the content. The CSS grid in `.layout` does this automatically — just populate
`.panel-body` with one `.var-row` per value, matching `data-var` names to your
captures and references. Keep it short.

---

## 8. Theming and branding (two palette files)

Structure lives in `base.css`; **palette and fonts live in a theme file**. The HTML
links `base.css` plus exactly **one** theme:

- `theme-neutral.css` — neutral/professional palette (default).
- `theme-x.css` — X palette (Magenta `#E20074`, Berry
  `#861B54`, TeleNeo font, italics disabled). When a maker wants it, switch the
  `<link>` href and consult the X brand guidelines skill if it is installed.

Each theme file defines both light and dark variable sets. The page defaults to the
reader's system setting and remembers a manual toggle choice. To create a new brand,
copy a theme file and change `--accent`, `--accent-2`, the fonts, and the
`--accent-soft`/`--accent-line` tints — `base.css` needs no edits.

---

## 9. JSON / data files (the file:// caveat)

The `artifacts` folder can hold JSON, but **browsers block `fetch()` of a local
`.json` file over `file://`**. So:

- If a walkthrough is data-driven and must work as a double-clicked local file, ship
  the data as **`artifacts/data.js`** that assigns a global, e.g.
  `window.WT_DATA = { ... };`, and load it with `<script src="./artifacts/data.js">`
  before `app.js`. This works locally and hosted.
- A fetched `.json` is fine **only** when the walkthrough is always served over
  http(s). If you use one, say so in the version tag/notes.

Most walkthroughs need no data file at all — the content is in the HTML.

---

## 10. When (and only when) to add a service worker

Default: **do not add one.** localStorage already persists progress and values across
reloads and restarts. A service worker earns its place only if the maker explicitly
needs a **hosted** copy to keep loading after the network drops. It will **not** run
from `file://` (it requires http(s)), so for a local-file walkthrough it adds
nothing — skip it. If justified, register a tiny same-origin worker that pre-caches
the HTML and the `artifacts` folder, nothing more.

---

## 11. Self-check before you hand it over

- [ ] Every token placeholder replaced; top comment and DEMO blocks deleted.
- [ ] `base.css` + exactly one theme file + `app.js` linked with `./artifacts/` paths.
- [ ] Every `data-ref` has a matching `data-var`; every `data-empty` names its source.
- [ ] `data-step` values unique; `data-section`/`sn-N`/`sb-N` agree.
- [ ] No `type="module"`, no local `fetch()`, no cross-origin font/CSS/JS.
- [ ] Secrets captured with `type="password"`.
- [ ] No field asks for more than one value; multi-value steps use a `.capture-grid` with one labeled `.field` per value.
- [ ] Every date uses `<input type="date">` (calendar popup, ISO `YYYY-MM-DD`).
- [ ] Every access-gated action has an `.access-note` (who to ask / what to do).
- [ ] Versions pinned per `authoring-process.md`.
- [ ] Reading level: a sharp 13-year-old could follow it; jargon correct and, on
      first use, briefly explained.
- [ ] A single-file `merged-walkthrough.html` was produced alongside the structured
      output, built from the finished version (section 12), and opens/behaves identically.

---

## 12. Single-file merged build (`merged-walkthrough.html`)

Alongside the structured `walkthrough.html` + `artifacts/` output, **always also produce
`merged-walkthrough.html`**: the exact same finished walkthrough with every external file
folded inline, so it travels as one self-contained file. The structured form stays the
default (clean folder, and you can host several walkthroughs on one site sharing one
`artifacts/`); the merged form is for when a single portable file is easier — emailing it,
pasting it into a wiki, or dropping it somewhere that can't serve a folder.

Build it **from the finished structured version**, never authored separately, so the two
never drift. The merge is purely mechanical — no content, token, or structural changes:

- **CSS.** Replace the two `<link rel="stylesheet">` tags (`base.css`, then the one chosen
  theme file) with `<style>` blocks holding those files' contents verbatim, in that order so
  the cascade matches. The light/dark toggle keeps working untouched: `app.js` flips the
  `data-theme` attribute on `<html>`, and each theme file already defines both light and dark
  variable sets — nothing swaps a `<link>`, so inlining changes nothing about theming.
- **JS.** Replace `<script src="./artifacts/app.js"></script>` with a `<script>` block holding
  `app.js` verbatim, in the same end-of-`<body>` position. If the guide ships
  `artifacts/data.js` (section 9), inline it as a `<script>` immediately **before** the
  `app.js` block.
- **Images.** For each wired image, embed the file as a base64 `data:` URI in **both** the
  `<img src>` and the enclosing `<a href>`, so click-to-open-full-size still works with no
  `artifacts/` folder present. Skipped and placeholder steps need nothing. This is the one
  case where the file grows large — that's the expected trade for true single-file portability.
- **Leave everything else identical:** `<body data-store="...">`, all filled tokens, the
  localStorage scheme, every `data-var`/`data-ref`, structure, and content are unchanged.

Because the same CSS and `app.js` run — only their delivery changed — the merged file keeps
every behavior of the structured one: saved progress, live references, theming, copy buttons,
reset. Present it on its own; it needs no zip (it is already one portable file). The
structured `.zip` stays exactly as defined — only `walkthrough.html` + `artifacts/`, and the
merged file is **never** placed inside it.
