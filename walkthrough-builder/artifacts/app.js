/* ════════════════════════════════════════════════════════════════════════
   app.js — walkthrough behavior (no external dependencies; file:// safe)
   Generic and copied verbatim into every walkthrough. The per-walkthrough
   localStorage prefix is read from <body data-store="...">, so this file
   never needs editing.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var STORE = (document.body.getAttribute("data-store") || "wt_") ;

  /* ── Checkboxes ── */
  window.saveCheck = function (el) {
    localStorage.setItem(STORE + "check_" + el.dataset.step, el.checked);
    updateProgress();
  };
  function loadChecks() {
    document.querySelectorAll(".step-check").forEach(function (el) {
      if (localStorage.getItem(STORE + "check_" + el.dataset.step) === "true") el.checked = true;
    });
    updateProgress();
  }

  /* ── Variables + live references ── */
  function refreshRefs(name, value) {
    document.querySelectorAll('.var-ref[data-ref="' + CSS.escape(name) + '"]').forEach(function (s) {
      if (value && value.trim() !== "") { s.textContent = value; s.classList.remove("empty"); }
      else { s.textContent = s.getAttribute("data-empty") || "‹not set yet›"; s.classList.add("empty"); }
    });
  }
  window.saveVar = function (el) {
    var name = el.dataset.var, val = el.value;
    localStorage.setItem(STORE + "var_" + name, val);
    document.querySelectorAll('[data-var="' + CSS.escape(name) + '"]').forEach(function (i) {
      if (i !== el && i.value !== val) i.value = val;
    });
    refreshRefs(name, val);
  };
  function loadVars() {
    var names = new Set();
    document.querySelectorAll("[data-var]").forEach(function (i) { names.add(i.dataset.var); });
    document.querySelectorAll(".var-ref[data-ref]").forEach(function (s) { names.add(s.dataset.ref); });
    names.forEach(function (n) {
      var saved = localStorage.getItem(STORE + "var_" + n) || "";
      document.querySelectorAll('[data-var="' + CSS.escape(n) + '"]').forEach(function (i) { i.value = saved; });
      refreshRefs(n, saved);
    });
  }
  window.copyVar = function (btn) {
    var input = btn.closest(".var-row, .capture-row").querySelector("input");
    if (input && input.value) { navigator.clipboard.writeText(input.value); flash(btn, "✓", "📋"); }
  };
  /* click a filled reference to copy its resolved value */
  document.addEventListener("click", function (e) {
    var ref = e.target.closest(".var-ref");
    if (ref && !ref.classList.contains("empty")) { navigator.clipboard.writeText(ref.textContent); }
  });

  /* ── Copy code (copies resolved text, including filled-in references) ── */
  window.copyCode = function (btn) {
    var pre = btn.closest(".code-block").querySelector("pre");
    navigator.clipboard.writeText(pre.textContent);
    flash(btn, "Copied!", "Copy");
  };
  function flash(btn, on, off) { btn.textContent = on; setTimeout(function () { btn.textContent = off; }, 1400); }

  /* ── Progress + section badges ── */
  function updateProgress() {
    var checks = document.querySelectorAll(".step-check");
    var done = [].slice.call(checks).filter(function (c) { return c.checked; }).length;
    var pct = checks.length ? Math.round(done / checks.length * 100) : 0;
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressPct").textContent = pct + "%";
    document.querySelectorAll(".section").forEach(function (sec) {
      var sc = sec.querySelectorAll(".step-check");
      var sd = [].slice.call(sc).filter(function (c) { return c.checked; }).length;
      var badge = document.getElementById("sn-" + sec.dataset.section);
      if (badge) {
        if (sc.length > 0 && sd === sc.length) { badge.classList.add("done"); badge.textContent = "✓"; }
        else { badge.classList.remove("done"); badge.textContent = sec.dataset.section; }
      }
    });
  }

  /* ── Collapsers ── */
  window.toggleSection = function (h) {
    h.nextElementSibling.classList.toggle("hidden");
    h.querySelector(".section-toggle").classList.toggle("collapsed");
  };
  window.togglePanel = function (h) {
    document.getElementById("panelBody").classList.toggle("hidden");
    h.classList.toggle("collapsed");
  };

  /* ── Theme: default to system, allow manual override, react to system changes ── */
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); updateThemeBtn(); }
  function updateThemeBtn() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var i = document.getElementById("themeIcon"), l = document.getElementById("themeLabel");
    if (i) i.textContent = dark ? "☀️" : "🌙";
    if (l) l.textContent = dark ? "Light" : "Dark";
  }
  function initTheme() {
    var saved = localStorage.getItem(STORE + "theme");
    applyTheme(saved ? saved : (mq.matches ? "dark" : "light"));
  }
  window.toggleTheme = function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(STORE + "theme", next);
    applyTheme(next);
  };
  mq.addEventListener("change", function (e) {
    if (!localStorage.getItem(STORE + "theme")) applyTheme(e.matches ? "dark" : "light");
  });

  /* ── Reset ── */
  window.resetAll = function () {
    if (!confirm("Reset all progress and saved values in this browser?")) return;
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf(STORE) === 0) localStorage.removeItem(k); });
    document.querySelectorAll(".step-check").forEach(function (c) { c.checked = false; });
    document.querySelectorAll("[data-var]").forEach(function (i) { i.value = ""; });
    document.querySelectorAll(".var-ref").forEach(function (s) {
      s.textContent = s.getAttribute("data-empty") || "‹not set yet›"; s.classList.add("empty");
    });
    updateProgress();
  };

  /* ── Init ── */
  initTheme();
  loadChecks();
  loadVars();
})();
