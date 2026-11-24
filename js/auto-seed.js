/* AutoLab — đề mẫu cho phòng mô phỏng. */
window.AUTO_SEED = (function () {
  "use strict";

  const machines = {
    "bin-inc": {
      id: "bin-inc",
      label: "Cộng 1 vào số nhị phân",
      note: "Đầu đọc chạy tới cuối, rồi cộng có nhớ từ phải sang trái.",
      alphabet: ["0", "1"],
      blank: "_",
      start: "q0",
      accept: "q2",
      reject: "qR",
      maxSteps: 120,
      rules: [
        { state: "q0", read: "0", write: "0", move: "R", next: "q0" },
        { state: "q0", read: "1", write: "1", move: "R", next: "q0" },
        { state: "q0", read: "_", write: "_", move: "L", next: "q1" },
        { state: "q1", read: "1", write: "0", move: "L", next: "q1" },
        { state: "q1", read: "0", write: "1", move: "L", next: "q2" },
        { state: "q1", read: "_", write: "1", move: "L", next: "q2" }
      ]
    },
    "eq01": {
      id: "eq01",
      label: "0ⁿ1ⁿ — đếm cặp bằng nhau",
      note: "Đánh dấu từng cặp 0…1 bằng X và Y; chuỗi đúng khi không còn 0 lẫn 1.",
      alphabet: ["0", "1"],
      blank: "_",
      start: "q0",
      accept: "qA",
      reject: "qR",
      maxSteps: 200,
      rules: [
        { state: "q0", read: "0", write: "X", move: "R", next: "q1" },
        { state: "q0", read: "Y", write: "Y", move: "R", next: "q4" },
        { state: "q0", read: "1", write: "1", move: "R", next: "qR" },
        { state: "q1", read: "0", write: "0", move: "R", next: "q1" },
        { state: "q1", read: "Y", write: "Y", move: "R", next: "q1" },
        { state: "q1", read: "1", write: "Y", move: "L", next: "q2" },
        { state: "q2", read: "0", write: "0", move: "L", next: "q2" },
        { state: "q2", read: "Y", write: "Y", move: "L", next: "q2" },
        { state: "q2", read: "X", write: "X", move: "R", next: "q0" },
        { state: "q4", read: "Y", write: "Y", move: "R", next: "q4" },
        { state: "q4", read: "1", write: "1", move: "R", next: "qR" },
        { state: "q4", read: "_", write: "_", move: "R", next: "qA" }
      ]
    },
    "unary-inc": {
      id: "unary-inc",
      label: "Cộng 1 số một ngôi",
      note: "Quét hết các số 1 rồi ghi thêm một số 1 ở cuối băng.",
      alphabet: ["1"],
      blank: "_",
      start: "q0",
      accept: "q1",
      reject: "qR",
      maxSteps: 80,
      rules: [
        { state: "q0", read: "1", write: "1", move: "R", next: "q0" },
        { state: "q0", read: "_", write: "1", move: "R", next: "q1" }
      ]
    },
    "even-ones": {
      id: "even-ones",
      label: "Chuỗi nhị phân có chẵn số 1",
      note: "Hai trạng thái đủ nhớ tính chẵn lẻ; cuối chuỗi quyết định nhận hay từ chối.",
      alphabet: ["0", "1"],
      blank: "_",
      start: "q0",
      accept: "qA",
      reject: "qR",
      maxSteps: 120,
      rules: [
        { state: "q0", read: "0", write: "0", move: "R", next: "q0" },
        { state: "q0", read: "1", write: "1", move: "R", next: "q1" },
        { state: "q0", read: "_", write: "_", move: "R", next: "qA" },
        { state: "q1", read: "0", write: "0", move: "R", next: "q1" },
        { state: "q1", read: "1", write: "1", move: "R", next: "q0" },
        { state: "q1", read: "_", write: "_", move: "R", next: "qR" }
      ]
    }
  };

  const presets = {
    regex: [
      {
        id: "rx-abb",
        label: "Kết thúc bằng abb",
        note: "Biểu thức kinh điển (a|b)*abb — chuỗi nhập aababb.",
        pattern: "(a|b)*abb",
        input: "aababb"
      },
      {
        id: "rx-abplus",
        label: "Lặp nhóm ab",
        note: "(ab)+ chỉ nhận các chuỗi ghép từ một hay nhiều khối ab.",
        pattern: "(ab)+",
        input: "ababab"
      },
      {
        id: "rx-trap",
        label: "Bẫy đuôi ab",
        note: "Cùng biểu thức (a|b)*abb nhưng chuỗi kết thúc ab — một ca từ chối.",
        pattern: "(a|b)*abb",
        input: "abab"
      },
      {
        id: "rx-star",
        label: "Sao và cộng",
        note: "a*b+ nghĩa là một dãy a tùy ý (kể cả rỗng) rồi ít nhất một b.",
        pattern: "a*b+",
        input: "aaabb"
      }
    ],
    cyk: [
      {
        id: "cyk-anbn",
        label: "0ⁿ1ⁿ dạng CNF",
        note: "Sinh đúng các chuỗi a…ab…b có số a bằng số b. Chuỗi nhập aaabbb.",
        input: "aaabbb",
        grammar: "S -> A T | A B\nT -> S B\nA -> a\nB -> b"
      },
      {
        id: "cyk-mismatch",
        label: "Lệch một ký tự",
        note: "Vẫn là văn phạm 0ⁿ1ⁿ nhưng chuỗi aabbb thiếu một a.",
        input: "aabbb",
        grammar: "S -> A T | A B\nT -> S B\nA -> a\nB -> b"
      },
      {
        id: "cyk-aplusbplus",
        label: "Mọi a⁺b⁺",
        note: "Văn phạm A → AA | a và B → BB | b sinh mọi chuỗi a⁺b⁺, không đòi bằng nhau.",
        input: "aabbb",
        grammar: "S -> A B\nA -> A A | a\nB -> B B | b"
      }
    ],
    tm: [
      { id: "tm-bin", machine: "bin-inc", input: "1011", label: "Cộng 1 nhị phân", note: "1011₂ + 1 = 1100₂. Theo dõi bit nhớ lan sang trái." },
      { id: "tm-eq", machine: "eq01", input: "000111", label: "0ⁿ1ⁿ", note: "Ba số 0 rồi ba số 1 — máy đánh dấu từng cặp." },
      { id: "tm-unary", machine: "unary-inc", input: "111", label: "Một ngôi +1", note: "Ba vạch thành bốn vạch; minh họa băng và đầu đọc." },
      { id: "tm-even", machine: "even-ones", input: "1010", label: "Chẵn số 1", note: "Chuỗi có hai số 1 nên được nhận." }
    ]
  };

  const examples = [
    { id: "ex-abb", label: "Regex · kết thúc abb", kind: "regex", preset: "rx-abb" },
    { id: "ex-trap", label: "Regex · bẫy ab", kind: "regex", preset: "rx-trap" },
    { id: "ex-ab", label: "Regex · lặp ab", kind: "regex", preset: "rx-abplus" },
    { id: "ex-star", label: "Regex · a*b+", kind: "regex", preset: "rx-star" },
    { id: "ex-anbn", label: "CYK · aⁿbⁿ đúng", kind: "cyk", preset: "cyk-anbn" },
    { id: "ex-mismatch", label: "CYK · lệch ký tự", kind: "cyk", preset: "cyk-mismatch" },
    { id: "ex-tm-bin", label: "TM · cộng nhị phân", kind: "tm", preset: "tm-bin" },
    { id: "ex-tm-eq", label: "TM · 0ⁿ1ⁿ", kind: "tm", preset: "tm-eq" }
  ];

  const missions = [
    {
      id: "m-abb",
      kind: "regex",
      title: "Regex: chuỗi có kết thúc abb?",
      prompt: "Nạp đề “Kết thúc bằng abb” rồi chạy với chuỗi aababb. Kết quả là chấp nhận hay từ chối?",
      hint: "Theo dõi tập trạng thái NFA sau từng ký tự. Ba ký tự cuối phải lần lượt dẫn tới trạng thái nhận.",
      preset: "rx-abb",
      metric: { field: "accept" }
    },
    {
      id: "m-dfa",
      kind: "regex",
      title: "Đếm trạng thái DFA của (ab)+",
      prompt: "Nạp đề “Lặp nhóm ab” và chạy. Sau khi subset construction, DFA có bao nhiêu trạng thái?",
      hint: "Chỉ tính trạng thái đến được từ trạng thái đầu. Chuỗi không thể bắt đầu bằng b nên có vài chuyển không tồn tại.",
      preset: "rx-abplus",
      metric: { field: "dfaStates" }
    },
    {
      id: "m-trap",
      kind: "regex",
      title: "Regex: cái bẫy đuôi ab",
      prompt: "Nạp đề “Bẫy đuôi ab” (cùng biểu thức, chuỗi abab) và chạy. Máy có chấp nhận không?",
      hint: "Kết thúc bằng abb cần hai chữ b liên tiếp ở cuối; abab chỉ có một b ở cuối.",
      preset: "rx-trap",
      metric: { field: "accept" }
    },
    {
      id: "m-cyk",
      kind: "cyk",
      title: "CYK: chuỗi lệch số lượng",
      prompt: "Nạp đề “Lệch một ký tự” rồi chạy CYK. Văn phạm 0ⁿ1ⁿ có sinh ra aabbb không?",
      hint: "Xem ô tam giác phía trên bên phải: S chỉ xuất hiện khi số a và số b khớp nhau.",
      preset: "cyk-mismatch",
      metric: { field: "accept" }
    },
    {
      id: "m-bin",
      kind: "tm",
      title: "Máy Turing: cộng 1",
      prompt: "Nạp đề “Cộng 1 nhị phân” với băng 1011 và chạy tới khi dừng. Băng cuối cùng (bỏ ô trống hai đầu) là gì?",
      hint: "Bit cuối là 1 nên thành 0 và nhớ sang trái; gặp 0 đầu tiên thì đổi thành 1 và dừng.",
      preset: "tm-bin",
      metric: { field: "finalTape" }
    },
    {
      id: "m-eq",
      kind: "tm",
      title: "Máy Turing: băng sau khi đánh dấu",
      prompt: "Nạp đề “0ⁿ1ⁿ” với băng 000111 và chạy tới khi dừng. Băng cuối cùng (bỏ ô trống hai đầu) là gì?",
      hint: "Mỗi cặp 0…1 bị thay bằng X…Y. Xếp đúng thứ tự các ký tự còn lại trên băng.",
      preset: "tm-eq",
      metric: { field: "finalTape" }
    }
  ];

  const defaults = {
    regex: presets.regex[0],
    cyk: presets.cyk[0],
    tm: presets.tm[0]
  };

  return { machines, presets, examples, missions, defaults };
})();
