/* AutoLab course data — phần 3: tối thiểu hóa, bổ đề bơm, CFG, dẫn xuất */
(function () {
  "use strict";

  const L = window.AUTOLAB.lessons;

  L["toi-thieu"] = {
    id: "toi-thieu",
    module: "machines",
    title: "Tối thiểu hóa DFA",
    shortTitle: "Tối thiểu",
    subtitle: "Hai trạng thái tương đương nếu mọi chuỗi tiếp theo đều dẫn tới cùng một kết luận nhận/từ chối. Gộp các lớp tương đương lại, ta được DFA nhỏ nhất nhận đúng ngôn ngữ.",
    blurb: "Gộp trạng thái không thể phân biệt.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["minimization", "equivalence", "partition", "dfa", "quotient"],
    metrics: [
      { key: "truoc", label: "Trước", tone: "yellow" },
      { key: "lop", label: "Lớp", tone: "blue" },
      { key: "sau", label: "Sau", tone: "green" },
      { key: "td", label: "Tương đương", tone: "violet" }
    ],
    nodes: [
      { id: "dfa", type: "dfa", x: 50, y: 80, w: 200, h: 70, label: "DFA ban đầu", sub: "6 trạng thái" },
      { id: "part", type: "grid", x: 330, y: 80, w: 210, h: 70, label: "Phân hoạch", sub: "{F}, {Q−F}" },
      { id: "split", type: "merge", x: 620, y: 80, w: 195, h: 70, label: "Tách lớp", sub: "theo đích khác lớp" },
      { id: "quot", type: "table", x: 50, y: 315, w: 200, h: 70, label: "Máy thương", sub: "mỗi lớp một trạng thái" },
      { id: "mini", type: "accept", x: 330, y: 315, w: 210, h: 70, label: "DFA tối thiểu", sub: "4 trạng thái" },
      { id: "same", type: "check", x: 620, y: 315, w: 195, h: 70, label: "Tương đương", sub: "cùng ngôn ngữ" }
    ],
    edges: [
      { id: "dfa-part", from: "dfa", to: "part", kind: "data", label: "khởi tạo" },
      { id: "part-split", from: "part", to: "split", kind: "request", label: "tinh chỉnh" },
      { id: "split-quot", from: "split", to: "quot", kind: "data", label: "lặp tới ổn định" },
      { id: "quot-mini", from: "quot", to: "mini", kind: "data", label: "gộp" },
      { id: "mini-same", from: "mini", to: "same", kind: "response", label: "chứng nhận" },
      { id: "split-part", from: "split", to: "part", kind: "data", label: "cập nhật", bow: 24 }
    ],
    learn: [
      "Định nghĩa hai trạng thái tương đương.",
      "Chạy thuật toán phân hoạch tinh chỉnh.",
      "Dựng máy thương từ các lớp tương đương.",
      "Giải thích vì sao DFA tối thiểu là duy nhất sai khác tên trạng thái."
    ],
    steps: [
      {
        short: "Vì sao gộp",
        type: "TỔNG QUAN",
        title: "DFA dư trạng thái",
        body: "Subset construction thường sinh trạng thái không cần thiết: hai trạng thái có thể hành xử giống hệt nhau với mọi chuỗi tiếp theo. Gộp chúng không đổi ngôn ngữ nhưng giảm bộ nhớ và bảng chuyển — quan trọng khi triển khai lexer hoặc bộ lọc mẫu.",
        focus: ["dfa", "part"],
        edges: ["dfa-part"],
        metrics: { truoc: "6", lop: "2", sau: "6", td: "chưa gộp" },
        changes: ["Nhận diện trạng thái dư", "Khởi tạo hai lớp"],
        note: "Tối thiểu hóa không làm DFA mạnh hơn; nó chỉ chọn đại diện nhỏ nhất của cùng ngôn ngữ."
      },
      {
        short: "Phân biệt",
        type: "KỸ THUẬT",
        title: "Thế nào là tương đương",
        body: "Hai trạng thái <code>p, q</code> tương đương nếu với mọi chuỗi <code>w</code>, đọc <code>w</code> từ <code>p</code> và từ <code>q</code> đều cho cùng kết luận nhận hoặc cùng từ chối. Ban đầu ta chỉ chắc chắn: trạng thái nhận khác trạng thái không nhận. Các cặp khác được tách dần khi có đường dẫn tới cặp đã biết khác.",
        focus: ["part", "split"],
        edges: ["part-split"],
        metrics: { truoc: "6", lop: "2", sau: "6", td: "F vs Q−F" },
        changes: ["Chia nhận / không nhận", "Chuẩn bị tinh chỉnh"],
        note: "“Tương đương” ở đây là quan hệ tương đương thật: phản xạ, đối xứng, bắc cầu — nhờ vậy mới gộp thành lớp."
      },
      {
        short: "Tinh chỉnh",
        type: "KỸ THUẬT",
        title: "Tách lớp theo đích đến",
        body: "Lặp: với mỗi lớp, xét từng cặp trạng thái. Nếu tồn tại ký tự <code>c</code> đưa hai trạng thái tới hai lớp khác nhau, tách chúng sang lớp mới. Lặp tới khi không lớp nào tách được nữa. Khi ổn định, mỗi lớp là một tập trạng thái không thể phân biệt.",
        focus: ["split"],
        edges: ["split-part", "part-split"],
        metrics: { truoc: "6", lop: "3", sau: "6", td: "tinh chỉnh" },
        changes: ["So đích theo ký tự", "Tách lớp khi khác"],
        note: "Thuật toán Hopcroft dùng cấu trúc tinh tế để chạy nhanh hơn; bản phân hoạch đơn giản trong bài là đủ để hiểu và làm bài thi."
      },
      {
        short: "Máy thương",
        type: "KỸ THUẬT",
        title: "Mỗi lớp một trạng thái",
        body: "Sau khi phân hoạch ổn định, dựng DFA mới: mỗi lớp là một trạng thái. Lớp chứa trạng thái bắt đầu là bắt đầu mới; lớp chứa trạng thái nhận là nhận. Chuyển từ lớp <code>[p]</code> bằng <code>c</code> tới lớp <code>[δ(p,c)]</code>. Các đại diện trong cùng lớp cho cùng đích nên định nghĩa hợp lệ.",
        focus: ["quot", "mini"],
        edges: ["split-quot", "quot-mini"],
        metrics: { truoc: "6", lop: "4", sau: "4", td: "máy thương" },
        changes: ["Gộp lớp", "Bảng chuyển mới"],
        note: "Nếu DFA ban đầu có trạng thái bẫy, nó có thể tạo lớp riêng. Có thể bỏ bẫy nếu chấp nhận DFA không đầy đủ."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Nhỏ nhất và duy nhất",
        body: "DFA tối thiểu nhận cùng ngôn ngữ, không còn cặp trạng thái tương đương, và là duy nhất nếu bỏ qua tên trạng thái. Đây là công cụ so sánh hai DFA: tối thiểu hóa cả hai rồi kiểm tra đẳng cấu. Với regex, chuỗi Thompson → subset → tối thiểu cho máy nhỏ nhất nhận mẫu.",
        focus: "all",
        edges: "all",
        metrics: { truoc: "6", lop: "4", sau: "4", td: "duy nhất" },
        changes: ["Biết quy trình chuẩn", "So sánh DFA"],
        note: "Bài tiếp theo chứng minh có ngôn ngữ không chính quy, nên regex và DFA có giới hạn cứng."
      }
    ]
  };

  L["bom"] = {
    id: "bom",
    module: "machines",
    title: "Bổ đề bơm cho ngôn ngữ chính quy",
    shortTitle: "Bổ đề bơm",
    subtitle: "Mọi ngôn ngữ chính quy đều có một độ dài p sao cho chuỗi đủ dài luôn chứa một đoạn lặp bơm được. Dùng bổ đề để chứng minh một ngôn ngữ không chính quy bằng phản chứng.",
    blurb: "Chứng minh “không thể” bằng một vòng lặp.",
    duration: "14 phút",
    level: "Nâng cao",
    tags: ["pumping lemma", "regular", "contradiction", "pigeonhole", "anbn"],
    metrics: [
      { key: "p", label: "Độ dài bơm", tone: "blue" },
      { key: "xy", label: "|xy| ≤ p", tone: "coral" },
      { key: "lap", label: "Đoạn lặp", tone: "yellow" },
      { key: "ket", label: "Kết luận", tone: "violet" }
    ],
    nodes: [
      { id: "p", type: "clock", x: 50, y: 80, w: 190, h: 70, label: "Độ dài p", sub: "số trạng thái DFA" },
      { id: "xyz", type: "string", x: 320, y: 80, w: 220, h: 70, label: "w = xyz", sub: "|w| ≥ p" },
      { id: "loop", type: "pump", x: 620, y: 80, w: 195, h: 70, label: "Bơm y", sub: "xyⁱz ∈ L" },
      { id: "state", type: "grid", x: 50, y: 315, w: 190, h: 70, label: "Chuồng bồ câu", sub: "p+1 lần đọc, p trạng thái" },
      { id: "bad", type: "reject", x: 320, y: 315, w: 220, h: 70, label: "Mâu thuẫn", sub: "bơm ra ngoài ngôn ngữ" },
      { id: "done", type: "check", x: 620, y: 315, w: 195, h: 70, label: "Không chính quy", sub: "kết luận" }
    ],
    edges: [
      { id: "p-xyz", from: "p", to: "xyz", kind: "data", label: "chọn chuỗi dài" },
      { id: "xyz-loop", from: "xyz", to: "loop", kind: "request", label: "bơm" },
      { id: "p-state", from: "p", to: "state", kind: "data", label: "đếm trạng thái" },
      { id: "state-bad", from: "state", to: "bad", kind: "data", label: "phát hiện lặp" },
      { id: "loop-bad", from: "loop", to: "bad", kind: "data", label: "vi phạm" },
      { id: "bad-done", from: "bad", to: "done", kind: "response", label: "kết luận" }
    ],
    learn: [
      "Phát biểu bổ đề bơm với đủ ba điều kiện.",
      "Chọn chuỗi phản ví dụ đúng cách.",
      "Trình bày chứng minh phản chứng theo mẫu.",
      "Áp dụng cho aⁿbⁿ và các ngôn ngữ đếm tương tự."
    ],
    steps: [
      {
        short: "Phát biểu",
        type: "TỔNG QUAN",
        title: "Ba điều kiện của bổ đề",
        body: "Nếu <code>L</code> chính quy, tồn tại <code>p</code> sao cho mọi <code>w ∈ L</code> với <code>|w| ≥ p</code> đều viết được <code>w = xyz</code> thỏa: <code>|xy| ≤ p</code>, <code>|y| ≥ 1</code>, và <code>xyⁱz ∈ L</code> với mọi <code>i ≥ 0</code>. Đây là điều kiện cần, không phải điều kiện đủ.",
        focus: ["p", "xyz"],
        edges: ["p-xyz"],
        metrics: { p: "tồn tại", xy: "≤ p", lap: "y ≠ ε", ket: "điều kiện cần" },
        changes: ["Ghi nhớ ba điều kiện", "Hiểu chiều suy luận"],
        note: "Bơm y lên i = 0 nghĩa là xóa y; i = 2 nghĩa là lặp y hai lần. Cả hai vẫn phải thuộc L nếu L chính quy."
      },
      {
        short: "Ý tưởng",
        type: "KỸ THUẬT",
        title: "p+1 lần đọc, p trạng thái",
        body: "DFA nhận <code>L</code> có <code>p</code> trạng thái. Đọc một chuỗi dài ít nhất <code>p</code> ký tự, sau <code>p+1</code> lần đọc máy phải lặp lại một trạng thái (nguyên lý chuồng bồ câu). Đoạn giữa hai lần gặp cùng trạng thái chính là <code>y</code>: lặp nó bao nhiêu lần cũng quay về cùng trạng thái, nên vẫn được nhận.",
        focus: ["state", "p"],
        edges: ["p-state", "state-bad"],
        metrics: { p: "số trạng thái", xy: "≤ p", lap: "khép kín", ket: "trực giác" },
        changes: ["Tìm vòng lặp trạng thái", "Xác định y"],
        note: "Điều kiện |xy| ≤ p nói vòng lặp phải xảy ra sớm, trong p ký tự đầu — nhờ đó ta kiểm soát được y khi chọn phản ví dụ."
      },
      {
        short: "Mẫu chứng minh",
        type: "KỸ THUẬT",
        title: "Giả sử, chọn chuỗi, bơm, mâu thuẫn",
        body: "Bốn bước: (1) giả sử <code>L</code> chính quy với độ dài bơm <code>p</code>; (2) chọn <code>w ∈ L</code> dài hơn <code>p</code>, thường phụ thuộc <code>p</code>; (3) với mọi cách chia <code>w = xyz</code> thỏa điều kiện, chỉ ra một <code>i</code> làm <code>xyⁱz ∉ L</code>; (4) kết luận giả thiết sai. Phải xét <strong>mọi</strong> cách chia, không chỉ một cách thuận lợi.",
        focus: ["xyz", "loop", "bad"],
        edges: ["xyz-loop", "loop-bad"],
        metrics: { p: "giả sử", xy: "mọi cách chia", lap: "chọn i", ket: "mâu thuẫn" },
        changes: ["Lập khung 4 bước", "Xét mọi cách chia"],
        note: "Sai lầm thường gặp: chỉ chọn một cách chia rồi kết luận. Bổ đề yêu cầu mọi cách chia đều phải bơm được."
      },
      {
        short: "Ví dụ",
        type: "KỸ THUẬT",
        title: "aⁿbⁿ không chính quy",
        body: "Giả sử <code>L = {aⁿbⁿ}</code> chính quy, độ dài bơm <code>p</code>. Chọn <code>w = aᵖbᵖ</code>. Vì <code>|xy| ≤ p</code>, <code>y</code> chỉ gồm toàn <code>a</code> (hoặc rỗng, nhưng <code>|y| ≥ 1</code>). Bơm <code>i = 2</code> được chuỗi có nhiều <code>a</code> hơn <code>b</code>, không thuộc <code>L</code>. Mâu thuẫn, nên <code>L</code> không chính quy.",
        focus: ["xyz", "loop", "done"],
        edges: ["xyz-loop", "bad-done"],
        metrics: { p: "p", xy: "y toàn a", lap: "i = 2", ket: "không chính quy" },
        changes: ["Chọn aᵖbᵖ", "Bơm thành aᵖ⁺ᵏbᵖ"],
        note: "Cùng mẫu áp dụng cho {aⁿbⁿcⁿ}, {ww}, chuỗi palindrome — tất cả đều cần bộ nhớ không hữu hạn."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Ranh giới của regex",
        body: "Bổ đề bơm chứng minh regex/DFA/NFA có giới hạn: chúng không đếm được quan hệ số lượng tùy ý. Điều này không làm chúng kém hữu ích — phần lớn mẫu văn bản là chính quy. Khi cần đếm hoặc lồng cấu trúc, ta chuyển sang văn phạm phi ngữ cảnh và PDA.",
        focus: "all",
        edges: "all",
        metrics: { p: "công cụ", xy: "phản chứng", lap: "mẫu lặp", ket: "giới hạn regex" },
        changes: ["Áp dụng được bổ đề", "Chuyển sang CFG"],
        note: "Bổ đề bơm không chứng minh được một ngôn ngữ là chính quy. Muốn khẳng định, phải dựng DFA/NFA/regex cụ thể."
      }
    ]
  };

  L["cfg"] = {
    id: "cfg",
    module: "grammar",
    title: "Văn phạm phi ngữ cảnh",
    shortTitle: "CFG",
    subtitle: "CFG sinh chuỗi bằng luật thay thế: mỗi biến được viết lại thành chuỗi biến và ký tự kết thúc. Nó mô tả được cấu trúc lồng nhau mà regex không đếm nổi.",
    blurb: "Sinh ngôn ngữ bằng luật viết lại.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["cfg", "grammar", "production", "derivation", "context-free"],
    metrics: [
      { key: "v", label: "Biến", tone: "blue" },
      { key: "t", label: "Kết thúc", tone: "coral" },
      { key: "p", label: "Luật", tone: "green" },
      { key: "l", label: "Ngôn ngữ", tone: "violet" }
    ],
    nodes: [
      { id: "v", type: "letter", x: 50, y: 80, w: 190, h: 70, label: "Biến V", sub: "S, A, B" },
      { id: "t", type: "string", x: 320, y: 80, w: 200, h: 70, label: "Ký tự kết thúc T", sub: "a, b" },
      { id: "rules", type: "grammar", x: 610, y: 80, w: 205, h: 70, label: "Luật sinh P", sub: "A → α" },
      { id: "start", type: "start", x: 50, y: 315, w: 190, h: 70, label: "Biến bắt đầu S", sub: "điểm xuất phát" },
      { id: "derive", type: "derivation", x: 320, y: 315, w: 200, h: 70, label: "Dẫn xuất", sub: "S ⇒ … ⇒ w" },
      { id: "lang", type: "language", x: 610, y: 315, w: 205, h: 70, label: "L(G)", sub: "tập chuỗi sinh ra" }
    ],
    edges: [
      { id: "v-rules", from: "v", to: "rules", kind: "data", label: "vế trái" },
      { id: "t-rules", from: "t", to: "rules", kind: "data", label: "vế phải" },
      { id: "start-derive", from: "start", to: "derive", kind: "request", label: "áp luật" },
      { id: "rules-derive", from: "rules", to: "derive", kind: "data", label: "thay thế" },
      { id: "derive-lang", from: "derive", to: "lang", kind: "response", label: "sinh chuỗi" },
      { id: "v-lang", from: "v", to: "lang", kind: "data", label: "định nghĩa", bow: 26 }
    ],
    learn: [
      "Phát biểu bộ bốn (V, T, P, S) của CFG.",
      "Viết văn phạm cho một ngôn ngữ đơn giản.",
      "Thực hiện một dẫn xuất từ S tới chuỗi kết thúc.",
      "So sánh sức mạnh CFG với regex."
    ],
    steps: [
      {
        short: "Bộ bốn",
        type: "TỔNG QUAN",
        title: "(V, T, P, S)",
        body: "CFG gồm tập biến <code>V</code>, tập ký tự kết thúc <code>T</code> (rời nhau), tập luật <code>P</code> dạng <code>A → α</code> với <code>A ∈ V</code> và <code>α ∈ (V ∪ T)*</code>, cùng biến bắt đầu <code>S</code>. Vế trái luôn là đúng một biến — đó là nghĩa “phi ngữ cảnh”: thay thế không phụ thuộc ngữ cảnh xung quanh.",
        focus: ["v", "t", "start"],
        edges: ["v-rules", "t-rules"],
        metrics: { v: "{S,A,B}", t: "{a,b}", p: "3 luật", l: "chưa xác định" },
        changes: ["Khai báo bộ bốn", "Phân biệt biến và kết thúc"],
        note: "Ký tự kết thúc không bao giờ được viết lại. Nếu thấy luật dạng a → … thì đó không phải CFG."
      },
      {
        short: "Luật sinh",
        type: "KỸ THUẬT",
        title: "Viết văn phạm cho aⁿbⁿ",
        body: "Văn phạm <code>S → aSb | ab</code> sinh đúng <code>{aⁿbⁿ | n ≥ 1}</code>. Mỗi lần áp <code>S → aSb</code>, ta bọc thêm một cặp a…b quanh phần giữa; luật <code>S → ab</code> kết thúc đệ quy. Đây là cấu trúc lồng nhau mà DFA không biểu diễn được vì cần nhớ số cặp đã mở.",
        focus: ["rules", "start"],
        edges: ["start-derive", "rules-derive"],
        metrics: { v: "{S}", t: "{a,b}", p: "2 luật", l: "aⁿbⁿ" },
        changes: ["Luật đệ quy", "Luật kết thúc"],
        note: "Đệ quy trong văn phạm tương ứng ngăn xếp trong PDA. Càng nhiều cặp lồng, ngăn xếp càng sâu."
      },
      {
        short: "Dẫn xuất",
        type: "KỸ THUẬT",
        title: "Từ S đến chuỗi",
        body: "Dẫn xuất là dãy thay thế bắt đầu từ <code>S</code>. Với <code>aabb</code>: <code>S ⇒ aSb ⇒ aabb</code> (áp <code>S → aSb</code> rồi <code>S → ab</code>, sau đó viết liền). Chuỗi chỉ thuộc ngôn ngữ khi dẫn xuất kết thúc và không còn biến nào. Độ dài dẫn xuất không bị chặn trước.",
        focus: ["derive", "rules"],
        edges: ["rules-derive"],
        metrics: { v: "{S}", t: "{a,b}", p: "2 luật", l: "S ⇒ aSb ⇒ aabb" },
        changes: ["Áp luật lần một", "Áp luật kết thúc"],
        note: "Có thể có nhiều dãy dẫn xuất cho cùng một chuỗi; bài sau phân biệt dẫn xuất trái nhất và cây cú pháp."
      },
      {
        short: "So với regex",
        type: "CẢNH BÁO",
        tone: "warn",
        title: "Mạnh hơn, nhưng không phải vạn năng",
        body: "Mọi ngôn ngữ chính quy đều có CFG, nhưng CFG còn sinh được <code>aⁿbⁿ</code>, palindrome, biểu thức ngoặc lồng. Tuy vậy CFG vẫn không sinh được <code>aⁿbⁿcⁿ</code> hay ngôn ngữ cần so sánh ba chiều — những ngôn ngữ đó cần mô hình mạnh hơn như máy Turing.",
        focus: ["lang", "v"],
        edges: ["derive-lang", "v-lang"],
        metrics: { v: "lớn hơn", t: "regex ⊂ CFG", p: "đệ quy", l: "chưa đủ mọi thứ" },
        changes: ["Thấy bậc thang sức mạnh", "Biết giới hạn CFG"],
        note: "Bậc thang chuẩn: chính quy ⊂ phi ngữ cảnh ⊂ ngữ cảnh ⊂ đệ quy ⊂ liệt kê đệ quy."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Cấu trúc thay cho đếm",
        body: "CFG mô tả ngôn ngữ bằng cấu trúc đệ quy thay vì trạng thái hữu hạn. Nó là nền của cú pháp ngôn ngữ lập trình, biểu thức toán và định dạng dữ liệu lồng nhau. Bài tiếp theo đi sâu vào dẫn xuất, cây cú pháp và vấn đề nhập nhằng.",
        focus: "all",
        edges: "all",
        metrics: { v: "hữu hạn", t: "hữu hạn", p: "đệ quy", l: "phi ngữ cảnh" },
        changes: ["Hiểu CFG", "Chuẩn bị dẫn xuất"],
        note: "Trong thực tế, parser dùng CFG kèm ràng buộc ngữ nghĩa; CFG thuần không kiểm tra kiểu hay khai báo biến."
      }
    ]
  };

  L["dan-xuat"] = {
    id: "dan-xuat",
    module: "grammar",
    title: "Dẫn xuất, cây cú pháp và nhập nhằng",
    shortTitle: "Dẫn xuất",
    subtitle: "Một chuỗi có thể có nhiều dẫn xuất. Cây cú pháp gộp chúng lại thành cấu trúc; nếu một chuỗi có hai cây khác nhau, văn phạm nhập nhằng và nghĩa chương trình có thể đổi.",
    blurb: "Cùng chuỗi, khác cấu trúc.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["derivation", "parse tree", "ambiguity", "leftmost", "grammar"],
    metrics: [
      { key: "buoc", label: "Dẫn xuất", tone: "blue" },
      { key: "cay", label: "Cây", tone: "green" },
      { key: "nhieu", label: "Số cây", tone: "yellow" },
      { key: "ket", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "string", type: "string", x: 50, y: 80, w: 190, h: 70, label: "Chuỗi đích", sub: "a + a × a" },
      { id: "left", type: "derivation", x: 315, y: 80, w: 210, h: 70, label: "Dẫn xuất trái", sub: "thay biến trái nhất" },
      { id: "right", type: "derivation", x: 615, y: 80, w: 195, h: 70, label: "Dẫn xuất phải", sub: "thay biến phải nhất" },
      { id: "tree", type: "parse", x: 50, y: 315, w: 190, h: 70, label: "Cây cú pháp", sub: "gốc S, lá kết thúc" },
      { id: "amb", type: "alert", x: 315, y: 315, w: 210, h: 70, label: "Nhập nhằng", sub: "hai cây khác nhau" },
      { id: "fix", type: "check", x: 615, y: 315, w: 195, h: 70, label: "Khử nhập nhằng", sub: "độ ưu tiên, kết hợp" }
    ],
    edges: [
      { id: "string-left", from: "string", to: "left", kind: "data", label: "dẫn" },
      { id: "string-right", from: "string", to: "right", kind: "data", label: "dẫn" },
      { id: "left-tree", from: "left", to: "tree", kind: "data", label: "vẽ" },
      { id: "right-tree", from: "right", to: "tree", kind: "data", label: "vẽ", bow: 20 },
      { id: "tree-amb", from: "tree", to: "amb", kind: "request", label: "so sánh" },
      { id: "amb-fix", from: "amb", to: "fix", kind: "response", label: "sửa văn phạm" }
    ],
    learn: [
      "Viết dẫn xuất trái nhất và phải nhất cho một chuỗi.",
      "Dựng cây cú pháp từ dẫn xuất.",
      "Nhận diện văn phạm nhập nhằng qua hai cây khác nhau.",
      "Nêu cách khử nhập nhằng bằng luật ưu tiên và kết hợp."
    ],
    steps: [
      {
        short: "Dẫn xuất",
        type: "TỔNG QUAN",
        title: "Chọn biến nào thay trước",
        body: "Trong một dãy dẫn xuất, nhiều biến có thể thay được. Dẫn xuất <strong>trái nhất</strong> luôn thay biến nằm trái nhất; <strong>phải nhất</strong> thay biến phải nhất. Cả hai đều sinh cùng chuỗi, chỉ khác thứ tự. Khi nói “dẫn xuất” mà không ghi gì thêm, thường ngầm hiểu trái nhất.",
        focus: ["left", "right"],
        edges: ["string-left", "string-right"],
        metrics: { buoc: "nhiều cách", cay: "chưa vẽ", nhieu: "cùng chuỗi", ket: "thứ tự thay" },
        changes: ["Chọn biến trái nhất", "Hoặc phải nhất"],
        note: "Số bước dẫn xuất bằng số lần áp luật, không nhất thiết bằng độ dài chuỗi."
      },
      {
        short: "Cây cú pháp",
        type: "KỸ THUẬT",
        title: "Mỗi luật là một nút",
        body: "Cây cú pháp có gốc là <code>S</code>; mỗi lần áp <code>A → α</code>, tạo nút <code>A</code> với các con tương ứng ký tự trong <code>α</code>. Lá đọc từ trái sang phải cho chuỗi sinh ra. Cây bỏ qua thứ tự áp luật, nên nhiều dẫn xuất có thể cho cùng một cây.",
        focus: ["tree", "left"],
        edges: ["left-tree", "right-tree"],
        metrics: { buoc: "3–4", cay: "1", nhieu: "1", ket: "cấu trúc" },
        changes: ["Dựng cây từ dẫn xuất", "Đọc lá thành chuỗi"],
        note: "Cây cú pháp là đầu vào của bộ sinh mã và công cụ phân tích ngữ nghĩa. Nó giữ cấu trúc, không chỉ chuỗi phẳng."
      },
      {
        short: "Nhập nhằng",
        type: "CẢNH BÁO",
        tone: "warn",
        title: "Hai cây cho một chuỗi",
        body: "Văn phạm nhập nhằng nếu tồn tại chuỗi có hai cây cú pháp khác nhau. Ví dụ kinh điển: <code>E → E + E | E × E | id</code> với <code>a + a × a</code> — cây cộng trước hay nhân trước? Cả hai đều hợp lệ theo luật, nhưng cho kết quả khác nhau. Văn phạm biểu thức cần thêm tầng để cố định ưu tiên.",
        focus: ["amb", "tree"],
        edges: ["tree-amb"],
        metrics: { buoc: "nhiều", cay: "2", nhieu: "2", ket: "nhập nhằng" },
        changes: ["Tìm hai cây", "Thấy nguy cơ sai nghĩa"],
        note: "Nhập nhằng là thuộc tính của văn phạm, không của ngôn ngữ. Một ngôn ngữ có thể có văn phạm nhập nhằng và văn phạm không nhập nhằng khác."
      },
      {
        short: "Khử",
        type: "KỸ THUẬT",
        title: "Tách tầng và quy định kết hợp",
        body: "Cách phổ biến: tách biểu thức thành nhiều tầng <code>E → E + T | T</code>, <code>T → T × F | F</code>, <code>F → (E) | id</code>. Tầng thấp gắn chặt hơn, nên nhân được xử lý trước cộng. Với phép cùng tầng, chọn kết hợp trái hoặc phải bằng cách đặt đệ quy đúng phía. Văn phạm mới không nhập nhằng và phản ánh đúng quy tắc ngôn ngữ.",
        focus: ["fix", "amb"],
        edges: ["amb-fix"],
        metrics: { buoc: "theo tầng", cay: "1", nhieu: "1", ket: "không nhập nhằng" },
        changes: ["Tách E, T, F", "Chọn kết hợp trái"],
        note: "Không phải mọi văn phạm nhập nhằng đều khử được dễ dàng; một số ngôn ngữ vốn nhập nhằng (trong mọi văn phạm) và cần luật ngữ nghĩa bổ sung."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Cấu trúc quyết định nghĩa",
        body: "Dẫn xuất là quá trình, cây là kết quả cấu trúc. Kiểm tra nhập nhằng là bước bắt buộc khi thiết kế ngôn ngữ hoặc viết parser. Bài tiếp theo giới thiệu PDA — cỗ máy nhận đúng ngôn ngữ phi ngữ cảnh nhờ ngăn xếp.",
        focus: "all",
        edges: "all",
        metrics: { buoc: "trái / phải", cay: "cấu trúc", nhieu: "1 nếu khử", ket: "thiết kế cẩn thận" },
        changes: ["Hiểu dẫn xuất và cây", "Chuẩn bị học PDA"],
        note: "Trong công cụ thực tế, Yacc/Bison nhận văn phạm và báo xung đột shift/reduce — dấu hiệu nhập nhằng hoặc thiếu ưu tiên."
      }
    ]
  };
})();
