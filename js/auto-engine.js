/* AutoLab — engine automata: regex → NFA → DFA, CYK, máy Turing. */
window.AutoEngine = (function () {
  "use strict";

  /* ---------------- Regex → NFA ---------------- */

  function parseRegex(source) {
    const src = String(source == null ? "" : source);
    let i = 0;

    function fail(message) {
      throw new Error(message);
    }

    function parseAlt() {
      const alts = [parseCat()];
      while (src[i] === "|") {
        i += 1;
        alts.push(parseCat());
      }
      return alts.length === 1 ? alts[0] : { type: "alt", alts };
    }

    function parseCat() {
      const parts = [];
      while (i < src.length && src[i] !== "|" && src[i] !== ")") {
        parts.push(parseRepeat());
      }
      if (!parts.length) return { type: "eps" };
      return parts.length === 1 ? parts[0] : { type: "cat", parts };
    }

    function parseRepeat() {
      let node = parseAtom();
      while (i < src.length && (src[i] === "*" || src[i] === "+" || src[i] === "?")) {
        const op = src[i];
        i += 1;
        if (op === "*") node = { type: "star", node };
        else if (op === "+") node = { type: "plus", node };
        else node = { type: "opt", node };
      }
      return node;
    }

    function parseAtom() {
      if (i >= src.length) fail("Regex kết thúc đột ngột.");
      const ch = src[i];
      if (ch === "(") {
        i += 1;
        const node = parseAlt();
        if (src[i] !== ")") fail("Thiếu dấu ) đóng nhóm.");
        i += 1;
        return node;
      }
      if (ch === ")") fail("Thừa dấu ) trong regex.");
      if (ch === "\\") {
        i += 1;
        if (i >= src.length) fail("Dấu \\ không đi kèm ký tự nào.");
        const lit = src[i];
        i += 1;
        return { type: "lit", ch: lit };
      }
      if (/[A-Za-z0-9]/.test(ch)) {
        i += 1;
        return { type: "lit", ch };
      }
      if (ch === " ") {
        i += 1;
        return parseAtom();
      }
      fail("Ký tự “" + ch + "” không thuộc cú pháp hỗ trợ. Dùng chữ, số, ( ) | * + ?");
      return null;
    }

    const ast = parseAlt();
    if (i < src.length) fail("Còn ký tự thừa trong regex: “" + src.slice(i) + "”.");
    return ast;
  }

  function collectAlphabet(ast, set) {
    if (!ast) return set;
    if (ast.type === "lit") set.add(ast.ch);
    else if (ast.type === "cat") ast.parts.forEach((part) => collectAlphabet(part, set));
    else if (ast.type === "alt") ast.alts.forEach((part) => collectAlphabet(part, set));
    else if (ast.node) collectAlphabet(ast.node, set);
    return set;
  }

  function buildNFA(ast) {
    const transitions = [];
    let counter = 0;

    function state() {
      const id = "n" + counter;
      counter += 1;
      return id;
    }
    function link(from, to, ch) {
      transitions.push({ from, to, ch });
    }

    function build(node) {
      if (node.type === "eps") {
        const start = state();
        const end = state();
        link(start, end, null);
        return { start, end };
      }
      if (node.type === "lit") {
        const start = state();
        const end = state();
        link(start, end, node.ch);
        return { start, end };
      }
      if (node.type === "cat") {
        let start = null;
        let end = null;
        node.parts.forEach((part) => {
          const frag = build(part);
          if (start === null) start = frag.start;
          else link(end, frag.start, null);
          end = frag.end;
        });
        return { start, end };
      }
      if (node.type === "alt") {
        const start = state();
        const end = state();
        node.alts.forEach((part) => {
          const frag = build(part);
          link(start, frag.start, null);
          link(frag.end, end, null);
        });
        return { start, end };
      }
      if (node.type === "star") {
        const start = state();
        const end = state();
        const frag = build(node.node);
        link(start, frag.start, null);
        link(start, end, null);
        link(frag.end, frag.start, null);
        link(frag.end, end, null);
        return { start, end };
      }
      if (node.type === "plus") {
        const start = state();
        const end = state();
        const frag = build(node.node);
        link(start, frag.start, null);
        link(frag.end, frag.start, null);
        link(frag.end, end, null);
        return { start, end };
      }
      const start = state();
      const end = state();
      const frag = build(node.node);
      link(start, frag.start, null);
      link(start, end, null);
      link(frag.end, end, null);
      return { start, end };
    }

    const frag = build(ast);
    return { start: frag.start, accept: frag.end, states: counter, transitions };
  }

  function epsilonClosure(nfa, seed) {
    const stack = seed.slice();
    const seen = new Set(seed);
    while (stack.length) {
      const id = stack.pop();
      nfa.transitions.forEach((t) => {
        if (t.from === id && t.ch === null && !seen.has(t.to)) {
          seen.add(t.to);
          stack.push(t.to);
        }
      });
    }
    return Array.from(seen).sort();
  }

  function moveSet(nfa, set, ch) {
    const out = new Set();
    nfa.transitions.forEach((t) => {
      if (t.ch === ch && set.indexOf(t.from) >= 0) out.add(t.to);
    });
    return Array.from(out).sort();
  }

  function nfaToDfa(nfa, alphabet) {
    const startSet = epsilonClosure(nfa, [nfa.start]);
    const keyOf = (set) => set.join(",");
    const ids = {};
    const states = [];
    const trans = {};
    const queue = [];

    function register(set) {
      const key = keyOf(set);
      if (ids[key]) return ids[key];
      const label = String.fromCharCode(65 + states.length);
      ids[key] = label;
      states.push({ id: label, set: set.slice(), accept: set.indexOf(nfa.accept) >= 0, start: states.length === 0 });
      trans[label] = {};
      queue.push(set);
      return label;
    }

    register(startSet);
    while (queue.length) {
      const set = queue.shift();
      const from = ids[keyOf(set)];
      alphabet.forEach((ch) => {
        const moved = moveSet(nfa, set, ch);
        if (!moved.length) return;
        const closed = epsilonClosure(nfa, moved);
        const to = register(closed);
        trans[from][ch] = to;
      });
    }

    return {
      states,
      trans,
      start: states[0] ? states[0].id : "A",
      accept: states.filter((s) => s.accept).map((s) => s.id)
    };
  }

  function simulate(nfa, dfa, alphabet, input) {
    const rows = [];
    let nfaSet = epsilonClosure(nfa, [nfa.start]);
    let dfaId = dfa.start;
    let ok = true;

    for (let i = 0; i < input.length; i += 1) {
      const ch = input[i];
      if (alphabet.indexOf(ch) < 0) {
        rows.push({ i: i + 1, ch, nfaSet: [], dfaId: null, note: "ký tự ngoài bảng chữ cái" });
        ok = false;
        break;
      }
      const moved = moveSet(nfa, nfaSet, ch);
      nfaSet = epsilonClosure(nfa, moved);
      const next = dfa.trans[dfaId] ? dfa.trans[dfaId][ch] : null;
      if (!next) {
        rows.push({ i: i + 1, ch, nfaSet, dfaId: null, note: "không có chuyển" });
        ok = false;
        dfaId = null;
        break;
      }
      dfaId = next;
      rows.push({ i: i + 1, ch, nfaSet, dfaId });
    }

    const accept = ok && dfaId !== null && dfa.accept.indexOf(dfaId) >= 0;
    return { rows, accept, finalDfa: dfaId, finalNfa: nfaSet };
  }

  function regexRun(pattern, input) {
    const raw = String(pattern == null ? "" : pattern).trim();
    if (!raw) throw new Error("Nhập một biểu thức chính quy trước khi chạy.");
    const ast = parseRegex(raw);
    const alphabet = Array.from(collectAlphabet(ast, new Set())).sort();
    const nfa = buildNFA(ast);
    const dfa = nfaToDfa(nfa, alphabet.length ? alphabet : ["a"]);
    const sim = simulate(nfa, dfa, alphabet.length ? alphabet : ["a"], String(input == null ? "" : input).trim());
    return {
      pattern: raw,
      alphabet,
      nfaStates: nfa.states,
      nfaEdges: nfa.transitions.length,
      dfaStates: dfa.states.length,
      dfaEdges: Object.keys(dfa.trans).reduce((sum, id) => sum + Object.keys(dfa.trans[id]).length, 0),
      dfa,
      trace: sim.rows,
      accept: sim.accept,
      steps: sim.rows.length,
      input: String(input == null ? "" : input).trim()
    };
  }

  /* ---------------- Văn phạm CNF & CYK ---------------- */

  const NT = /^[A-Z][A-Z0-9']*$/;
  const TERM = /^[a-z0-9]$/;

  function parseGrammar(text) {
    const lines = String(text == null ? "" : text).split(/\n|;/).map((s) => s.trim()).filter(Boolean);
    if (!lines.length) throw new Error("Nhập ít nhất một luật sinh.");
    const rules = [];
    let start = null;
    lines.forEach((line) => {
      const m = line.match(/^([A-Z][A-Z0-9']*)\s*(?:->|→)\s*(.+)$/);
      if (!m) throw new Error("Luật “" + line + "” không đúng dạng A -> ...");
      const lhs = m[1];
      if (start === null) start = lhs;
      m[2].split("|").map((s) => s.trim()).filter(Boolean).forEach((alt) => {
        const rhs = alt.replace(/\s+/g, "");
        if (TERM.test(rhs)) {
          rules.push({ lhs, pair: null, term: rhs });
        } else if (rhs.length === 2 && NT.test(rhs[0]) && NT.test(rhs[1])) {
          rules.push({ lhs, pair: [rhs[0], rhs[1]], term: null });
        } else {
          throw new Error("Luật “" + lhs + " → " + alt + "” chưa ở dạng CNF. Chỉ nhận A → BC hoặc A → a.");
        }
      });
    });
    const nonterminals = Array.from(new Set(rules.map((r) => r.lhs)));
    return { start, rules, nonterminals, source: String(text).trim() };
  }

  function cykRun(grammarText, input) {
    const grammar = parseGrammar(grammarText);
    const word = String(input == null ? "" : input).trim();
    if (!word) throw new Error("Nhập chuỗi cần kiểm tra (không để trống).");
    const n = word.length;
    const table = Array.from({ length: n }, () => Array.from({ length: n }, () => null));

    for (let i = 0; i < n; i += 1) {
      const set = new Set();
      grammar.rules.forEach((r) => {
        if (r.term === word[i]) set.add(r.lhs);
      });
      table[i][i] = Array.from(set).sort();
    }

    for (let len = 2; len <= n; len += 1) {
      for (let i = 0; i + len - 1 < n; i += 1) {
        const j = i + len - 1;
        const set = new Set();
        for (let k = i; k < j; k += 1) {
          const left = table[i][k] || [];
          const right = table[k + 1][j] || [];
          if (!left.length || !right.length) continue;
          grammar.rules.forEach((r) => {
            if (!r.pair) return;
            if (left.indexOf(r.pair[0]) >= 0 && right.indexOf(r.pair[1]) >= 0) set.add(r.lhs);
          });
        }
        table[i][j] = Array.from(set).sort();
      }
    }

    let cells = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = i; j < n; j += 1) {
        cells += table[i][j] ? table[i][j].length : 0;
      }
    }

    const top = table[0][n - 1] || [];
    return {
      grammar,
      input: word,
      table,
      accept: top.indexOf(grammar.start) >= 0,
      cells,
      top,
      length: n
    };
  }

  /* ---------------- Máy Turing ---------------- */

  function tmRun(machine, input) {
    if (!machine || !machine.rules) throw new Error("Chưa chọn máy Turing.");
    const blank = machine.blank || "_";
    const raw = String(input == null ? "" : input).trim();
    const allowed = machine.alphabet || [];
    if (allowed.length && Array.from(raw).some((ch) => allowed.indexOf(ch) < 0)) {
      throw new Error("Chuỗi nhập chỉ được dùng các ký tự: " + allowed.join(", "));
    }
    const tape = raw ? raw.split("") : [blank];
    let head = 0;
    let state = machine.start;
    let steps = 0;
    const maxSteps = machine.maxSteps || 200;
    const trace = [];

    while (steps < maxSteps && state !== machine.accept && state !== machine.reject) {
      const read = tape[head] == null ? blank : tape[head];
      const rule = machine.rules.find((r) => r.state === state && r.read === read);
      if (!rule) {
        trace.push({ step: steps + 1, state, read, write: read, move: "–", next: "dừng", note: "không có luật" });
        break;
      }
      const before = state;
      tape[head] = rule.write;
      if (rule.move === "R") head += 1;
      else if (rule.move === "L") head -= 1;
      if (head < 0) {
        tape.unshift(blank);
        head = 0;
      }
      if (head >= tape.length) tape.push(blank);
      state = rule.next;
      steps += 1;
      trace.push({ step: steps, state: before, read, write: rule.write, move: rule.move, next: rule.next, note: "" });
    }

    const accept = state === machine.accept;
    const rejected = state === machine.reject;
    const finalTape = tape.join("").replace(/^_+|_+$/g, "") || blank;
    return {
      machine,
      input: raw,
      accept,
      rejected,
      halted: accept || rejected,
      maxed: !accept && !rejected && steps >= maxSteps,
      steps,
      state,
      tape,
      head,
      trace,
      finalTape
    };
  }

  return { regexRun, cykRun, tmRun, parseGrammar };
})();
