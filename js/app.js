/* AutoLab — ứng dụng tĩnh, không build, không backend */
(function () {
  "use strict";

  const DB = window.AUTOLAB;
  if (!DB) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVGNS = "http://www.w3.org/2000/svg";
  const PROGRESS_KEY = "autolab:progress:v1";
  const THEME_KEY = "autolab:theme";
  const LAST_KEY = "autolab:last-lesson";
  const MISSIONS_KEY = "autolab:missions:v1";
  const AUTO_MS = 7600;

  const ICON_PATHS = {
    process: '<rect x="3" y="3.4" width="14" height="13.2" rx="3"/><circle cx="10" cy="10" r="3"/><path d="M10 6.8V4.4M10 15.6v-2.4M6.8 10H4.4M15.6 10h-2.4"/>',
    thread: '<path d="M3 6.2h5.4a3.2 3.2 0 0 1 3.2 3.2v1.2a3.2 3.2 0 0 0 3.2 3.2H17"/><path d="M3 13.8h5.4a3.2 3.2 0 0 0 3.2-3.2v-1.2a3.2 3.2 0 0 1 3.2-3.2H17"/>',
    pcb: '<rect x="3" y="2.8" width="14" height="14.4" rx="2"/><circle cx="7.2" cy="6.8" r="1.6"/><path d="M10.2 6.2h4M10.2 9h4M5.2 12.2h9.4M5.2 14.8h6"/>',
    cpu: '<rect x="5" y="5" width="10" height="10" rx="2"/><rect x="8" y="8" width="4" height="4" rx="1"/><path d="M8 2.5V5M12 2.5V5M8 15v2.5M12 15v2.5M2.5 8H5M2.5 12H5M15 8h2.5M15 12h2.5"/>',
    memory: '<rect x="2.6" y="6" width="14.8" height="8" rx="1.8"/><path d="M6 6v8M10 6v8M14 6v8M5 3.6V6M9 3.6V6M13 3.6V6M5 14v2.4M9 14v2.4M13 14v2.4"/>',
    queue: '<rect x="2.6" y="4" width="14.8" height="3.6" rx="1.2"/><rect x="2.6" y="8.2" width="14.8" height="3.6" rx="1.2"/><rect x="2.6" y="12.4" width="14.8" height="3.6" rx="1.2"/>',
    disk: '<ellipse cx="10" cy="5" rx="6.2" ry="2.4"/><path d="M3.8 5v10c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4V5M3.8 10c0 1.3 2.8 2.4 6.2 2.4s6.2-1.1 6.2-2.4"/>',
    kernel: '<path d="m10 2.2 6.2 2.5v5.1c0 3.7-2.6 6.8-6.2 8.1-3.6-1.3-6.2-4.4-6.2-8.1V4.7Z"/><path d="m7 10 2.1 2.1 4-4.2"/>',
    syscall: '<path d="M3 10h9.4M9 6.2 12.8 10 9 13.8M14.8 4.2h2.4v11.6h-2.4"/>',
    user: '<circle cx="10" cy="6.5" r="3.2"/><path d="M4 17c.6-3.2 3-5 6-5s5.4 1.8 6 5"/>',
    lock: '<rect x="4.4" y="8.6" width="11.2" height="8.6" rx="2"/><path d="M7 8.6V6.4a3 3 0 0 1 6 0v2.2M10 12v2.2"/>',
    star: '<path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L2.2 7.7l5.4-.8z"/>',
    timeline: '<rect x="2.8" y="4" width="5" height="4.2" rx="1"/><rect x="7.6" y="11.6" width="5.6" height="4.2" rx="1"/><rect x="12.4" y="4" width="4.8" height="4.2" rx="1"/>',
    alert: '<path d="M10 2.8 18.2 17H1.8Z"/><path d="M10 7.6v4.2M10 14.4h.01"/>',
    page: '<path d="M5 2.8h7l3 3v11.4H5Z"/><path d="M12 2.8v3h3M7.4 9h5.2M7.4 11.8h5.2M7.4 14.4h3.2"/>',
    tlb: '<rect x="2.6" y="5.4" width="14.8" height="9.6" rx="2"/><path d="M2.6 9h14.8M7 9v6M12 9v6"/><path d="M12.4 2.4 9.6 6M15.4 2.4l-2.8 3.6"/>',
    swap: '<path d="M3 7h11M11 4l3 3-3 3M17 13H6M9 10l-3 3 3 3"/>',
    inode: '<path d="M3 8.4V4h4.4L17 13.4 13.4 17Z"/><circle cx="6.6" cy="6.6" r="1.4"/>',
    folder: '<path d="M2.8 5.6a2 2 0 0 1 2-2h3.2l2 2.2h5.2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4.8a2 2 0 0 1-2-2Z"/>',
    shell: '<rect x="2.6" y="3.6" width="14.8" height="12.8" rx="2"/><path d="m6 8 2.2 2.2L6 12.4M10.6 12.6h4"/>',
    pipe: '<rect x="2.4" y="7.4" width="5.2" height="5.2" rx="1.2"/><rect x="12.4" y="7.4" width="5.2" height="5.2" rx="1.2"/><path d="M7.6 10h4.8"/>',
    shield: '<path d="M10 2.4 17 5v5.4c0 3.8-2.8 6.9-7 7.6-4.2-.7-7-3.8-7-7.6V5Z"/>',
    mmu: '<rect x="4" y="4" width="12" height="12" rx="2"/><path d="M7 7h6v6H7zM10 2v2M10 16v2M2 10h2M16 10h2"/>',
    grid: '<rect x="2.8" y="3.2" width="14.4" height="13.6" rx="1.6"/><path d="M2.8 7.7h14.4M2.8 12.2h14.4M7.6 3.2v13.6M12.4 3.2v13.6"/>',
    clock: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4.4l3 1.8"/>',
    book: '<path d="M3 4.5h5.5A2.5 2.5 0 0 1 11 7v9a2.5 2.5 0 0 0-2.5-2H3zM17 4.5h-3.5A2.5 2.5 0 0 0 11 7v9a2.5 2.5 0 0 1 2.5-2H17z"/>',
    file: '<path d="M5 2.5h8a2 2 0 0 1 2 2v13H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm3 4h4M8 10h4M8 13.5h2.5"/>',
    bulb: '<path d="M7.2 14.2h5.6M8 17h4M10 2.5a5 5 0 0 0-3 9v1.7h6V11.5a5 5 0 0 0-3-9Z"/>',
    check: '<path d="m4 10 4 4 8-8"/>',
    code: '<path d="m7 5-4 5 4 5M13 5l4 5-4 5"/>',
    letter: '<rect x="3" y="3.2" width="14" height="13.6" rx="3"/><path d="M8 12.8V9.4a2 2 0 0 1 4 0v3.4M12 10.6H9.2"/>',
    string: '<circle cx="4.2" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="15.8" cy="10" r="1.5"/><path d="M5.7 10h2.8M11.5 10h2.8"/>',
    language: '<path d="M6.2 3.2c-1.9 0-2.4 1.1-2.4 2.6v1.8c0 1.1-.6 1.9-1.7 2.4 1.1.5 1.7 1.3 1.7 2.4v1.8c0 1.5.5 2.6 2.4 2.6M13.8 3.2c1.9 0 2.4 1.1 2.4 2.6v1.8c0 1.1.6 1.9 1.7 2.4-1.1.5-1.7 1.3-1.7 2.4v1.8c0 1.5-.5 2.6-2.4 2.6"/><path d="M8.4 10h3.2"/>',
    regex: '<path d="M3.4 6.4h5.2M6 3.8v5.2"/><path d="m13.2 3.2.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M3.4 14.2h9.2M14.6 12l3 4.4M17.6 12l-3 4.4"/>',
    dfa: '<circle cx="7" cy="11" r="3.8"/><circle cx="14.6" cy="11" r="2.8"/><path d="M1.6 11h1.4M10.8 11h.8M15.8 8.2V5.4M13.6 6.8 15.8 5l2.2 1.8"/>',
    nfa: '<circle cx="5.6" cy="10" r="3"/><path d="M8.6 10l4.6-4.4M8.6 10l4.6 4.4"/><circle cx="15.4" cy="5.2" r="2.4"/><circle cx="15.4" cy="14.8" r="2.4"/>',
    eps: '<path d="M5.6 15c.9-4.8 3.1-8.6 5.3-8.6 1.7 0 2.6 1.5 2.6 3.5 0 2.6-1.6 4.7-3.4 4.7-1.7 0-2.6-1.5-2.6-3.5 0-.5.1-1 .2-1.4"/>',
    pump: '<path d="M4.2 16V9.6a3.4 3.4 0 0 1 3.4-3.4h2.6M4.2 16h9.6"/><circle cx="13.4" cy="12.6" r="3.2"/><path d="M13.4 11v1.7l1.3.8"/>',
    grammar: '<path d="M3 4.6h5M3 8.8h7M3 13h5M3 16.4h7"/><path d="M11 10.6h2.6M16.4 6.6v8"/><path d="M11.8 8.6 13.8 10.6l-2 2"/>',
    derivation: '<path d="M10 4v4M10 8 5.6 13M10 8l4.4 5"/><circle cx="10" cy="3.2" r="1.6"/><circle cx="5.4" cy="14.4" r="1.6"/><circle cx="14.6" cy="14.4" r="1.6"/>',
    stack: '<rect x="4.6" y="8.6" width="10.8" height="3.2" rx="1"/><rect x="4.6" y="12.2" width="10.8" height="3.2" rx="1"/><rect x="4.6" y="5" width="10.8" height="3.2" rx="1"/><path d="M10 1.8v2.4"/>',
    accept: '<circle cx="10" cy="10" r="6.8"/><path d="m6.6 10 2.3 2.3 4.5-4.8"/>',
    reject: '<circle cx="10" cy="10" r="6.8"/><path d="m7.3 7.3 5.4 5.4M12.7 7.3l-5.4 5.4"/>',
    merge: '<circle cx="4.6" cy="10" r="2.4"/><circle cx="14.8" cy="5.6" r="2.4"/><circle cx="14.8" cy="14.4" r="2.4"/><path d="M7 10h4.2M11.2 8.6l2-1.6M11.2 11.4l2 1.6"/>',
    parse: '<rect x="2.8" y="3.8" width="6" height="5" rx="1.2"/><rect x="11.2" y="3.8" width="6" height="5" rx="1.2"/><rect x="7" y="11.2" width="6" height="5" rx="1.2"/><path d="M5.8 8.8v1.2h4M14.2 8.8v1.2h-1.2"/>',
    table: '<rect x="2.8" y="3.6" width="14.4" height="12.8" rx="1.6"/><path d="M2.8 7.6h14.4M7.4 7.6v8.8M12.6 7.6v8.8"/>',
    tape: '<path d="M2.4 5.8h15.2v8.4H2.4z"/><path d="M6.2 5.8v8.4M10 5.8v8.4M13.8 5.8v8.4"/><rect x="8.5" y="8" width="3" height="4" rx=".6"/>',
    tm: '<path d="M2.4 4.8h15.2v7.2H2.4z"/><path d="M6 12v2.8h8V12"/><rect x="8.4" y="6.6" width="3.2" height="3.6" rx=".6"/>',
    start: '<circle cx="10.4" cy="10" r="4.6"/><path d="M1.8 10h3.6M3.6 8.2 5.4 10l-1.8 1.8"/>',
    plus: '<path d="M10 4v12M4 10h12"/>',
    minus: '<path d="M4 10h12"/>'
  };

  const UI_ICONS = {
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 3.5 16 10 6.5 16.5Z"/></svg>',
    pause: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3.5h3.5v13H5zM11.5 3.5H15v13h-3.5z"/></svg>',
    replay: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5V7h3.5"/></svg>',
    prev: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>',
    next: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>',
    full: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4"/></svg>',
    info: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M10 9v4.5M10 6.5h.01"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>',
    arrow: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12"/></svg>',
    minus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12"/></svg>',
    left: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg>',
    right: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>',
    trash: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 3.5h4M6 6l.8 11h6.4L14 6M8.5 9v5M11.5 9v5"/></svg>',
    search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="m13.2 13.2 3.8 3.8"/></svg>'
  };

  const TONE_COLORS = {
    blue: "var(--blue)",
    coral: "var(--coral)",
    green: "var(--green)",
    violet: "var(--violet)",
    yellow: "var(--yellow)",
    mint: "var(--mint)"
  };

  const TONE_SWATCH = {
    blue: "var(--blue-soft)",
    coral: "var(--coral-soft)",
    green: "var(--green-soft)",
    violet: "var(--violet-soft)",
    yellow: "var(--yellow-soft)",
    mint: "var(--mint-soft)"
  };

  const NODE_TONES = {
    process: "blue",
    thread: "coral",
    pcb: "violet",
    cpu: "blue",
    memory: "green",
    queue: "yellow",
    disk: "coral",
    kernel: "violet",
    syscall: "yellow",
    user: "mint",
    lock: "coral",
    star: "yellow",
    timeline: "violet",
    alert: "coral",
    page: "green",
    tlb: "violet",
    swap: "yellow",
    inode: "violet",
    folder: "yellow",
    shell: "green",
    pipe: "violet",
    shield: "green",
    mmu: "violet",
    grid: "blue",
    clock: "yellow",
    book: "blue",
    file: "green",
    bulb: "yellow",
    check: "green",
    code: "blue",
    letter: "blue",
    string: "mint",
    language: "violet",
    regex: "yellow",
    dfa: "blue",
    nfa: "violet",
    eps: "yellow",
    pump: "coral",
    grammar: "green",
    derivation: "blue",
    stack: "coral",
    accept: "green",
    reject: "coral",
    merge: "yellow",
    parse: "blue",
    table: "violet",
    tape: "green",
    tm: "violet",
    start: "mint",
    plus: "green",
    minus: "coral"
  };

  const view = $("#view");
  const sidebarNav = $("#sidebarNav");
  const searchModal = $("#searchModal");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");
  const toastEl = $("#toast");

  const state = {
    route: { view: "home" },
    progress: loadProgress(),
    lesson: { id: null, step: 1, playing: false, speed: 1, timer: null },
    practice: null,
    lab: null,
    cheat: { section: "regex", query: "" },
    search: { items: [], selected: 0, modalOpen: false },
    diagram: null,
    revealObserver: null
  };

  const moduleMap = {};
  const lessonList = [];
  DB.modules.forEach((m) => {
    moduleMap[m.id] = m;
    m.lessons.forEach((id) => {
      const lesson = DB.lessons[id];
      if (!lesson) return;
      lesson.module = m.id;
      lessonList.push(lesson);
    });
  });
  const lessonById = DB.lessons;
  const totalLessons = lessonList.length;
  const totalSteps = lessonList.reduce((sum, l) => sum + l.steps.length, 0);

  let searchIndex = [];
  let toastTimer = null;
  let sidebarReturnFocus = null;

  /* ----------------------------------------------------------
     Utilities
     ---------------------------------------------------------- */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  function formatInt(n) {
    return Math.round(n).toLocaleString("vi-VN");
  }

  function iconMarkup(name, cls) {
    const inner = ICON_PATHS[name] || ICON_PATHS.info;
    return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }

  function toneVars(tone) {
    const t = TONE_COLORS[tone] ? tone : "blue";
    return `--mc:${TONE_COLORS[t]};--mc-soft:${TONE_SWATCH[t]}`;
  }

  function nodeTone(type) {
    return NODE_TONES[type] || "blue";
  }

  function nodeToneVars(type) {
    const t = nodeTone(type);
    return `--tone:${TONE_COLORS[t]};--tone-soft:${TONE_SWATCH[t]}`;
  }

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return raw && typeof raw === "object" ? raw : {};
    } catch (err) {
      return {};
    }
  }

  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); } catch (err) { /* private mode */ }
  }

  function isComplete(id) {
    const lesson = lessonById[id];
    if (!lesson) return false;
    return (state.progress[id] || 0) >= lesson.steps.length;
  }

  function savedStep(id) {
    const lesson = lessonById[id];
    if (!lesson) return 1;
    return clamp(state.progress[id] || 1, 1, lesson.steps.length);
  }

  function completedCount() {
    return lessonList.filter((l) => isComplete(l.id)).length;
  }

  function nextLessonOf(id) {
    const idx = lessonList.findIndex((l) => l.id === id);
    return idx >= 0 ? lessonList[idx + 1] || null : null;
  }

  function resumeLesson() {
    try {
      const last = localStorage.getItem(LAST_KEY);
      if (last && lessonById[last]) return lessonById[last];
    } catch (err) { /* ignore */ }
    return lessonList.find((l) => !isComplete(l.id)) || lessonList[0];
  }

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  function navigate(hash) {
    if (location.hash === hash) {
      onRoute();
    } else {
      location.hash = hash;
    }
  }

  /* ----------------------------------------------------------
     Theme
     ---------------------------------------------------------- */
  function initTheme() {
    let theme = "light";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "dark" || stored === "light") theme = stored;
    } catch (err) { /* ignore */ }
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#080f19" : "#0c1624");
  }

  function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#080f19" : "#0c1624");
  }

  /* ----------------------------------------------------------
     Chrome / sidebar
     ---------------------------------------------------------- */
  function updateChrome() {
    const completed = completedCount();
    const pct = totalLessons ? completed / totalLessons : 0;
    const ring = $("#ringFill");
    if (ring) ring.style.strokeDashoffset = String(91.1 * (1 - pct));
    const globalText = $("#globalProgressText");
    if (globalText) globalText.textContent = `${completed}/${totalLessons}`;
    const sideFill = $("#sidebarProgressFill");
    if (sideFill) sideFill.style.width = `${Math.round(pct * 100)}%`;
    const sideText = $("#sidebarProgressText");
    if (sideText) sideText.textContent = `${completed}/${totalLessons} bài`;

    $$(".mode-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.mode === state.route.view);
    });
    renderSidebar();
  }

  function renderSidebar() {
    if (!sidebarNav) return;
    const activeId = state.route.view === "learn" ? state.route.lessonId : null;
    sidebarNav.innerHTML = DB.modules.map((m) => {
      const moduleLessons = m.lessons
        .map((id) => lessonById[id])
        .filter(Boolean);
      if (!moduleLessons.length) return "";
      return `
        <div class="side-module">
          <div class="side-module-head">
            <span class="side-module-num">${esc(m.num)}</span>
            <span>${esc(m.title)}</span>
          </div>
          ${moduleLessons.map((lesson) => {
            const done = isComplete(lesson.id);
            const active = lesson.id === activeId;
            const step = savedStep(lesson.id);
            return `
              <a class="side-lesson${active ? " is-active" : ""}${done ? " is-done" : ""}"
                 href="#/learn/${esc(lesson.id)}/${step}" data-lesson-link>
                <span class="side-lesson-num">${done ? "✓" : lessonList.indexOf(lesson) + 1}</span>
                <span class="side-lesson-body">
                  <span class="side-lesson-title">${esc(lesson.title)}</span>
                  <span class="side-lesson-meta">${esc(lesson.duration)} · ${lesson.steps.length} bước</span>
                </span>
              </a>`;
          }).join("")}
        </div>`;
    }).join("");
  }

  function openSidebar() {
    sidebarReturnFocus = document.activeElement;
    document.body.classList.add("sidebar-open");
    $("#sidebarScrim").hidden = false;
    $("#menuBtn").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    $("#sidebarScrim").hidden = true;
    $("#menuBtn").setAttribute("aria-expanded", "false");
    if (sidebarReturnFocus && typeof sidebarReturnFocus.focus === "function") sidebarReturnFocus.focus();
    sidebarReturnFocus = null;
  }

  function toggleSidebar() {
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
    else openSidebar();
  }

  function syncTopbarOffset() {
    const bar = document.querySelector(".topbar");
    if (!bar) return;
    document.documentElement.style.setProperty("--topbar-offset", `${bar.offsetHeight}px`);
  }

  /* ----------------------------------------------------------
     Router
     ---------------------------------------------------------- */
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    if (!parts.length) return { view: "home" };
    if (parts[0] === "learn") {
      if (!parts[1]) return { view: "learn", lessonId: null, step: 1 };
      const lesson = lessonById[parts[1]];
      if (!lesson) return { view: "missing" };
      const step = clamp(parseInt(parts[2] || "1", 10) || 1, 1, lesson.steps.length);
      return { view: "learn", lessonId: lesson.id, step };
    }
    if (parts[0] === "practice") return { view: "practice" };
    if (parts[0] === "lab") return { view: "lab" };
    if (parts[0] === "cheatsheets") {
      const section = DB.cheatsheets.find((s) => s.id === parts[1]);
      return { view: "cheatsheets", section: section ? section.id : null };
    }
    return { view: "missing" };
  }

  function onRoute() {
    const route = parseRoute();
    if (route.view === "learn" && !route.lessonId) {
      const resume = resumeLesson();
      if (resume) {
        const step = savedStep(resume.id);
        location.hash = `#/learn/${resume.id}/${step}`;
        return;
      }
    }
    if (route.view === "cheatsheets") {
      const valid = route.section || (DB.cheatsheets.some((s) => s.id === state.cheat.section) ? state.cheat.section : DB.cheatsheets[0].id);
      state.cheat.section = valid;
    }
    state.route = route;
    stopPlayer();
    document.body.dataset.view = route.view;
    closeSidebar();
    closeSearch();

    if (route.view === "home") renderHome();
    else if (route.view === "learn") renderLesson(route.lessonId, route.step);
    else if (route.view === "practice") renderPractice();
    else if (route.view === "lab") renderLab();
    else if (route.view === "cheatsheets") renderCheatsheets();
    else renderMissing();

    updateChrome();
    window.scrollTo(0, 0);
  }

  /* ----------------------------------------------------------
     Search
     ---------------------------------------------------------- */
  function buildSearchIndex() {
    const index = [];
    lessonList.forEach((lesson) => {
      const mod = moduleMap[lesson.module];
      index.push({
        kind: "lesson",
        href: `#/learn/${lesson.id}/1`,
        title: lesson.title,
        sub: `${mod.num} · ${mod.title} · ${lesson.duration}`,
        haystack: `${lesson.title} ${lesson.shortTitle} ${lesson.subtitle} ${lesson.tags.join(" ")} ${mod.title}`.toLowerCase()
      });
      lesson.steps.forEach((step, i) => {
        index.push({
          kind: "step",
          href: `#/learn/${lesson.id}/${i + 1}`,
          title: step.title,
          sub: `${lesson.shortTitle} · bước ${i + 1} · ${step.type}`,
          haystack: `${lesson.title} ${lesson.shortTitle} ${step.title} ${step.short} ${step.type} ${stripHTML(step.body)}`.toLowerCase()
        });
      });
    });
    DB.cheatsheets.forEach((section) => {
      section.cards.forEach((card) => {
        index.push({
          kind: "cheat",
          href: `#/cheatsheets/${section.id}`,
          title: card.title,
          sub: `${section.title} · cheatsheet`,
          haystack: `${section.title} ${card.title} ${stripHTML(card.html)}`.toLowerCase()
        });
      });
    });
    searchIndex = index;
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    document.body.classList.add("has-modal");
    state.search.modalOpen = true;
    searchInput.value = "";
    renderSearchResults("");
    setTimeout(() => searchInput.focus(), 30);
  }

  function closeSearch() {
    if (!searchModal || searchModal.hidden) return;
    searchModal.hidden = true;
    document.body.classList.remove("has-modal");
    state.search.modalOpen = false;
  }

  function searchResultsFor(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      const lessons = lessonList.slice(0, 5).map((lesson) => {
        const mod = moduleMap[lesson.module];
        return {
          kind: "lesson",
          href: `#/learn/${lesson.id}/1`,
          title: lesson.title,
          sub: `${mod.num} · ${mod.title} · ${lesson.duration}`
        };
      });
      const cheats = DB.cheatsheets.slice(0, 3).map((s) => ({
        kind: "cheat",
        href: `#/cheatsheets/${s.id}`,
        title: s.title,
        sub: "Cheatsheet · công thức & bảng tra"
      }));
      return lessons.concat(cheats);
    }
    return searchIndex
      .filter((item) => item.haystack.includes(q))
      .sort((a, b) => {
        const at = a.title.toLowerCase().indexOf(q);
        const bt = b.title.toLowerCase().indexOf(q);
        if (at >= 0 && bt < 0) return -1;
        if (bt >= 0 && at < 0) return 1;
        const rank = { lesson: 0, step: 1, cheat: 2 };
        return (rank[a.kind] - rank[b.kind]) || a.title.localeCompare(b.title, "vi");
      })
      .slice(0, 16);
  }

  function renderSearchResults(query) {
    const items = searchResultsFor(query);
    if (!items.length) {
      state.search.items = [];
      state.search.selected = -1;
      searchResults.innerHTML = `<div class="search-empty">Không tìm thấy kết quả cho “${esc(query)}”.<br>Thử “cache”, “shard”, “queue” hoặc “p95”.</div>`;
      return;
    }
    const groups = { lesson: "Bài học", step: "Bước trong bài", cheat: "Cheatsheets" };
    const ordered = [];
    let html = "";
    ["lesson", "step", "cheat"].forEach((kind) => {
      const group = items.filter((item) => item.kind === kind);
      if (!group.length) return;
      html += `<div class="search-group-title">${groups[kind]}</div>`;
      group.forEach((item) => {
        const index = ordered.length;
        ordered.push(item);
        const badge = kind === "lesson" ? iconMarkup("book") : kind === "cheat" ? "C" : "↳";
        html += `
          <a class="search-result${index === 0 ? " is-selected" : ""}" href="${item.href}" data-search-item="${index}">
            <span class="search-result-icon${kind === "cheat" ? " cheat" : ""}">${badge}</span>
            <span class="search-result-body">
              <span class="search-result-title">${esc(item.title)}</span>
              <span class="search-result-sub">${esc(item.sub)}</span>
            </span>
            <span class="search-result-kbd">↵</span>
          </a>`;
      });
    });
    state.search.items = ordered;
    state.search.selected = 0;
    searchResults.innerHTML = html;
  }

  function moveSearchSelection(delta) {
    if (!state.search.items.length) return;
    state.search.selected = (state.search.selected + delta + state.search.items.length) % state.search.items.length;
    $$(".search-result", searchResults).forEach((el, i) => {
      el.classList.toggle("is-selected", i === state.search.selected);
      if (i === state.search.selected) el.scrollIntoView({ block: "nearest" });
    });
  }

  function activateSearchSelection() {
    if (state.search.selected < 0) return;
    const links = $$(".search-result", searchResults);
    const el = links[state.search.selected];
    if (el) {
      closeSearch();
      location.hash = el.getAttribute("href");
    }
  }

  /* ----------------------------------------------------------
     Home
     ---------------------------------------------------------- */
  function renderHome() {
    document.title = "AutoLab — Automata, nhìn thấy từng bước";
    const completed = completedCount();
    const resume = resumeLesson();
    const resumeStep = resume ? savedStep(resume.id) : 1;
    const resumeHref = resume ? `#/learn/${resume.id}/${resumeStep}` : "#/learn";
    const featured = lessonList.find((l) => !isComplete(l.id)) || lessonList[0];

    const modes = [
      {
        title: "Học bằng sơ đồ sống",
        desc: "Trạng thái, cạnh chuyển và bảng chuyển hiện ra theo từng bước, có ví dụ chạy tay đi kèm.",
        href: "#/learn",
        icon: "dfa",
        tone: "blue",
        cta: "Vào lớp học"
      },
      {
        title: "Luyện tập tình huống",
        desc: `${DB.practice.length} ca thường gặp: quên ε, chọn sai trạng thái, luật chưa ở CNF và chuỗi vượt bảng chữ cái.`,
        href: "#/practice",
        icon: "star",
        tone: "coral",
        cta: "Bắt đầu luyện"
      },
      {
        title: "Phòng mô phỏng",
        desc: "Regex → NFA → DFA, CYK và máy Turing chạy trên dữ liệu của bạn, kèm 6 nhiệm vụ chấm điểm.",
        href: "#/lab",
        icon: "tm",
        tone: "violet",
        cta: "Mở phòng mô phỏng"
      },
      {
        title: "Cheatsheets",
        desc: "Cú pháp regex, các phép dựng NFA, bảng chuyển, dạng chuẩn Chomsky và bộ luật máy Turing.",
        href: "#/cheatsheets",
        icon: "file",
        tone: "green",
        cta: "Mở bảng tra"
      }
    ];

    view.innerHTML = `
      <div class="home">
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow">Khóa học tương tác · ${totalLessons} bài · tiếng Việt</span>
            <h1>Hiểu automata.<br><span class="hl">Thấy</span> máy đọc chuỗi.</h1>
            <p class="hero-sub">Đi từ bảng chữ cái, ngôn ngữ và biểu thức chính quy đến NFA, DFA, văn phạm phi ngữ cảnh, PDA và máy Turing. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng chạy ba engine ngay trong trình duyệt — không cần cài đặt.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${resumeHref}">${completed ? "Tiếp tục học" : "Bắt đầu bài 01"} ${UI_ICONS.arrow}</a>
              <a class="btn btn-ghost" href="#/lab">${iconMarkup("dfa")} Mở phòng mô phỏng</a>
            </div>
            <div class="hero-note">${UI_ICONS.check} Không backend. Máy, văn phạm và tiến độ nằm trên máy bạn.</div>
            <div class="hero-stats">
              <div class="hero-stat"><b>${totalLessons}</b><span>bài học tương tác</span></div>
              <div class="hero-stat"><b>${totalSteps}</b><span>bước có sơ đồ</span></div>
              <div class="hero-stat"><b>${window.AUTO_SEED.missions.length}</b><span>nhiệm vụ mô phỏng</span></div>
              <div class="hero-stat"><b>${completed}/${totalLessons}</b><span>tiến độ của bạn</span></div>
            </div>
          </div>
          ${autoHeroVisual()}
        </section>

        <section class="reveal">
          <div class="section-head">
            <div>
              <h2>Bốn cách học, một hệ automata</h2>
              <p>Không chỉ đọc định nghĩa. Bạn xem máy đổi trạng thái, tự chạy thuật toán và sửa hiểu nhầm ngay.</p>
            </div>
            <a class="section-link" href="#/learn">Xem lộ trình ${UI_ICONS.arrow}</a>
          </div>
          <div class="mode-grid">
            ${modes.map((m) => `
              <a class="mode-card" href="${m.href}" style="${toneVars(m.tone)}">
                <span class="mode-icon">${iconMarkup(m.icon)}</span>
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
                <span class="mode-arrow">${m.cta} ${UI_ICONS.arrow}</span>
              </a>`).join("")}
          </div>
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Lộ trình ${totalLessons} bài</h2>
              <p>Từ bảng chữ cái đến tính quyết định: mỗi module trả lời một câu hỏi lớn.</p>
            </div>
            <a class="section-link" href="#/learn/${featured.id}/1">Học bài tiếp theo ${UI_ICONS.arrow}</a>
          </div>
          <div class="outline-grid">
            ${DB.modules.map((m) => outlineModule(m)).join("")}
          </div>
        </section>

        <section class="reveal">
          ${workbenchPromo()}
        </section>

        <section class="section reveal">
          <div class="section-head">
            <div>
              <h2>Câu hỏi thường gặp</h2>
              <p>Vài điều cần biết trước khi dùng trên lớp hoặc tự học.</p>
            </div>
          </div>
          <div class="faq-list">
            <details class="faq-item">
              <summary>Đây có phải trình biên dịch biểu thức chính quy thật?</summary>
              <p>Không. Engine là bản viết tay cho khóa học: literal chữ-số, nhóm <code>( )</code>, chọn <code>|</code>, lặp <code>* + ?</code> và dấu <code>\\</code> để thoát ký tự. Chưa hỗ trợ lớp ký tự <code>[ ]</code>, khoảng lặp <code>{m,n}</code> hay neo <code>^ $</code> — nhưng đủ để nhìn trọn đường đi regex → ε-NFA → DFA.</p>
            </details>
            <details class="faq-item">
              <summary>CYK có nhận văn phạm bất kỳ không?</summary>
              <p>Không. CYK chỉ chạy trên dạng chuẩn Chomsky: mỗi luật là <code>A → BC</code> hoặc <code>A → a</code>. Nhập luật khác, engine báo lỗi và chỉ cách tách — đó cũng là bài học về chuẩn hóa văn phạm trước khi phân tích.</p>
            </details>
            <details class="faq-item">
              <summary>Máy Turing có thể chạy mãi không?</summary>
              <p>Mỗi máy có trần bước (80–200) để trình duyệt không treo. Chạm trần, kết quả ghi “hết bước” chứ không kết luận nhận hay từ chối — đúng tinh thần bài toán dừng.</p>
            </details>
            <details class="faq-item">
              <summary>Dùng trên điện thoại hoặc máy chiếu được không?</summary>
              <p>Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng CYK và băng Turing vẫn đọc được; nên xoay ngang khi chuỗi dài.</p>
            </details>
          </div>
        </section>

        <footer class="site-footer">
          <div class="footer-brand"><span>A</span> AutoLab</div>
          <div class="footer-note">Một sản phẩm học tập gốc. Các máy và văn phạm mẫu phục vụ minh họa thuật toán.</div>
          <div class="footer-links">
            <a href="#/learn">Học</a>
            <a href="#/practice">Luyện tập</a>
            <a href="#/lab">Mô phỏng</a>
            <a href="#/cheatsheets">Cheatsheets</a>
          </div>
        </footer>
      </div>`;

    initReveals();
  }

  function autoHeroVisual() {
    const tape = ["a", "b", "a", "b"].map((ch, i) =>
      `<span class="cell${i === 0 ? " is-head" : ""}">${ch}</span>`).join("");
    return `
      <div class="auto-hero" aria-label="DFA cho biểu thức (ab)+ đọc chuỗi abab">
        <div class="auto-hero-bar">
          <i></i><i></i><i></i>
          <span>autolab://dfa-(ab)+</span>
        </div>
        <div class="auto-hero-body">
          <div class="auto-hero-title">DFA · (ab)+ · đọc “abab”</div>
          <svg class="auto-hero-net" viewBox="0 0 460 168" role="img" aria-label="Ba trạng thái q0, q1, q2; q2 là trạng thái nhận">
            <defs>
              <marker id="ah-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 8 4 0 8Z"/>
              </marker>
            </defs>
            <text class="ah-start-label" x="14" y="52">bắt đầu</text>
            <path class="ah-edge" d="M16 70H52" marker-end="url(#ah-arrow)"/>
            <circle class="ah-state" cx="86" cy="70" r="26"/>
            <text class="ah-state-label" x="86" y="76">q0</text>
            <circle class="ah-state" cx="220" cy="70" r="26"/>
            <text class="ah-state-label" x="220" y="76">q1</text>
            <circle class="ah-state is-accept" cx="354" cy="70" r="26"/>
            <circle class="ah-state is-accept" cx="354" cy="70" r="20"/>
            <text class="ah-state-label" x="354" y="76">q2</text>
            <path class="ah-edge" d="M112 70H188" marker-end="url(#ah-arrow)"/>
            <text class="ah-edge-label" x="150" y="61">a</text>
            <path class="ah-edge" d="M246 70H322" marker-end="url(#ah-arrow)"/>
            <text class="ah-edge-label" x="284" y="61">b</text>
            <path class="ah-edge" d="M334 90C312 132 262 132 240 90" marker-end="url(#ah-arrow)"/>
            <text class="ah-edge-label" x="287" y="146">a</text>
          </svg>
          <div class="auto-hero-tape" aria-hidden="true">${tape}<span class="cell is-blank">_</span></div>
          <div class="auto-hero-queue">
            <small>Cuối chuỗi</small>
            <span class="auto-hero-qchip is-run">q2</span>
            <span class="auto-hero-qsep">→</span>
            <span class="auto-hero-verdict">chấp nhận</span>
          </div>
        </div>
        <div class="auto-hero-frames" aria-hidden="true">
          <div class="auto-hero-frame"><small>NFA → DFA</small><b>3 trạng thái</b></div>
          <div class="auto-hero-frame hit"><small>Đọc hết</small><b>t = 4</b></div>
          <div class="auto-hero-frame miss"><small>Từ chối</small><b>ba, abba</b></div>
        </div>
        <div class="auto-hero-foot">
          <span class="auto-hero-chip"><b>16</b> bài</span>
          <span class="auto-hero-chip"><b>3</b> mô phỏng</span>
          <span class="auto-hero-chip">engine chạy <b>cục bộ</b></span>
        </div>
      </div>`;
  }

  function workbenchPromo() {
    const nodes = [
      { icon: "regex", label: "Biểu thức", sub: "(a|b)*abb", hot: true },
      { icon: "eps", label: "ε-NFA", sub: "Thompson" },
      { icon: "dfa", label: "DFA", sub: "tập trạng thái", hot: true },
      { icon: "grammar", label: "CNF", sub: "A → BC | a" },
      { icon: "table", label: "CYK", sub: "bảng tam giác" },
      { icon: "tape", label: "Băng", sub: "đầu đọc" },
      { icon: "check", label: "6 nhiệm vụ", sub: "chấm điểm" }
    ];
    return `
      <div class="lab-promo">
        <div>
          <span class="eyebrow">Phòng mô phỏng · chạy cục bộ</span>
          <h2>Một chuỗi.<br>Ba cỗ máy.</h2>
          <p>Viết biểu thức chính quy rồi xem ε-NFA, tập trạng thái và DFA dựng theo từng bước. Chuyển sang văn phạm CNF để chạy CYK, hoặc nạp băng vào máy Turing và xem đầu đọc đi lại. Sáu nhiệm vụ chấm điểm ngay trên kết quả.</p>
          <a class="btn btn-lime" href="#/lab">Mở phòng mô phỏng ${UI_ICONS.arrow}</a>
        </div>
        <div class="mini-pipe" aria-hidden="true">
          ${nodes.map((n, i) => `${i ? '<span class="mini-line"></span>' : ""}
            <div class="mini-node${n.hot ? " is-hot" : ""}">
              ${iconMarkup(n.icon)}
              <b>${n.label}</b>
              <span>${n.sub}</span>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function outlineModule(module) {
    const lessons = module.lessons.map((id) => lessonById[id]).filter(Boolean);
    return `
      <div class="outline-module" style="${toneVars(module.tone)}">
        <div class="outline-module-head">
          <span class="outline-module-num">${esc(module.num)}</span>
          <h3>${esc(module.title)}</h3>
          <span>${lessons.length} bài</span>
        </div>
        ${lessons.map((lesson) => {
          const idx = lessonList.indexOf(lesson) + 1;
          const done = isComplete(lesson.id);
          const step = savedStep(lesson.id);
          return `
            <a class="outline-lesson${done ? " is-done" : ""}" href="#/learn/${lesson.id}/${step}">
              <span class="outline-lesson-num">${idx < 10 ? "0" + idx : idx}</span>
              <span class="outline-lesson-title">${esc(lesson.title)}</span>
              <span class="outline-lesson-meta">${esc(lesson.duration)}</span>
              ${done ? '<span class="mini-check">✓</span>' : ""}
            </a>`;
        }).join("")}
      </div>`;
  }

  function initReveals() {
    if (state.revealObserver) {
      state.revealObserver.disconnect();
      state.revealObserver = null;
    }
    const items = $$(".reveal");
    if (!items.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          state.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => state.revealObserver.observe(el));
  }

  function renderMissing() {
    document.title = "Không tìm thấy trang — AutoLab";
    view.innerHTML = `
      <div class="missing">
        <span class="eyebrow">404</span>
        <h1>Trang này chưa có trong bản đồ</h1>
        <p>Đường dẫn không tồn tại hoặc bài học đã bị di chuyển. Quay về lộ trình để chọn một bài khác.</p>
        <a class="btn btn-primary" href="#/">Về trang chủ</a>
      </div>`;
  }

  /* ----------------------------------------------------------
     Global event wiring
     ---------------------------------------------------------- */
  function bindGlobalEvents() {
    window.addEventListener("hashchange", onRoute);
    window.addEventListener("resize", syncTopbarOffset);
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#searchBtn").addEventListener("click", openSearch);
    $("#menuBtn").addEventListener("click", toggleSidebar);
    $("#sidebarScrim").addEventListener("click", closeSidebar);
    $("#resetProgressBtn").addEventListener("click", () => {
      if (!window.confirm("Đặt lại toàn bộ tiến độ học trên trình duyệt này?")) return;
      state.progress = {};
      saveProgress();
      updateChrome();
      navigate("#/");
      toast("Đã đặt lại tiến độ.");
    });

    $$(".search-backdrop, [data-close-search]").forEach((el) => {
      el.addEventListener("click", closeSearch);
    });

    searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSearchSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSearchSelection(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateSearchSelection();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearch();
      }
    });
    searchResults.addEventListener("click", (e) => {
      if (e.target.closest(".search-result")) closeSearch();
    });

    document.addEventListener("keydown", (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (state.search.modalOpen) closeSearch();
        else openSearch();
        return;
      }
      if (e.key === "Escape") {
        if (state.search.modalOpen) {
          closeSearch();
          return;
        }
        if (document.body.classList.contains("sidebar-open")) {
          closeSidebar();
          return;
        }
      }
      if (state.route.view === "lab" && mod && e.key === "Enter") {
        e.preventDefault();
        runSim();
        return;
      }
      if (state.route.view !== "learn" || state.search.modalOpen) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToStep(state.lesson.step + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToStep(state.lesson.step - 1);
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlayer();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        replayLesson();
      }
    });

    view.addEventListener("click", handleViewClick);
    view.addEventListener("input", handleViewInput);
    view.addEventListener("change", handleViewChange);
  }

  /* ----------------------------------------------------------
     Lesson engine
     ---------------------------------------------------------- */
  function renderLesson(lessonId, stepIndex) {
    const lesson = lessonById[lessonId];
    if (!lesson) {
      renderMissing();
      return;
    }
    const index = clamp(stepIndex || 1, 1, lesson.steps.length);
    state.lesson.id = lesson.id;
    state.lesson.step = index;
    state.lesson.playing = false;
    state.lesson.speed = 1;
    stopPlayer();
    try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }

    const mod = moduleMap[lesson.module];
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? "Bài tiếp" : "Luyện tập";
    document.title = `${lesson.title} — AutoLab`;

    view.innerHTML = `
      <div class="lesson-page">
        <div class="lesson-head">
          <div>
            <div class="lesson-breadcrumb">
              <a href="#/">AutoLab</a><span class="sep">/</span>
              <span>${esc(mod.title)}</span><span class="sep">/</span>
              <span>${esc(lesson.shortTitle)}</span>
            </div>
            <h1 class="lesson-title">${esc(lesson.title)}</h1>
            <p class="lesson-sub">${esc(lesson.subtitle)}</p>
            <div class="lesson-badges">
              <span class="pill pill-blue">${esc(mod.num)} · ${esc(mod.title)}</span>
              <span class="pill">${esc(lesson.level)}</span>
              <span class="pill">${esc(lesson.duration)}</span>
              <span class="pill">${lesson.steps.length} bước</span>
            </div>
          </div>
          <div class="lesson-head-right">
            <a class="btn btn-ghost btn-sm" href="#/">Về lộ trình</a>
            <a class="btn btn-primary btn-sm" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
          </div>
        </div>

        <div class="lesson-layout">
          <div class="lesson-main">
            <div class="metric-strip" id="metricStrip">${metricStripHTML(lesson, lesson.steps[index - 1])}</div>

            <div class="stage-card" id="stageCard">
              <div class="stage-top">
                <div class="stage-title">
                  <span class="live-dot"></span>
                  <span>Sơ đồ dữ liệu</span>
                  <span>${lesson.nodes.length} khối · ${lesson.edges.length} liên kết</span>
                </div>
                <div class="stage-actions">
                  <button class="stage-icon-btn" type="button" data-action="fullscreen" title="Xem toàn màn hình">
                    ${UI_ICONS.full}<span>Toàn màn hình</span>
                  </button>
                </div>
              </div>
              <div class="stage-canvas" id="stageCanvas">
                ${renderDiagram(lesson)}
              </div>
              <div class="stage-legend">
                <div class="legend">
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--blue)"></i>Luồng chính</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--mint)"></i>Quan hệ dữ liệu</span>
                  <span class="legend-item"><i class="legend-swatch" style="--sw:var(--coral)"></i>Kết quả trả về</span>
                </div>
                <span class="stage-hint">← → chuyển bước · Space phát · R phát lại</span>
              </div>
            </div>

            <div class="player-card">
              <div class="player-top">
                <button class="play-btn" id="playBtn" type="button" data-action="toggle-play" aria-label="Phát tự động các bước">
                  ${UI_ICONS.play}
                </button>
                <button class="player-small-btn" type="button" data-action="replay" aria-label="Phát lại từ đầu" title="Phát lại">${UI_ICONS.replay}</button>
                <button class="player-small-btn" type="button" data-action="prev-step" aria-label="Bước trước">${UI_ICONS.prev}</button>
                <div class="player-track-wrap">
                  <div class="player-track"><div class="player-track-fill" id="playerFill"></div></div>
                  <div class="player-time">
                    <span id="playerStepText">Bước ${index}/${lesson.steps.length}</span>
                    <span id="playerPct">${Math.round((index / lesson.steps.length) * 100)}%</span>
                  </div>
                </div>
                <button class="player-small-btn" type="button" data-action="next-step" aria-label="Bước sau">${UI_ICONS.next}</button>
                <button class="speed-btn" type="button" data-action="cycle-speed" aria-label="Đổi tốc độ phát" title="Tốc độ phát">1×</button>
              </div>
              <div class="timeline" id="timeline">
                ${lesson.steps.map((step, i) => `
                  <button class="tl-step${i === index - 1 ? " is-active" : ""}${i < index - 1 ? " is-done" : ""}"
                          type="button" data-step="${i + 1}" title="Bước ${i + 1}: ${esc(step.title)}">
                    <span class="tl-step-bar"><span></span></span>
                    <span class="tl-step-label">${String(i + 1).padStart(2, "0")} · ${esc(step.short)}</span>
                  </button>`).join("")}
              </div>
            </div>
          </div>

          <aside class="step-panel" id="stepPanel">${stepPanelHTML(lesson, index)}</aside>
        </div>
      </div>`;

    state.lesson.step = index;
    applyStep(lesson, index, { updateHash: false, initial: true });
  }

  function metricStripHTML(lesson, step) {
    return lesson.metrics.map((m) => {
      const value = step.metrics && step.metrics[m.key] != null ? step.metrics[m.key] : "—";
      return `
        <div class="metric" style="--metric-color:var(--${m.tone})">
          <div class="metric-label">${esc(m.label)}</div>
          <div class="metric-value">${esc(value)}</div>
        </div>`;
    }).join("");
  }

  function stepPanelHTML(lesson, index) {
    const step = lesson.steps[index - 1];
    const isFirst = index === 1;
    const isLast = index === lesson.steps.length;
    const typeClass = step.tone === "warn" ? " type-warn" : step.tone === "final" ? " type-final" : "";
    const next = nextLessonOf(lesson.id);
    const nextHref = next ? `#/learn/${next.id}/1` : "#/practice";
    const nextLabel = next ? `Sang bài: ${next.title}` : "Luyện tập tình huống";
    const changes = step.changes && step.changes.length
      ? `<div class="step-section">
          <div class="step-section-title">Điều gì thay đổi</div>
          <div class="change-list">
            ${step.changes.map((c) => `<div class="change-item">${UI_ICONS.check}<span>${c}</span></div>`).join("")}
          </div>
        </div>`
      : "";
    const note = step.note
      ? `<div class="callout">
          <div class="callout-head">${iconMarkup("bulb")} Điểm cần nhớ</div>
          <p>${step.note}</p>
        </div>`
      : "";
    const complete = isLast
      ? `<div class="complete-banner">
          <h4>Bạn đã đi hết bài</h4>
          <p>Tiến độ đã được lưu trên trình duyệt. Có thể xem lại bất cứ lúc nào.</p>
          <a class="btn btn-sm btn-lime" style="margin-top:9px" href="${nextHref}">${nextLabel} ${UI_ICONS.arrow}</a>
        </div>`
      : "";

    return `
      <div class="step-panel-scroll">
        <div class="step-meta">
          <span class="step-counter">BƯỚC ${String(index).padStart(2, "0")} / ${String(lesson.steps.length).padStart(2, "0")}</span>
          <span class="step-type${typeClass}">${esc(step.type)}</span>
        </div>
        <h2 class="step-title">${esc(step.title)}</h2>
        <div class="step-body">${step.body}</div>
        ${note}
        ${changes}
        <div class="learn-box">
          <div class="step-section-title">Sau bài này, bạn nắm được</div>
          <div class="learn-list">
            ${lesson.learn.map((item) => `<div class="learn-item">${esc(item)}</div>`).join("")}
          </div>
        </div>
        ${complete}
      </div>
      <div class="step-nav">
        <button class="btn btn-ghost" type="button" data-action="prev-step" ${isFirst ? "disabled" : ""}>${UI_ICONS.prev} Trước</button>
        <button class="btn btn-primary" type="button" data-action="next-step" ${isLast ? "disabled" : ""}>Tiếp ${UI_ICONS.next}</button>
      </div>
      <div class="kbd-hints">
        <span><kbd>←</kbd><kbd>→</kbd> chuyển bước</span>
        <span><kbd>Space</kbd> phát</span>
        <span><kbd>R</kbd> lại</span>
      </div>`;
  }

  function anchorPoint(node, dx, dy) {
    const cx = node.x + node.w / 2;
    const cy = node.y + node.h / 2;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { x: dx >= 0 ? node.x + node.w : node.x, y: cy };
    }
    return { x: cx, y: dy >= 0 ? node.y + node.h : node.y };
  }

  function edgeGeometry(edge, nodeById) {
    const a = nodeById[edge.from];
    const b = nodeById[edge.to];
    if (!a || !b) return null;
    const acx = a.x + a.w / 2;
    const acy = a.y + a.h / 2;
    const bcx = b.x + b.w / 2;
    const bcy = b.y + b.h / 2;
    const p1 = anchorPoint(a, bcx - acx, bcy - acy);
    const p2 = anchorPoint(b, acx - bcx, acy - bcy);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    let path = "";
    let mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    if (edge.bow) {
      const nx = -dy / len;
      const ny = dx / len;
      const cx = mid.x + nx * edge.bow;
      const cy = mid.y + ny * edge.bow;
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      mid = {
        x: 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x,
        y: 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y
      };
    } else {
      path = `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const labelPos = {
      x: mid.x + (horizontal ? 0 : 10),
      y: mid.y + (horizontal ? -8 : 0)
    };
    return { path, labelPos, p1, p2 };
  }

  function renderDiagram(lesson) {
    const nodeById = {};
    lesson.nodes.forEach((n) => { nodeById[n.id] = n; });
    const types = Array.from(new Set(lesson.nodes.map((n) => n.type)));
    const symbols = types.map((type) => `
      <symbol id="i-${type}" viewBox="0 0 20 20">
        <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          ${ICON_PATHS[type] || ICON_PATHS.server}
        </g>
      </symbol>`).join("");
    const paths = {};

    const edgeMarkup = lesson.edges.map((edge) => {
      const geo = edgeGeometry(edge, nodeById);
      if (!geo) return "";
      paths[edge.id] = geo.path;
      const label = edge.label
        ? (() => {
            const width = Math.max(28, edge.label.length * 4.9 + 9);
            const x = geo.labelPos.x - width / 2;
            const y = geo.labelPos.y - 9;
            return `
              <g class="d-edge-label-g">
                <rect class="d-edge-label-bg" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="13" rx="3.5"/>
                <text class="d-edge-label" x="${geo.labelPos.x.toFixed(1)}" y="${(geo.labelPos.y + 1.5).toFixed(1)}" text-anchor="middle">${esc(edge.label)}</text>
              </g>`;
          })()
        : "";
      const kindClass = edge.kind === "response" ? " is-response" : edge.kind === "data" ? " is-data" : "";
      return `<g data-edge-group="${edge.id}"><path class="d-edge${kindClass}" data-edge="${edge.id}" d="${geo.path}" marker-end="url(#d-arrow)"/>${label}</g>`;
    }).join("");

    const nodeMarkup = lesson.nodes.map((node) => {
      const tone = nodeToneVars(node.type);
      const iy = (node.h - 32) / 2;
      return `
        <g class="d-node" data-node="${node.id}" transform="translate(${node.x},${node.y})" style="${tone}">
          <title>${esc(node.label)} — ${esc(node.sub)}</title>
          <rect class="node-bg" width="${node.w}" height="${node.h}" rx="12"/>
          <rect class="node-accent" x="0" y="12" width="3" height="${node.h - 24}" rx="1.5"/>
          <rect class="node-icon-wrap" x="12" y="${iy.toFixed(1)}" width="32" height="32" rx="9"/>
          <use class="node-icon" href="#i-${node.type}" x="20" y="${(iy + 8).toFixed(1)}" width="16" height="16"/>
          <text class="node-label" x="54" y="${(node.h / 2 - 3).toFixed(1)}">${esc(node.label)}</text>
          <text class="node-sub" x="54" y="${(node.h / 2 + 11).toFixed(1)}">${esc(node.sub)}</text>
        </g>`;
    }).join("");

    state.diagram = { paths, nodeById };

    return `
      <svg class="diagram" viewBox="0 0 900 500" role="img" aria-label="Sơ đồ dữ liệu cho bài ${esc(lesson.title)}">
        <title>${esc(lesson.title)} — sơ đồ tương tác</title>
        <desc>Các bảng, khóa và luồng dữ liệu được làm nổi bật theo từng bước.</desc>
        <defs>
          ${symbols}
          <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#2f6bff" flood-opacity=".32"/>
          </filter>
          <marker id="d-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--diagram-edge)"/>
          </marker>
          <marker id="d-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 1 9 5 0 9Z" style="fill:var(--blue)"/>
          </marker>
        </defs>
        <g class="d-edges">${edgeMarkup}</g>
        <g class="d-nodes">${nodeMarkup}</g>
        <g id="packetLayer"></g>
      </svg>`;
  }

  function renderPackets(edgeIds) {
    const layer = $("#packetLayer");
    if (!layer || !state.diagram) return;
    layer.textContent = "";
    const ids = edgeIds.slice(0, 12);
    ids.forEach((id, i) => {
      const path = state.diagram.paths[id];
      if (!path) return;
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("r", "3.4");
      circle.setAttribute("class", "d-packet");
      const anim = document.createElementNS(SVGNS, "animateMotion");
      anim.setAttribute("dur", `${(1.5 + (i % 4) * 0.28).toFixed(2)}s`);
      anim.setAttribute("repeatCount", "indefinite");
      anim.setAttribute("path", path);
      anim.setAttribute("begin", `-${(i * 0.33).toFixed(2)}s`);
      anim.setAttribute("calcMode", "spline");
      anim.setAttribute("keySplines", "0.4 0 0.2 1");
      anim.setAttribute("keyTimes", "0;1");
      circle.appendChild(anim);
      layer.appendChild(circle);
    });
  }

  function applyStep(lesson, index, opts) {
    const step = lesson.steps[index - 1];
    if (!step) return;
    const options = opts || {};
    const focus = step.focus === "all" ? lesson.nodes.map((n) => n.id) : (step.focus || []);
    const activeEdges = step.edges === "all" ? lesson.edges.map((e) => e.id) : (step.edges || []);
    const warn = step.warn || [];

    $$(".d-node", view).forEach((el) => {
      const id = el.dataset.node;
      const active = focus.includes(id);
      const isWarn = warn.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-warn", isWarn);
      el.classList.toggle("is-dim", !active && !isWarn && focus.length > 0);
    });

    $$(".d-edge", view).forEach((el) => {
      const id = el.dataset.edge;
      const active = activeEdges.includes(id);
      el.classList.toggle("is-active", active);
      el.classList.toggle("is-dim", activeEdges.length > 0 && !active);
      el.setAttribute("marker-end", active ? "url(#d-arrow-active)" : "url(#d-arrow)");
    });

    renderPackets(activeEdges);

    const panel = $("#stepPanel");
    if (panel) {
      panel.innerHTML = stepPanelHTML(lesson, index);
      const scroll = $(".step-panel-scroll", panel);
      if (scroll) scroll.scrollTop = 0;
    }

    const strip = $("#metricStrip");
    if (strip) {
      strip.innerHTML = metricStripHTML(lesson, step);
      $$(".metric", strip).forEach((el) => {
        el.classList.add("is-pulse");
        setTimeout(() => el.classList.remove("is-pulse"), 650);
      });
    }

    $$(".tl-step", view).forEach((el, i) => {
      el.classList.toggle("is-active", i === index - 1);
      el.classList.toggle("is-done", i < index - 1);
    });

    state.lesson.step = index;
    state.lesson.id = lesson.id;
    updatePlayerUI(lesson, index);

    if (state.diagram && options.updateHash !== false) {
      try { history.replaceState(null, "", `#/learn/${lesson.id}/${index}`); } catch (err) { /* ignore */ }
    }
    if (!options.initial) {
      try { localStorage.setItem(LAST_KEY, lesson.id); } catch (err) { /* ignore */ }
    }

    const previous = state.progress[lesson.id] || 0;
    if (index > previous) {
      state.progress[lesson.id] = index;
      saveProgress();
      updateChrome();
    }

    if (state.lesson.playing && index >= lesson.steps.length) {
      stopPlayer();
    }
  }

  function updatePlayerUI(lesson, index) {
    const fill = $("#playerFill");
    if (fill) fill.style.width = `${(index / lesson.steps.length) * 100}%`;
    const stepText = $("#playerStepText");
    if (stepText) stepText.textContent = `Bước ${index}/${lesson.steps.length}`;
    const pct = $("#playerPct");
    if (pct) pct.textContent = `${Math.round((index / lesson.steps.length) * 100)}%`;
    const playBtn = $("#playBtn");
    if (playBtn) {
      playBtn.innerHTML = state.lesson.playing ? UI_ICONS.pause : UI_ICONS.play;
      playBtn.setAttribute("aria-label", state.lesson.playing ? "Tạm dừng phát tự động" : "Phát tự động các bước");
    }
    const speedBtn = $(".speed-btn", view);
    if (speedBtn) speedBtn.textContent = `${state.lesson.speed}×`;
  }

  function goToStep(index) {
    if (!state.lesson.id) return false;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return false;
    const target = clamp(index, 1, lesson.steps.length);
    applyStep(lesson, target, { updateHash: true });
    if (state.lesson.playing) {
      if (target >= lesson.steps.length) {
        stopPlayer();
      } else {
        restartAutoTimer();
      }
    }
    return true;
  }

  function restartAutoTimer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    if (!state.lesson.playing) return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.timer = setInterval(() => {
      if (!state.lesson.playing) return;
      const current = state.lesson.step;
      if (current < lesson.steps.length) {
        goToStep(current + 1);
      } else {
        stopPlayer();
      }
    }, AUTO_MS / state.lesson.speed);
  }

  function setPlaying(playing) {
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    if (playing && state.lesson.step >= lesson.steps.length) {
      applyStep(lesson, 1, { updateHash: true });
    }
    state.lesson.playing = Boolean(playing);
    if (state.lesson.playing) restartAutoTimer();
    else {
      clearInterval(state.lesson.timer);
      state.lesson.timer = null;
    }
    updatePlayerUI(lesson, state.lesson.step);
  }

  function togglePlayer() {
    if (state.route.view !== "learn") return;
    setPlaying(!state.lesson.playing);
  }

  function stopPlayer() {
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    state.lesson.playing = false;
    const lesson = lessonById[state.lesson.id];
    if (lesson && state.route.view === "learn" && $("#playBtn")) {
      updatePlayerUI(lesson, state.lesson.step);
    }
  }

  function replayLesson() {
    if (state.route.view !== "learn") return;
    const lesson = lessonById[state.lesson.id];
    if (!lesson) return;
    state.lesson.playing = false;
    clearInterval(state.lesson.timer);
    state.lesson.timer = null;
    applyStep(lesson, 1, { updateHash: true });
    setPlaying(true);
  }

  function cycleSpeed() {
    const speeds = [1, 1.5, 2];
    const idx = speeds.indexOf(state.lesson.speed);
    state.lesson.speed = speeds[(idx + 1) % speeds.length];
    const lesson = lessonById[state.lesson.id];
    if (lesson) updatePlayerUI(lesson, state.lesson.step);
    if (state.lesson.playing) restartAutoTimer();
  }

  function toggleFullscreen() {
    const card = $("#stageCard");
    if (!card) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (card.requestFullscreen) {
      card.requestFullscreen().catch(() => toast("Trình duyệt không cho phép toàn màn hình ở chế độ này."));
    } else {
      toast("Trình duyệt không hỗ trợ toàn màn hình.");
    }
  }

  /* ----------------------------------------------------------
     Practice engine
     ---------------------------------------------------------- */
  const PRACTICE_LETTERS = ["A", "B", "C", "D", "E", "F"];

  function initPractice() {
    const order = DB.practice.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    state.practice = { order, index: 0, selected: null, answered: false, results: [] };
  }

  function renderPractice() {
    if (!state.practice) initPractice();
    document.title = "Luyện tập — AutoLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Luyện tập</div>
            <h1>Tình huống thực tế</h1>
            <p>${DB.practice.length} tình huống về biểu thức chính quy, NFA/DFA, văn phạm và máy Turing. Chọn phương án đúng trước khi xem lời giải thích.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-primary" href="#/learn">Vào bài học</a>
          </div>
        </div>
        <div class="practice-layout">
          <div id="practiceCard"></div>
          <aside class="practice-side" id="practiceSide"></aside>
        </div>
      </div>`;
    renderPracticeCard();
    renderPracticeSide();
  }

  function renderPracticeCard() {
    const wrap = $("#practiceCard");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    if (p.index >= total) {
      const correct = p.results.filter(Boolean).length;
      const pct = Math.round((correct / total) * 100);
      const message = pct >= 80
        ? "Bạn đọc tình huống rất tốt. Thử AutoLab Simulator hoặc mở lại bài tương ứng để đào sâu."
        : pct >= 50
          ? "Nền tảng đã vững. Xem lại các tình huống sai và chú ý chỉ số nào đang báo đỏ."
          : "Hãy mở lại các bài liên quan tới tình huống sai, rồi thử lại lượt luyện này.";
      wrap.innerHTML = `
        <div class="scenario-card practice-result">
          <div class="result-ring" style="--score:${pct}"><b>${pct}%</b></div>
          <h2>Hoàn thành lượt luyện</h2>
          <p>Bạn trả lời đúng <strong>${correct}/${total}</strong> tình huống. ${message}</p>
          <div class="result-actions">
            <button class="btn btn-primary" type="button" data-action="restart-practice">Làm lại</button>
            <a class="btn btn-ghost" href="#/lab">Mở AutoLab Simulator</a>
          </div>
        </div>`;
      return;
    }

    const q = DB.practice[p.order[p.index]];
    const feedback = p.answered
      ? (() => {
          const correct = p.selected === q.correct;
          const isLast = p.index === total - 1;
          return `
            <div class="feedback ${correct ? "is-good" : "is-bad"}" id="practiceFeedback" tabindex="-1">
              <div class="feedback-head">${correct ? UI_ICONS.check : iconMarkup("info")} ${correct ? "Chính xác" : "Chưa đúng"}</div>
              <p>${q.explain}</p>
              <div class="feedback-actions">
                <button class="btn btn-primary btn-sm" type="button" data-action="next-question">
                  ${isLast ? "Xem kết quả" : `Tình huống tiếp ${UI_ICONS.arrow}`}
                </button>
              </div>
            </div>`;
        })()
      : "";

    wrap.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-top">
          <span class="scenario-num">TÌNH HUỐNG ${String(p.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
          <span class="pill pill-blue">${esc(q.tag)}</span>
        </div>
        <div class="scenario-body">
          <h2>${esc(q.title)}</h2>
          <p class="scenario-text">${esc(q.scenario)}</p>
          <div class="metric-chips">
            ${q.metrics.map((m) => `<div class="metric-chip${m.danger ? " danger" : ""}"><span>${esc(m.label)}</span><b>${esc(m.value)}</b></div>`).join("")}
          </div>
          <div class="options">
            ${q.options.map((option, i) => {
              let cls = "";
              if (p.answered) {
                if (i === q.correct) cls = " is-correct";
                else if (i === p.selected) cls = " is-wrong";
              }
              return `
                <button class="option-btn${cls}" type="button" data-action="answer" data-option="${i}" ${p.answered ? "disabled" : ""}>
                  <span class="option-letter">${PRACTICE_LETTERS[i]}</span>
                  <span>${esc(option)}</span>
                </button>`;
            }).join("")}
          </div>
          ${feedback}
        </div>
      </div>`;
    if (p.answered) {
      const f = $("#practiceFeedback");
      if (f) f.focus({ preventScroll: true });
    }
  }

  function renderPracticeSide() {
    const wrap = $("#practiceSide");
    const p = state.practice;
    if (!wrap || !p) return;
    const total = p.order.length;
    const correct = p.results.filter(Boolean).length;
    const answeredCount = p.results.filter((v) => v !== undefined).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const current = Math.min(p.index, total - 1);
    wrap.innerHTML = `
      <div class="side-card">
        <h3>Điểm của bạn</h3>
        <div class="score-big">${correct}<small> / ${total}</small></div>
        <div class="score-bar"><span style="width:${pct}%"></span></div>
        <p class="score-note">${answeredCount} tình huống đã trả lời · ${pct}% chính xác</p>
      </div>
      <div class="side-card">
        <h3>Tiến độ lượt luyện</h3>
        <div class="practice-progress">
          ${p.order.map((_, i) => {
            const done = i < p.results.length;
            const isCurrent = i === current && p.index < total;
            return `<span class="pp-dot${done ? " is-done" : ""}${isCurrent ? " is-current" : ""}" title="Tình huống ${i + 1}"></span>`;
          }).join("")}
        </div>
        <p class="score-note">Mỗi câu chỉ có một lựa chọn tối ưu theo bối cảnh.</p>
      </div>
      <div class="side-card">
        <h3>Cách luyện hiệu quả</h3>
        <p class="score-note">Đọc đề bài trước, ước lượng chỉ số (thời gian chờ, số lần page fault, tài nguyên cạn) rồi mới chọn phương án. Đừng đoán theo tên thuật toán nghe quen.</p>
        <a class="btn btn-ghost btn-sm" style="margin-top:11px" href="#/cheatsheets/syntax">Mở công thức &amp; thuật toán</a>
      </div>`;
  }

  function answerPractice(option) {
    const p = state.practice;
    if (!p || p.answered || p.index >= p.order.length) return;
    const q = DB.practice[p.order[p.index]];
    if (option < 0 || option >= q.options.length) return;
    p.selected = option;
    p.answered = true;
    p.results[p.index] = option === q.correct;
    renderPracticeCard();
    renderPracticeSide();
  }

  function nextPracticeQuestion() {
    const p = state.practice;
    if (!p || !p.answered) return;
    if (p.index < p.order.length - 1) {
      p.index += 1;
      p.selected = null;
      p.answered = false;
    } else {
      p.index = p.order.length;
    }
    renderPracticeCard();
    renderPracticeSide();
    const card = $(".scenario-card", view);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function restartPractice() {
    initPractice();
    renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Đã bắt đầu lượt luyện mới.");
  }

  /* ----------------------------------------------------------
     AutoLab Simulator
     ---------------------------------------------------------- */
  function defaultBox(kind) {
    const preset = window.AUTO_SEED.defaults[kind];
    if (kind === "cyk") {
      return { grammar: preset.grammar, input: preset.input, dataset: preset.id, last: null };
    }
    if (kind === "tm") {
      return { machine: preset.machine, input: preset.input, dataset: preset.id, last: null };
    }
    return { pattern: preset.pattern, input: preset.input, dataset: preset.id, last: null };
  }

  function initLab() {
    if (state.lab) return;
    state.lab = {
      tab: "regex",
      regex: defaultBox("regex"),
      cyk: defaultBox("cyk"),
      tm: defaultBox("tm"),
      mission: 0,
      completed: loadMissions(),
      attempts: 0,
      showHint: false
    };
  }

  function loadMissions() {
    try {
      const raw = localStorage.getItem(MISSIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function saveMissions() {
    try { localStorage.setItem(MISSIONS_KEY, JSON.stringify(state.lab.completed)); } catch (err) { /* ignore */ }
  }

  function presetsHTML() {
    if (!state.lab) return "";
    const kind = state.lab.tab;
    const list = window.AUTO_SEED.presets[kind] || [];
    return list.map((p) => `
      <button class="auto-preset" type="button" data-action="auto-preset" data-kind="${kind}" data-preset="${esc(p.id)}">
        <b>${esc(p.label)}</b>
        <small>${esc(p.note)}</small>
      </button>`).join("");
  }

  function examplesHTML() {
    return window.AUTO_SEED.examples
      .filter((ex) => ex.kind === state.lab.tab)
      .map((ex) => `<button class="auto-example" type="button" data-action="auto-example" data-example="${esc(ex.id)}">${esc(ex.label)}</button>`).join("");
  }

  function missionsListHTML() {
    const completed = state.lab.completed;
    return window.AUTO_SEED.missions.map((m, i) => {
      const done = Boolean(completed[m.id]);
      const active = i === state.lab.mission;
      return `
        <button class="auto-mission${done ? " is-done" : ""}${active ? " is-active" : ""}" type="button" data-action="auto-mission" data-mission="${i}">
          <span class="auto-mission-dot">✓</span>
          <span>
            <span class="auto-mission-title">${esc(m.title)}</span>
            <span class="auto-mission-meta">${done ? "Đã hoàn thành" : "Chưa kiểm tra"}</span>
          </span>
        </button>`;
    }).join("");
  }

  function missionPanelHTML() {
    const missions = window.AUTO_SEED.missions;
    const m = missions[state.lab.mission];
    if (!m) return "";
    const done = Boolean(state.lab.completed[m.id]);
    return `
      <div class="auto-panel-head">
        <span>Nhiệm vụ ${String(state.lab.mission + 1).padStart(2, "0")} / ${String(missions.length).padStart(2, "0")}</span>
        <span>${done ? "đã xong" : "chưa xong"}</span>
      </div>
      <div class="auto-mission-body">
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.prompt)}</p>
        <div class="auto-mission-foot">
          <button class="auto-ghost" type="button" data-action="auto-mission-load">Nạp đề bài</button>
          <button class="auto-run" type="button" data-action="auto-mission-check">${UI_ICONS.play} Chạy &amp; kiểm tra</button>
          <button class="auto-ghost" type="button" data-action="auto-hint">${state.lab.showHint ? "Ẩn gợi ý" : "Gợi ý"}</button>
          <span class="auto-status" id="autoCheckStatus"></span>
        </div>
        ${state.lab.showHint ? `<div class="auto-mission-hint">${esc(m.hint)}</div>` : ""}
        <div id="autoCheckMsg"></div>
      </div>`;
  }

  function missionProgressHTML() {
    const total = window.AUTO_SEED.missions.length;
    const done = window.AUTO_SEED.missions.filter((m) => state.lab.completed[m.id]).length;
    return `
      <div class="auto-progress-line">
        <span>${done}/${total} nhiệm vụ</span>
        <span class="bar"><span style="width:${(done / total) * 100}%"></span></span>
        <span>${done === total ? "Hoàn tất" : "Tiếp tục"}</span>
      </div>`;
  }

  function updateMissionUI() {
    const list = $("#autoMissionList");
    if (list) list.innerHTML = missionsListHTML();
    const panel = $("#autoMissionPanel");
    if (panel) panel.innerHTML = missionPanelHTML();
    const prog = $("#autoMissionProgress");
    if (prog) prog.innerHTML = missionProgressHTML();
  }

  function regexConfigHTML() {
    const r = state.lab.regex;
    return `
      <div class="auto-config">
        <div class="auto-field grow">
          <label for="rxPattern">Biểu thức chính quy</label>
          <input id="rxPattern" class="auto-refs" type="text" value="${esc(r.pattern)}" data-auto="r-pattern" spellcheck="false" autocomplete="off" aria-label="Biểu thức chính quy">
          <span class="auto-field-hint">Hỗ trợ chữ, số, <code>( )</code>, chọn <code>|</code>, lặp <code>* + ?</code> và dấu <code>\\</code> để thoát.</span>
        </div>
        <div class="auto-controls">
          <div class="auto-field">
            <label for="rxInput">Chuỗi nhập</label>
            <input id="rxInput" type="text" value="${esc(r.input)}" data-auto="r-input" spellcheck="false" autocomplete="off" aria-label="Chuỗi nhập">
          </div>
          <button class="auto-run" type="button" data-action="auto-run">${UI_ICONS.play} Chạy mô phỏng</button>
          <span class="auto-status" id="autoStatus">Sẵn sàng</span>
        </div>
        <div class="auto-field-hint">Engine dựng ε-NFA bằng Thompson rồi gộp tập trạng thái thành DFA; bảng kết quả ghi lại từng ký tự đọc.</div>
      </div>`;
  }

  function cykConfigHTML() {
    const c = state.lab.cyk;
    return `
      <div class="auto-config">
        <div class="auto-field grow">
          <label for="cykGrammar">Văn phạm dạng chuẩn Chomsky</label>
          <textarea id="cykGrammar" class="auto-grammar" rows="4" data-auto="g-grammar" spellcheck="false" aria-label="Văn phạm dạng chuẩn Chomsky">${esc(c.grammar)}</textarea>
          <span class="auto-field-hint">Mỗi dòng một luật: <code>A -&gt; BC</code> hoặc <code>A -&gt; a</code>. Ký hiệu bắt đầu là vế trái của luật đầu tiên.</span>
        </div>
        <div class="auto-controls">
          <div class="auto-field">
            <label for="cykInput">Chuỗi nhập</label>
            <input id="cykInput" type="text" value="${esc(c.input)}" data-auto="g-input" spellcheck="false" autocomplete="off" aria-label="Chuỗi nhập">
          </div>
          <button class="auto-run" type="button" data-action="auto-run">${UI_ICONS.play} Chạy CYK</button>
          <span class="auto-status" id="autoStatus">Sẵn sàng</span>
        </div>
        <div class="auto-field-hint">Bảng tam giác điền từ dưới lên: ô (i, j) chứa mọi ký hiệu sinh ra đoạn từ i đến j.</div>
      </div>`;
  }

  function tmConfigHTML() {
    const t = state.lab.tm;
    const machines = Object.values(window.AUTO_SEED.machines);
    const machine = window.AUTO_SEED.machines[t.machine] || machines[0];
    return `
      <div class="auto-config">
        <div class="auto-controls">
          <div class="auto-field grow">
            <label for="tmMachine">Máy Turing</label>
            <select id="tmMachine" data-auto="t-machine">
              ${machines.map((m) => `<option value="${esc(m.id)}"${m.id === t.machine ? " selected" : ""}>${esc(m.label)}</option>`).join("")}
            </select>
          </div>
          <div class="auto-field">
            <label for="tmInput">Băng nhập</label>
            <input id="tmInput" type="text" value="${esc(t.input)}" data-auto="t-input" spellcheck="false" autocomplete="off" aria-label="Băng nhập">
          </div>
          <button class="auto-run" type="button" data-action="auto-run">${UI_ICONS.play} Chạy máy</button>
          <span class="auto-status" id="autoStatus">Sẵn sàng</span>
        </div>
        <div class="auto-field-hint">${esc(machine.note)} · bảng chữ cái: <code>${machine.alphabet.map(esc).join(" ")}</code>, ô trống <code>${esc(machine.blank)}</code> · trần ${machine.maxSteps} bước.</div>
      </div>`;
  }

  function configHTML() {
    if (state.lab.tab === "cyk") return cykConfigHTML();
    if (state.lab.tab === "tm") return tmConfigHTML();
    return regexConfigHTML();
  }

  function renderLab() {
    initLab();
    document.title = "Phòng mô phỏng — AutoLab";
    const tab = state.lab.tab;
    const tabs = [
      ["regex", "Regex → DFA"],
      ["cyk", "CYK"],
      ["tm", "Máy Turing"]
    ];
    const titles = { regex: "Biểu thức chính quy", cyk: "Văn phạm &amp; chuỗi", tm: "Máy &amp; băng" };
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Phòng mô phỏng</div>
            <h1>Ba cỗ máy, một phòng chạy</h1>
            <p>Regex → NFA → DFA, CYK trên văn phạm CNF và máy Turing. Engine viết tay, chạy hoàn toàn trong trình duyệt; sáu nhiệm vụ chấm điểm ngay trên kết quả.</p>
          </div>
          <div class="mode-head-right">
            <button class="btn btn-ghost" type="button" data-action="auto-reset">Về đề mặc định</button>
            <a class="btn btn-primary" href="#/learn">Học lý thuyết</a>
          </div>
        </div>
        <div class="auto-tabs" role="tablist" aria-label="Chọn mô phỏng">
          ${tabs.map(([id, label]) => `
            <button class="auto-tab${tab === id ? " is-active" : ""}" type="button" role="tab" aria-selected="${tab === id}" data-action="auto-tab" data-tab="${id}">${label}</button>`).join("")}
        </div>
        <div class="auto-workbench">
          <aside class="auto-side">
            <div class="auto-panel">
              <div class="auto-panel-head"><span>Đề mẫu</span><span>${(window.AUTO_SEED.presets[tab] || []).length} bộ</span></div>
              <div class="auto-presets">${presetsHTML()}</div>
            </div>
            <div class="auto-panel">
              <div class="auto-panel-head"><span>Ví dụ nhanh</span></div>
              <div class="auto-examples">${examplesHTML()}</div>
            </div>
          </aside>
          <div class="auto-main">
            <section class="auto-card">
              <div class="auto-card-head"><span>${titles[tab]}</span><b>${tab === "cyk" ? "chỉ CNF" : tab === "tm" ? "có trần bước" : "cú pháp con"}</b></div>
              ${configHTML()}
            </section>
            <section class="auto-card">
              <div class="auto-card-head"><span>Kết quả</span><b id="autoResultMeta">chưa chạy</b></div>
              <div id="autoResultBody">
                <div class="auto-placeholder">Bấm <b>Chạy mô phỏng</b> hoặc chọn một đề mẫu để xem đường đi.</div>
              </div>
            </section>
            <div class="auto-panel">
              <div class="auto-panel-head"><span>Nhiệm vụ</span><span>${window.AUTO_SEED.missions.length} bài</span></div>
              <div class="auto-missions" id="autoMissionList">${missionsListHTML()}</div>
              <div id="autoMissionProgress">${missionProgressHTML()}</div>
            </div>
            <div class="auto-mission-panel" id="autoMissionPanel">${missionPanelHTML()}</div>
          </div>
        </div>
      </div>`;

    if (state.lab[tab].last) renderLastResult();
  }

  function renderLastResult() {
    const tab = state.lab.tab;
    const last = state.lab[tab].last;
    if (!last) return;
    if (tab === "regex") paintRegexResult(last.result);
    else if (tab === "cyk") paintCykResult(last.result);
    else paintTmResult(last.result);
  }

  function verdictMarkup(ok, yes, no) {
    return ok
      ? `<span class="auto-verdict is-ok">${yes}</span>`
      : `<span class="auto-verdict is-bad">${no}</span>`;
  }

  function paintRegexResult(res) {
    const body = $("#autoResultBody");
    const meta = $("#autoResultMeta");
    if (!body) return;
    const states = res.dfa.states.map((s) => `
      <span class="auto-state-chip${s.accept ? " is-accept" : ""}">
        <b>${esc(s.id)}</b>
        <small>{${esc(s.set.join(","))}}</small>
        ${s.start ? "<i>bắt đầu</i>" : ""}
      </span>`).join("");
    const rows = res.trace.length
      ? res.trace.map((r) => `
        <tr${r.dfaId ? "" : ' class="is-fault"'}>
          <td>${r.i}</td>
          <td><code>${esc(r.ch)}</code></td>
          <td>{${esc(r.nfaSet.join(","))}}</td>
          <td>${r.dfaId ? esc(r.dfaId) : "∅"}</td>
          <td>${r.note ? esc(r.note) : "—"}</td>
        </tr>`).join("")
      : `<tr><td colspan="5">Chuỗi rỗng — chỉ xét trạng thái đầu.</td></tr>`;
    body.innerHTML = `
      <div class="auto-verdict-row">
        ${verdictMarkup(res.accept, "Chấp nhận", "Từ chối")}
        <span><code>${esc(res.pattern)}</code> · chuỗi “${esc(res.input || "ε")}”</span>
      </div>
      <div class="auto-metrics">
        <div class="auto-metric"><span>Trạng thái NFA</span><b>${res.nfaStates}</b></div>
        <div class="auto-metric"><span>Cạnh NFA</span><b>${res.nfaEdges}</b></div>
        <div class="auto-metric"><span>Trạng thái DFA</span><b>${res.dfaStates}</b></div>
        <div class="auto-metric"><span>Cạnh DFA</span><b>${res.dfaEdges}</b></div>
      </div>
      <div class="auto-state-strip">${states}</div>
      <div class="auto-result">
        <table class="auto-table">
          <thead><tr><th>Bước</th><th>Ký tự</th><th>Tập NFA sau ε</th><th>DFA</th><th>Ghi chú</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="auto-ok-note">Bảng chữ cái: {${res.alphabet.map(esc).join(", ")}} · trạng thái nhận: {${res.dfa.accept.map(esc).join(", ") || "không có"}}. Tập NFA được đóng dưới ε trước khi tra DFA.</div>`;
    if (meta) meta.textContent = `${res.dfaStates} trạng thái DFA · ${res.accept ? "nhận" : "từ chối"}`;
  }

  function paintCykResult(res) {
    const body = $("#autoResultBody");
    const meta = $("#autoResultMeta");
    if (!body) return;
    const n = res.length;
    const chars = res.input.split("");
    const head = `<tr><th></th>${chars.map((ch) => `<th>${esc(ch)}</th>`).join("")}</tr>`;
    const rows = Array.from({ length: n }, (_, i) => `
      <tr>
        <th>${esc(chars[i])}</th>
        ${Array.from({ length: n }, (_, j) => {
          if (j < i) return '<td class="is-blocked"></td>';
          const set = res.table[i][j] || [];
          const top = i === 0 && j === n - 1;
          const cls = ["is-cell", top ? "is-top" : "", set.length ? "is-filled" : ""].filter(Boolean).join(" ");
          return `<td class="${cls}">${set.length ? "{" + esc(set.join(",")) + "}" : "·"}</td>`;
        }).join("")}
      </tr>`).join("");
    const grammar = res.grammar;
    body.innerHTML = `
      <div class="auto-verdict-row">
        ${verdictMarkup(res.accept, "Sinh được", "Không sinh được")}
        <span><code>${esc(res.input)}</code> · ${n} ký tự</span>
      </div>
      <div class="auto-metrics">
        <div class="auto-metric"><span>Độ dài chuỗi</span><b>${n}</b></div>
        <div class="auto-metric"><span>Ô có ký hiệu</span><b>${res.cells}</b></div>
        <div class="auto-metric"><span>Luật</span><b>${grammar.rules.length}</b></div>
        <div class="auto-metric"><span>Ký hiệu bắt đầu</span><b>${esc(grammar.start)}</b></div>
      </div>
      <div class="auto-cyk-wrap">
        <table class="auto-cyk">
          <thead>${head}</thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="auto-ok-note">Ô tô sáng ở góc trên bên phải là đoạn cả chuỗi. ${res.accept ? `Có <b>${esc(grammar.start)}</b> nên chuỗi thuộc ngôn ngữ.` : `Không có <b>${esc(grammar.start)}</b> nên chuỗi không thuộc ngôn ngữ.`}</div>`;
    if (meta) meta.textContent = `${res.accept ? "thuộc" : "không thuộc"} · ${res.cells} ô`;
  }

  function tmVerdict(res) {
    if (res.accept) return ["is-ok", "Chấp nhận"];
    if (res.rejected) return ["is-bad", "Từ chối"];
    if (res.maxed) return ["is-wait", "Hết bước"];
    return ["is-wait", "Không có luật"];
  }

  function paintTmResult(res) {
    const body = $("#autoResultBody");
    const meta = $("#autoResultMeta");
    if (!body) return;
    const [tone, verdict] = tmVerdict(res);
    const cells = res.tape.map((ch, i) => {
      const cls = ["auto-tape-cell", ch === res.machine.blank ? "is-blank" : "", i === res.head ? "is-head" : ""]
        .filter(Boolean).join(" ");
      return `<span class="${cls}">${esc(ch)}</span>`;
    }).join("");
    const shown = res.trace.slice(-22);
    const rows = shown.length
      ? shown.map((r) => `
        <tr>
          <td>${r.step}</td>
          <td>${esc(r.state)}</td>
          <td><code>${esc(r.read)}</code></td>
          <td><code>${esc(r.write)}</code></td>
          <td>${esc(r.move)}</td>
          <td>${esc(r.next)}</td>
        </tr>`).join("")
      : `<tr><td colspan="6">Máy đứng ở trạng thái đầu — băng rỗng hoặc không có luật áp dụng.</td></tr>`;
    body.innerHTML = `
      <div class="auto-verdict-row">
        <span class="auto-verdict ${tone}">${verdict}</span>
        <span>máy <b>${esc(res.machine.label)}</b> · vào “${esc(res.input || res.machine.blank)}”</span>
      </div>
      <div class="auto-metrics">
        <div class="auto-metric"><span>Số bước</span><b>${res.steps}</b></div>
        <div class="auto-metric"><span>Trạng thái cuối</span><b>${esc(res.state)}</b></div>
        <div class="auto-metric"><span>Đầu đọc</span><b>ô ${res.head}</b></div>
        <div class="auto-metric"><span>Băng cuối</span><b class="mono">${esc(res.finalTape)}</b></div>
      </div>
      <div class="auto-tape-wrap"><div class="auto-tape">${cells}</div></div>
      <div class="auto-result">
        <table class="auto-table">
          <thead><tr><th>Bước</th><th>Trạng thái</th><th>Đọc</th><th>Ghi</th><th>Dịch</th><th>Kế tiếp</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="auto-ok-note">${res.trace.length > shown.length ? `Hiển thị ${shown.length} bước cuối trong ${res.trace.length} bước. ` : ""}Băng cuối đã bỏ các ô trống ở hai đầu: <code>${esc(res.finalTape)}</code>.</div>`;
    if (meta) meta.textContent = `${res.steps} bước · ${res.state}`;
  }

  function readRegexInputs() {
    const r = state.lab.regex;
    const pattern = $("#rxPattern");
    if (pattern && pattern.value !== r.pattern) {
      r.pattern = pattern.value;
      r.dataset = null;
    }
    const input = $("#rxInput");
    if (input && input.value !== r.input) {
      r.input = input.value;
      r.dataset = null;
    }
  }

  function readCykInputs() {
    const c = state.lab.cyk;
    const grammar = $("#cykGrammar");
    if (grammar && grammar.value !== c.grammar) {
      c.grammar = grammar.value;
      c.dataset = null;
    }
    const input = $("#cykInput");
    if (input && input.value !== c.input) {
      c.input = input.value;
      c.dataset = null;
    }
  }

  function readTmInputs() {
    const t = state.lab.tm;
    const machine = $("#tmMachine");
    if (machine && machine.value !== t.machine) {
      t.machine = machine.value;
      t.dataset = null;
    }
    const input = $("#tmInput");
    if (input && input.value !== t.input) {
      t.input = input.value;
      t.dataset = null;
    }
  }

  function setStatus(text, kind) {
    const el = $("#autoStatus");
    if (!el) return;
    el.className = "auto-status" + (kind ? " " + kind : "");
    el.textContent = text;
  }

  function showRunError(err) {
    const body = $("#autoResultBody");
    if (body) body.innerHTML = `<div class="auto-error">${esc(err.message)}</div>`;
    setStatus("Có lỗi", "err");
  }

  function runSim(opts) {
    if (!state.lab) return null;
    const options = opts || {};
    try {
      if (state.lab.tab === "cyk") {
        readCykInputs();
        const box = state.lab.cyk;
        const res = window.AutoEngine.cykRun(box.grammar, box.input);
        box.last = { result: res, dataset: box.dataset };
        paintCykResult(res);
        setStatus(`${res.accept ? "thuộc" : "không thuộc"} ngôn ngữ`, "ok");
        if (options.check) checkMission();
        return res;
      }
      if (state.lab.tab === "tm") {
        readTmInputs();
        const box = state.lab.tm;
        const machine = window.AUTO_SEED.machines[box.machine];
        const res = window.AutoEngine.tmRun(machine, box.input);
        box.last = { result: res, dataset: box.dataset };
        paintTmResult(res);
        setStatus(`${res.steps} bước · ${res.state}`, "ok");
        if (options.check) checkMission();
        return res;
      }
      readRegexInputs();
      const box = state.lab.regex;
      const res = window.AutoEngine.regexRun(box.pattern, box.input);
      box.last = { result: res, dataset: box.dataset };
      paintRegexResult(res);
      setStatus(`${res.accept ? "nhận" : "từ chối"} · ${res.dfaStates} trạng thái DFA`, "ok");
      if (options.check) checkMission();
      return res;
    } catch (err) {
      showRunError(err);
      if (options.check) missionMessage("bad", `Chưa chạy được: ${esc(err.message)}`);
      return null;
    }
  }

  function applyPreset(kind, id, opts) {
    const options = opts || {};
    const preset = (window.AUTO_SEED.presets[kind] || []).find((p) => p.id === id);
    if (!preset) return;
    state.lab.tab = kind;
    if (kind === "cyk") {
      const c = state.lab.cyk;
      c.grammar = preset.grammar;
      c.input = preset.input;
      c.dataset = preset.id;
      c.last = null;
    } else if (kind === "tm") {
      const t = state.lab.tm;
      t.machine = preset.machine;
      t.input = preset.input;
      t.dataset = preset.id;
      t.last = null;
    } else {
      const r = state.lab.regex;
      r.pattern = preset.pattern;
      r.input = preset.input;
      r.dataset = preset.id;
      r.last = null;
    }
    renderLab();
  }

  function applyExample(id) {
    const ex = window.AUTO_SEED.examples.find((e) => e.id === id);
    if (!ex) return;
    applyPreset(ex.kind, ex.preset);
    runSim();
  }

  function applyMissionDataset() {
    const m = window.AUTO_SEED.missions[state.lab.mission];
    if (!m) return;
    applyPreset(m.kind, m.preset);
    toast("Đã nạp đề bài. Bấm “Chạy & kiểm tra” trong ô nhiệm vụ.");
  }

  function resetLab() {
    if (!state.lab) return;
    state.lab.tab = "regex";
    state.lab.regex = defaultBox("regex");
    state.lab.cyk = defaultBox("cyk");
    state.lab.tm = defaultBox("tm");
    state.lab.attempts = 0;
    state.lab.showHint = false;
    renderLab();
    toast("Đã về đề mặc định.");
  }

  function missionMessage(kind, html) {
    const msg = $("#autoCheckMsg");
    const status = $("#autoCheckStatus");
    if (msg) msg.innerHTML = `<div class="auto-check-msg ${kind}">${html}</div>`;
    if (status) {
      status.className = "auto-status " + (kind === "ok" ? "ok" : "err");
      status.textContent = kind === "ok" ? "Đạt" : `Sai · lần ${state.lab.attempts}`;
    }
  }

  function expectedForMission(m) {
    const preset = (window.AUTO_SEED.presets[m.kind] || []).find((p) => p.id === m.preset);
    if (!preset) return null;
    if (m.kind === "regex") return window.AutoEngine.regexRun(preset.pattern, preset.input);
    if (m.kind === "cyk") return window.AutoEngine.cykRun(preset.grammar, preset.input);
    return window.AutoEngine.tmRun(window.AUTO_SEED.machines[preset.machine], preset.input);
  }

  function checkMission() {
    const m = window.AUTO_SEED.missions[state.lab.mission];
    if (!m) return;
    const box = state.lab[m.kind];
    const last = box ? box.last : null;
    if (!last) {
      missionMessage("bad", "Chưa có kết quả. Bấm “Chạy & kiểm tra” để chạy trước.");
      return;
    }
    state.lab.attempts += 1;
    const expected = expectedForMission(m);
    if (!expected) {
      toast("Nhiệm vụ đang lỗi cấu hình, báo lại giúp mình.");
      return;
    }

    let reason = "";
    if (last.dataset !== m.preset) {
      reason = "Chưa dùng đúng đề mẫu. Bấm <b>Nạp đề bài</b> rồi chạy lại.";
    } else if (m.metric.field === "accept") {
      if (last.result.accept !== expected.accept) {
        reason = `Kết quả đang là <b>${last.result.accept ? "chấp nhận" : "từ chối"}</b>, chưa khớp.`;
      }
    } else if (m.metric.field === "dfaStates") {
      if (Number(last.result.dfaStates) !== Number(expected.dfaStates)) {
        reason = `Số trạng thái DFA đang là <b>${esc(last.result.dfaStates)}</b>, chưa khớp.`;
      }
    } else if (m.metric.field === "finalTape") {
      if (last.result.finalTape !== expected.finalTape) {
        reason = `Băng cuối đang là <b>${esc(last.result.finalTape)}</b>, chưa khớp.`;
      }
    }

    if (!reason) {
      state.lab.completed[m.id] = true;
      saveMissions();
      updateMissionUI();
      missionMessage("ok", "Chính xác. Đề mẫu, cấu hình và kết quả đều khớp.");
      toast("Đã hoàn thành nhiệm vụ: " + m.title);
      return;
    }

    if (state.lab.attempts >= 2 && !state.lab.showHint) {
      state.lab.showHint = true;
      updateMissionUI();
    }
    const hint = state.lab.attempts >= 2 ? `<br><small>Gợi ý: ${esc(m.hint)}</small>` : "";
    missionMessage("bad", `Chưa đạt. ${reason}${hint}`);
  }

  /* ----------------------------------------------------------
     Cheatsheets
     ---------------------------------------------------------- */
  function renderCheatsheets() {
    const sections = DB.cheatsheets;
    const active = sections.find((s) => s.id === state.cheat.section) || sections[0];
    state.cheat.section = active.id;
    document.title = "Cheatsheets — AutoLab";
    view.innerHTML = `
      <div class="mode-page">
        <div class="mode-head">
          <div>
            <div class="eyebrow"><span></span>Cheatsheets</div>
            <h1>Tra nhanh khi làm bài</h1>
            <p>Công thức định lượng, mẫu đồng bộ và lệnh vận hành Linux để tra nhanh khi giải bài tập.</p>
          </div>
          <div class="mode-head-right">
            <a class="btn btn-ghost" href="#/learn">Vào bài học</a>
            <a class="btn btn-primary" href="#/lab">Mở AutoLab Simulator</a>
          </div>
        </div>
        <div class="cheat-layout">
          <nav class="cheat-tabs" aria-label="Các mục cheatsheet">
            ${sections.map((s) => `<a class="cheat-tab${s.id === active.id ? " is-active" : ""}" href="#/cheatsheets/${s.id}"><span class="cheat-tab-num">${s.num}</span><span>${esc(s.title)}</span></a>`).join("")}
          </nav>
          <div class="cheat-content">
            <div class="cheat-search">
              ${UI_ICONS.search}
              <input id="cheatSearch" type="search" placeholder="Tìm trong mục này..." value="${esc(state.cheat.query)}" aria-label="Tìm trong cheatsheet">
            </div>
            <div id="cheatContent">${cheatContentHTML(active)}</div>
          </div>
        </div>
      </div>`;
  }

  function cheatContentHTML(section) {
    const query = state.cheat.query.trim().toLowerCase();
    const cards = section.cards.filter((card) => {
      if (!query) return true;
      return `${card.title} ${stripHTML(card.html)}`.toLowerCase().includes(query);
    });
    const intro = `
      <div class="cheat-intro">
        <h2>${esc(section.title)}</h2>
        <p>${esc(section.intro)}</p>
        ${query ? `<p style="margin-top:6px;font-size:.68rem;color:var(--text-faint)">${cards.length} kết quả cho “${esc(state.cheat.query.trim())}”.</p>` : ""}
      </div>`;
    if (!cards.length) {
      return `${intro}<div class="no-results">Không tìm thấy nội dung phù hợp. <button class="btn btn-ghost btn-sm" type="button" data-action="clear-cheat-search" style="margin-left:6px">Xóa tìm kiếm</button></div>`;
    }
    return `${intro}<div class="cheat-grid">${cards.map((card, i) => `
      <article class="cheat-card${card.wide ? " wide" : ""}">
        <h3><span class="num">${section.num}.${String(i + 1).padStart(2, "0")}</span>${esc(card.title)}</h3>
        ${card.html}
      </article>`).join("")}</div>`;
  }

  function renderCheatContent() {
    const content = $("#cheatContent");
    const section = DB.cheatsheets.find((s) => s.id === state.cheat.section) || DB.cheatsheets[0];
    if (!content || !section) return;
    content.innerHTML = cheatContentHTML(section);
  }

  function handleViewClick(e) {
    const stepBtn = e.target.closest("[data-step]");
    if (stepBtn && state.route.view === "learn" && !e.target.closest("[data-action]")) {
      const target = parseInt(stepBtn.dataset.step, 10);
      if (target) goToStep(target);
      return;
    }
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "fullscreen") toggleFullscreen();
    else if (action === "toggle-play") togglePlayer();
    else if (action === "replay") replayLesson();
    else if (action === "prev-step") goToStep(state.lesson.step - 1);
    else if (action === "next-step") goToStep(state.lesson.step + 1);
    else if (action === "cycle-speed") cycleSpeed();
    else if (action === "restart-practice") restartPractice();
    else if (action === "answer") answerPractice(parseInt(btn.dataset.option, 10));
    else if (action === "next-question") nextPracticeQuestion();
    else if (action === "clear-cheat-search") {
      state.cheat.query = "";
      const input = $("#cheatSearch");
      if (input) input.value = "";
      renderCheatContent();
      if (input) input.focus();
    } else if (action === "auto-tab") {
      state.lab.tab = ["regex", "cyk", "tm"].indexOf(btn.dataset.tab) >= 0 ? btn.dataset.tab : "regex";
      renderLab();
    } else if (action === "auto-run") {
      runSim();
    } else if (action === "auto-reset") {
      resetLab();
    } else if (action === "auto-preset") {
      applyPreset(btn.dataset.kind, btn.dataset.preset);
      runSim();
    } else if (action === "auto-example") {
      applyExample(btn.dataset.example);
    } else if (action === "auto-mission") {
      state.lab.mission = parseInt(btn.dataset.mission, 10) || 0;
      state.lab.attempts = 0;
      state.lab.showHint = false;
      updateMissionUI();
    } else if (action === "auto-mission-load") {
      applyMissionDataset();
    } else if (action === "auto-mission-check") {
      const m = window.AUTO_SEED.missions[state.lab.mission];
      if (m && m.kind !== state.lab.tab) {
        state.lab.tab = m.kind;
        renderLab();
      }
      runSim({ check: true });
    } else if (action === "auto-hint") {
      state.lab.showHint = !state.lab.showHint;
      updateMissionUI();
    }
  }

  function handleViewInput(e) {
    if (e.target.id === "cheatSearch") {
      state.cheat.query = e.target.value;
      renderCheatContent();
      return;
    }
    const el = e.target;
    const key = el.dataset ? el.dataset.auto : "";
    if (!key || !state.lab) return;
    const box = state.lab[state.lab.tab];
    if (!box) return;
    if (key === "r-pattern") {
      if (el.value !== box.pattern) box.dataset = null;
      box.pattern = el.value;
    } else if (key === "r-input") {
      if (el.value !== box.input) box.dataset = null;
      box.input = el.value;
    } else if (key === "g-grammar") {
      if (el.value !== box.grammar) box.dataset = null;
      box.grammar = el.value;
    } else if (key === "g-input") {
      if (el.value !== box.input) box.dataset = null;
      box.input = el.value;
    } else if (key === "t-machine") {
      if (el.value !== box.machine) box.dataset = null;
      box.machine = el.value;
    } else if (key === "t-input") {
      if (el.value !== box.input) box.dataset = null;
      box.input = el.value;
    }
  }

  function handleViewChange(e) {
    const el = e.target;
    if (el && el.dataset && el.dataset.auto) handleViewInput(e);
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    initTheme();
    buildSearchIndex();
    bindGlobalEvents();
    updateChrome();
    syncTopbarOffset();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncTopbarOffset);
    onRoute();
  }

  init();
})();
