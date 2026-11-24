/* AutoLab course data — phần 1: module 01 và bài đầu module 02 */
window.AUTOLAB = (function () {
  "use strict";

  const modules = [
    {
      id: "language",
      num: "01",
      title: "Ngôn ngữ & biểu diễn",
      tone: "blue",
      blurb: "Bắt đầu từ bảng chữ cái và chuỗi, rồi xem ngôn ngữ như một tập hợp được mô tả bằng biểu thức chính quy hoặc máy hữu hạn.",
      lessons: ["bang-chu-cai", "ngon-ngu", "bieu-thuc-chinh-quy", "dfa"]
    },
    {
      id: "machines",
      num: "02",
      title: "Regex & máy hữu hạn",
      tone: "coral",
      blurb: "Từ biểu thức chính quy dựng NFA theo Thompson, đổi sang DFA bằng subset construction, rồi thu gọn máy và chứng minh giới hạn bằng bổ đề bơm.",
      lessons: ["nfa", "thompson", "subset", "toi-thieu", "bom"]
    },
    {
      id: "grammar",
      num: "03",
      title: "Văn phạm & PDA",
      tone: "mint",
      blurb: "Khi ngôn ngữ cần đếm và lồng nhau, máy hữu hạn không đủ. Văn phạm phi ngữ cảnh, dẫn xuất và PDA mở rộng sức mạnh.",
      lessons: ["cfg", "dan-xuat", "pda", "cyk"]
    },
    {
      id: "turing",
      num: "04",
      title: "Máy Turing & giới hạn",
      tone: "violet",
      blurb: "Mô hình tính toán mạnh nhất, luận đề Church–Turing và những bài toán không thuật toán nào giải được.",
      lessons: ["may-turing", "luan-de", "quyet-dinh"]
    }
  ];

  const lessons = {
    "bang-chu-cai": {
      id: "bang-chu-cai",
      module: "language",
      title: "Bảng chữ cái, chuỗi và phép nối",
      shortTitle: "Bảng chữ cái",
      subtitle: "Mọi ngôn ngữ hình thức bắt đầu từ một tập hữu hạn ký tự. Chuỗi là dãy hữu hạn các ký tự; phép nối và chuỗi rỗng là hai công cụ để xây mọi thứ sau này.",
      blurb: "Viên gạch nhỏ nhất của lý thuyết ngôn ngữ.",
      duration: "8 phút",
      level: "Nhập môn",
      tags: ["alphabet", "string", "concatenation", "epsilon", "prefix"],
      metrics: [
        { key: "sigma", label: "Bảng chữ cái", tone: "blue" },
        { key: "w", label: "Chuỗi", tone: "coral" },
        { key: "dai", label: "Độ dài", tone: "green" },
        { key: "eps", label: "Chuỗi rỗng", tone: "yellow" }
      ],
      nodes: [
        { id: "sigma", type: "letter", x: 55, y: 80, w: 200, h: 70, label: "Bảng chữ cái Σ", sub: "{a, b}" },
        { id: "chuoi", type: "string", x: 340, y: 80, w: 200, h: 70, label: "Chuỗi", sub: "w = abba" },
        { id: "dai", type: "table", x: 625, y: 80, w: 190, h: 70, label: "Độ dài", sub: "|w| = 4" },
        { id: "noi", type: "merge", x: 55, y: 310, w: 200, h: 70, label: "Phép nối", sub: "u · v" },
        { id: "tien-to", type: "parse", x: 340, y: 310, w: 200, h: 70, label: "Tiền tố / hậu tố", sub: "ab · ba" },
        { id: "rong", type: "eps", x: 625, y: 310, w: 190, h: 70, label: "Chuỗi rỗng ε", sub: "|ε| = 0" }
      ],
      edges: [
        { id: "sigma-chuoi", from: "sigma", to: "chuoi", kind: "data", label: "sinh" },
        { id: "chuoi-dai", from: "chuoi", to: "dai", kind: "request", label: "đo" },
        { id: "chuoi-noi", from: "chuoi", to: "noi", kind: "data", label: "ghép" },
        { id: "noi-tien-to", from: "noi", to: "tien-to", kind: "data", label: "cắt" },
        { id: "rong-chuoi", from: "rong", to: "chuoi", kind: "response", label: "đơn vị", bow: -18 },
        { id: "chuoi-rong", from: "chuoi", to: "rong", kind: "data", label: "rút gọn", bow: 18 }
      ],
      learn: [
        "Phân biệt bảng chữ cái, chuỗi và ngôn ngữ.",
        "Tính độ dài và viết tiền tố, hậu tố của một chuỗi.",
        "Nối hai chuỗi theo đúng thứ tự, không đảo.",
        "Giải thích vì sao ε không phải chuỗi rỗng “có dấu cách”."
      ],
      steps: [
        {
          short: "Bảng chữ cái",
          type: "TỔNG QUAN",
          title: "Một tập hữu hạn ký tự",
          body: "Bảng chữ cái <code>Σ</code> là tập hữu hạn, khác rỗng các ký tự. Ví dụ <code>Σ = {a, b}</code> hoặc <code>{0, 1}</code>. Ký tự trong bảng chữ cái không mang thứ tự và không được rút gọn: <code>a</code> và <code>A</code> là hai ký tự khác nhau nếu cùng có mặt.",
          focus: ["sigma"],
          edges: [],
          metrics: { sigma: "2", w: "—", dai: "—", eps: "—" },
          changes: ["Chọn bảng chữ cái", "Chưa có chuỗi nào"],
          note: "Bảng chữ cái phải hữu hạn. Tập mọi ký tự Unicode không phải bảng chữ cái của một mô hình hình thức."
        },
        {
          short: "Chuỗi",
          type: "KỸ THUẬT",
          title: "Dãy hữu hạn lấy từ Σ",
          body: "Một chuỗi là dãy hữu hạn các ký tự. Chuỗi <code>w = abba</code> có bốn vị trí, đánh số từ 1 đến 4. Độ dài <code>|w|</code> là số ký tự; với ví dụ này <code>|abba| = 4</code>. Ký tự tại vị trí <code>i</code> ký hiệu <code>w[i]</code>.",
          focus: ["chuoi", "dai"],
          edges: ["sigma-chuoi", "chuoi-dai"],
          metrics: { sigma: "2", w: "abba", dai: "4", eps: "—" },
          changes: ["Chuỗi được tạo từ Σ", "Độ dài đo được"],
          note: "Chuỗi khác tập hợp: thứ tự có ý nghĩa. abba và baab là hai chuỗi khác nhau dù cùng đa tập ký tự."
        },
        {
          short: "Phép nối",
          type: "KỸ THUẬT",
          title: "Ghép hai chuỗi",
          body: "Phép nối viết liền hai chuỗi: <code>ab · ba = abba</code>. Phép nối có tính kết hợp nhưng <strong>không giao hoán</strong>: <code>ab · ba ≠ ba · ab</code>. Độ dài của chuỗi nối bằng tổng độ dài: <code>|uv| = |u| + |v|</code>.",
          focus: ["noi", "chuoi"],
          edges: ["chuoi-noi"],
          metrics: { sigma: "2", w: "abba", dai: "4", eps: "đơn vị" },
          changes: ["Hai chuỗi được ghép", "Độ dài cộng dồn"],
          note: "Trong lập trình, phép nối chuỗi thường tạo bản sao mới. Về lý thuyết, nó chỉ là một phép toán trên dãy ký tự."
        },
        {
          short: "Tiền tố",
          type: "KỸ THUẬT",
          title: "Cắt đầu và cắt đuôi",
          body: "Tiền tố là phần đầu của chuỗi, hậu tố là phần cuối. Với <code>abba</code>, các tiền tố gồm <code>ε, a, ab, abb, abba</code>; các hậu tố gồm <code>ε, a, ba, bba, abba</code>. Chuỗi con có thể nằm ở giữa và không nhất thiết chạm hai đầu.",
          focus: ["tien-to", "noi"],
          edges: ["noi-tien-to"],
          metrics: { sigma: "2", w: "abba", dai: "4", eps: "2 tiền tố" },
          changes: ["Liệt kê tiền tố", "Liệt kê hậu tố"],
          note: "Tiền tố và hậu tố luôn tính cả ε và chính chuỗi. Đừng bỏ qua hai trường hợp biên này khi chứng minh."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "ε là phần tử đơn vị",
          body: "Chuỗi rỗng <code>ε</code> có độ dài 0 và thỏa <code>εw = wε = w</code> với mọi chuỗi <code>w</code>. Nó không phải dấu cách, không phải chuỗi một ký tự. Tập mọi chuỗi hữu hạn trên <code>Σ</code> ký hiệu <code>Σ*</code>, còn <code>Σ+ = Σ* − {ε}</code>.",
          focus: "all",
          edges: "all",
          metrics: { sigma: "hữu hạn", w: "hữu hạn", dai: "≥ 0", eps: "|ε| = 0" },
          changes: ["Hiểu ε", "Biết Σ* và Σ+"],
          note: "Bài tiếp theo biến một tập chuỗi thành đối tượng nghiên cứu: ngôn ngữ hình thức."
        }
      ]
    },

    "ngon-ngu": {
      id: "ngon-ngu",
      module: "language",
      title: "Ngôn ngữ là một tập chuỗi",
      shortTitle: "Ngôn ngữ",
      subtitle: "Một ngôn ngữ hình thức là tập con của Σ*. Từ phép hợp, phép nối và sao Kleene, ta xây ngôn ngữ mới từ ngôn ngữ cũ — và bắt đầu phân biệt ngôn ngữ chính quy với ngôn ngữ cần bộ nhớ.",
      blurb: "Từ chuỗi đến tập hợp có cấu trúc.",
      duration: "10 phút",
      level: "Nhập môn",
      tags: ["language", "kleene star", "union", "concatenation", "regular"],
      metrics: [
        { key: "sao", label: "Σ*", tone: "blue" },
        { key: "l", label: "Ngôn ngữ L", tone: "coral" },
        { key: "phep", label: "Phép toán", tone: "green" },
        { key: "loai", label: "Phân loại", tone: "violet" }
      ],
      nodes: [
        { id: "sigstar", type: "language", x: 55, y: 80, w: 210, h: 70, label: "Σ*", sub: "mọi chuỗi hữu hạn" },
        { id: "l", type: "grid", x: 350, y: 80, w: 200, h: 70, label: "Ngôn ngữ L", sub: "L ⊆ Σ*" },
        { id: "member", type: "accept", x: 635, y: 80, w: 180, h: 70, label: "Thành viên", sub: "w ∈ L?" },
        { id: "union", type: "merge", x: 55, y: 310, w: 190, h: 70, label: "Hợp L ∪ M", sub: "thuộc một trong hai" },
        { id: "concat", type: "string", x: 330, y: 310, w: 210, h: 70, label: "Nối L · M", sub: "uv với u∈L, v∈M" },
        { id: "star", type: "pump", x: 635, y: 310, w: 180, h: 70, label: "Sao L*", sub: "lặp 0 lần trở lên" }
      ],
      edges: [
        { id: "sig-l", from: "sigstar", to: "l", kind: "data", label: "chọn tập con" },
        { id: "l-member", from: "l", to: "member", kind: "request", label: "kiểm tra" },
        { id: "l-union", from: "l", to: "union", kind: "data", label: "kết hợp" },
        { id: "l-concat", from: "l", to: "concat", kind: "data", label: "ghép" },
        { id: "l-star", from: "l", to: "star", kind: "data", label: "lặp" },
        { id: "member-star", from: "member", to: "star", kind: "response", label: "quyết định", bow: 26 }
      ],
      learn: [
        "Định nghĩa ngôn ngữ là tập con của Σ*.",
        "Tính hợp, nối và sao Kleene của hai ngôn ngữ hữu hạn.",
        "Phân biệt ngôn ngữ hữu hạn và ngôn ngữ vô hạn.",
        "Nhận ra ngôn ngữ nào cần đếm, không thể biểu diễn bằng máy hữu hạn đơn giản."
      ],
      steps: [
        {
          short: "Định nghĩa",
          type: "TỔNG QUAN",
          title: "Ngôn ngữ là tập hợp",
          body: "Với bảng chữ cái <code>Σ</code>, ngôn ngữ <code>L</code> là một tập con của <code>Σ*</code>. Mỗi phần tử của <code>L</code> là một chuỗi. Ví dụ <code>L = {a, ab, abb}</code> là ngôn ngữ hữu hạn; <code>L = {aⁿbⁿ | n ≥ 1}</code> là ngôn ngữ vô hạn.",
          focus: ["sigstar", "l"],
          edges: ["sig-l"],
          metrics: { sao: "vô hạn", l: "tập con", phep: "—", loai: "hữu hạn / vô hạn" },
          changes: ["Chọn Σ", "Xác định L"],
          note: "Ngôn ngữ không phải chương trình. Nó chỉ là tập chuỗi; câu hỏi trung tâm là chuỗi nào thuộc tập."
        },
        {
          short: "Thành viên",
          type: "KỸ THUẬT",
          title: "Bài toán thành viên",
          body: "Bài toán thành viên hỏi: với chuỗi <code>w</code> cho trước, <code>w</code> có thuộc <code>L</code> không? Mọi mô hình trong khóa học — DFA, PDA, máy Turing — đều trả lời câu hỏi này theo cách riêng. Với ngôn ngữ mô tả bằng quy tắc, ta cần một thuật toán quyết định.",
          focus: ["l", "member"],
          edges: ["l-member"],
          metrics: { sao: "vô hạn", l: "có quy tắc", phep: "∈", loai: "quyết định được" },
          changes: ["Đặt câu hỏi thành viên", "Cần thủ tục kiểm tra"],
          note: "Với tập hữu hạn, kiểm tra thành viên chỉ là tra danh sách. Với tập vô hạn, ta cần mô hình tính toán."
        },
        {
          short: "Phép toán",
          type: "KỸ THUẬT",
          title: "Hợp, nối và sao",
          body: "Hợp: <code>L ∪ M</code> gồm chuỗi thuộc ít nhất một bên. Nối: <code>L · M</code> gồm mọi <code>uv</code> với <code>u ∈ L</code>, <code>v ∈ M</code>. Sao Kleene: <code>L*</code> gồm mọi chuỗi ghép từ 0 hay nhiều phần tử của <code>L</code>; luôn chứa <code>ε</code>.",
          focus: ["union", "concat", "star"],
          edges: ["l-union", "l-concat", "l-star"],
          metrics: { sao: "chứa ε", l: "L, M", phep: "∪ · *", loai: "đóng" },
          changes: ["Ba phép toán đóng trên ngôn ngữ", "Sinh ngôn ngữ mới"],
          note: "L* khác L+: L+ = L·L* nên L+ không chứa ε trừ khi L đã chứa ε."
        },
        {
          short: "Ví dụ",
          type: "KỸ THUẬT",
          title: "Tính cụ thể với tập nhỏ",
          body: "Cho <code>L = {a, bb}</code>. Khi đó <code>L* = {ε, a, bb, aa, abb, bba, bbbb, …}</code>. Ngôn ngữ <code>{aⁿbⁿ}</code> không thể viết bằng cách lặp một tập hữu hạn như vậy: nó đòi hỏi ghi nhớ số lượng, dấu hiệu cho thấy cần mô hình mạnh hơn DFA.",
          focus: ["star", "member"],
          edges: ["member-star", "l-star"],
          metrics: { sao: "L*", l: "{aⁿbⁿ}", phep: "lặp", loai: "không chính quy" },
          changes: ["Liệt kê vài chuỗi L*", "Thấy giới hạn của lặp"],
          note: "“Không chính quy” sẽ được chứng minh chặt chẽ bằng bổ đề bơm ở module 02."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Ngôn ngữ = tập + quy tắc",
          body: "Từ nay, mỗi ngôn ngữ sẽ đi kèm một cách mô tả hữu hạn: biểu thức chính quy, automata, văn phạm hoặc máy Turing. Câu hỏi xuyên suốt là: mô tả nào đủ mạnh cho ngôn ngữ nào, và cái giá phải trả là gì.",
          focus: "all",
          edges: "all",
          metrics: { sao: "Σ*", l: "L ⊆ Σ*", phep: "∪ · *", loai: "4 mô hình" },
          changes: ["Định hình mục tiêu khóa học", "Chuẩn bị học regex"],
          note: "Bài tiếp theo: biểu thức chính quy, cách mô tả ngôn ngữ ngắn gọn nhất mà vẫn quyết định được thành viên."
        }
      ]
    },

    "bieu-thuc-chinh-quy": {
      id: "bieu-thuc-chinh-quy",
      module: "language",
      title: "Biểu thức chính quy",
      shortTitle: "Regex",
      subtitle: "Ba phép toán — hợp, nối, sao Kleene — đủ mô tả mọi ngôn ngữ chính quy. Cú pháp regex chỉ là cách viết gọn của các phép toán đó, kèm thứ tự ưu tiên cần nhớ.",
      blurb: "Mô tả ngôn ngữ bằng một dòng ký tự.",
      duration: "11 phút",
      level: "Cơ bản",
      tags: ["regex", "precedence", "kleene star", "regular expression", "pattern"],
      metrics: [
        { key: "e", label: "Biểu thức", tone: "coral" },
        { key: "uu", label: "Ưu tiên", tone: "blue" },
        { key: "khop", label: "Khớp", tone: "green" },
        { key: "trap", label: "Bẫy", tone: "yellow" }
      ],
      nodes: [
        { id: "rx", type: "regex", x: 55, y: 80, w: 220, h: 70, label: "Regex E", sub: "(a|b)*abb" },
        { id: "atom", type: "letter", x: 355, y: 80, w: 180, h: 70, label: "Nguyên tử", sub: "a, b, ε" },
        { id: "prec", type: "table", x: 620, y: 80, w: 195, h: 70, label: "Ưu tiên", sub: "* > nối > |" },
        { id: "alt", type: "merge", x: 55, y: 310, w: 180, h: 70, label: "Hợp a|b", sub: "một trong hai" },
        { id: "star", type: "pump", x: 320, y: 310, w: 200, h: 70, label: "(a|b)*", sub: "lặp tùy ý" },
        { id: "tail", type: "string", x: 600, y: 310, w: 215, h: 70, label: "Nối đuôi abb", sub: "kết thúc bằng abb" }
      ],
      edges: [
        { id: "atom-rx", from: "atom", to: "rx", kind: "data", label: "dựng" },
        { id: "rx-prec", from: "rx", to: "prec", kind: "request", label: "đọc theo" },
        { id: "rx-alt", from: "rx", to: "alt", kind: "data", label: "mở nhóm" },
        { id: "alt-star", from: "alt", to: "star", kind: "data", label: "sao" },
        { id: "star-tail", from: "star", to: "tail", kind: "data", label: "nối" },
        { id: "prec-tail", from: "prec", to: "tail", kind: "response", label: "quyết định", bow: 24 }
      ],
      learn: [
        "Đọc và viết regex với ba phép toán cơ bản.",
        "Áp dụng đúng thứ tự ưu tiên khi phân tích regex.",
        "Dùng +, ? và nhóm để viết mẫu ngắn gọn.",
        "Chỉ ra chuỗi gần giống nhưng không khớp mẫu."
      ],
      steps: [
        {
          short: "Nguyên tử",
          type: "TỔNG QUAN",
          title: "Ký tự và ε",
          body: "Biểu thức chính quy được dựng từ ký tự trong <code>Σ</code>, chuỗi rỗng <code>ε</code>, phép hợp <code>|</code>, phép nối (viết liền) và sao Kleene <code>*</code>. Ví dụ <code>a</code> mô tả ngôn ngữ <code>{a}</code>; <code>ε</code> mô tả <code>{ε}</code>.",
          focus: ["atom", "rx"],
          edges: ["atom-rx"],
          metrics: { e: "a", uu: "—", khop: "{a}", trap: "—" },
          changes: ["Chọn nguyên tử", "Xác định ngôn ngữ một chuỗi"],
          note: "Trong tài liệu, dấu chấm đôi khi là phép nối tường minh. Trong khóa này, viết liền nghĩa là nối."
        },
        {
          short: "Ưu tiên",
          type: "KỸ THUẬT",
          title: "Sao trước, nối sau, hợp cuối",
          body: "<code>ab*</code> nghĩa là <code>a(b*)</code>, không phải <code>(ab)*</code>. <code>a|bc</code> nghĩa là <code>a | (bc)</code>. Khi nghi ngờ, hãy đặt ngoặc: regex sai ưu tiên là lỗi phổ biến nhất khi đọc mẫu.",
          focus: ["prec", "rx"],
          edges: ["rx-prec"],
          metrics: { e: "ab*", uu: "* > nối > |", khop: "a, ab, abb…", trap: "ab lặp" },
          changes: ["Phân tích theo ưu tiên", "Thêm ngoặc khi cần"],
          note: "Quy tắc ghi nhớ: sao dính chặt nhất, rồi đến nối, cuối cùng là hợp. Ngoặc phá mọi thứ tự."
        },
        {
          short: "Mở rộng",
          type: "KỸ THUẬT",
          title: "+ và ? chỉ là viết tắt",
          body: "<code>E+ = EE*</code> nghĩa là một lần trở lên; <code>E? = E | ε</code> nghĩa là không hoặc một lần. Hai dạng này không thêm sức mạnh, chỉ giúp mẫu ngắn hơn. Các công cụ thực tế còn có <code>{m,n}</code>, lớp ký tự và nhóm bắt — hữu ích nhưng vẫn quy về ba phép toán gốc.",
          focus: ["star", "alt"],
          edges: ["rx-alt", "alt-star"],
          metrics: { e: "a+b?", uu: "* > nối > |", khop: "aaab, a", trap: "b" },
          changes: ["Đổi + thành *", "Đổi ? thành | ε"],
          note: "Đừng nhầm ? của regex với ký tự đại diện một ký tự trong shell. Ngữ nghĩa phụ thuộc công cụ."
        },
        {
          short: "Ví dụ",
          type: "KỸ THUẬT",
          title: "(a|b)*abb và cái bẫy abab",
          body: "<code>(a|b)*abb</code> nhận mọi chuỗi trên <code>{a,b}</code> kết thúc bằng <code>abb</code>. Vì vậy <code>aababb</code> được nhận, còn <code>abab</code> bị từ chối dù có hai chữ <code>b</code>. Ba ký tự cuối phải đúng thứ tự <code>a, b, b</code>.",
          focus: ["star", "tail"],
          edges: ["star-tail", "prec-tail"],
          metrics: { e: "(a|b)*abb", uu: "nhóm rõ", khop: "aababb", trap: "abab" },
          changes: ["Chạy hai chuỗi", "Thấy vai trò của đuôi"],
          note: "Đây là ví dụ chuẩn để so sánh NFA và DFA ở các bài sau; cả hai đều nhận cùng ngôn ngữ."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Một dòng thay cho tập vô hạn",
          body: "Regex mô tả ngôn ngữ chính quy bằng hữu hạn ký tự. Nó không đếm được số lần lặp có ràng buộc kiểu <code>aⁿbⁿ</code>; muốn thế cần văn phạm hoặc máy mạnh hơn. Bài sau dựng cỗ máy đầu tiên nhận đúng ngôn ngữ regex: DFA.",
          focus: "all",
          edges: "all",
          metrics: { e: "3 phép toán", uu: "*, nối, |", khop: "quyết định được", trap: "không đếm" },
          changes: ["Tóm tắt cú pháp", "Chuẩn bị học DFA"],
          note: "Mọi regex đều có thể chuyển thành automata hữu hạn — định lý Kleene, sẽ thấy qua Thompson và subset construction."
        }
      ]
    },

    "dfa": {
      id: "dfa",
      module: "language",
      title: "DFA — máy hữu hạn đơn định",
      shortTitle: "DFA",
      subtitle: "DFA là cỗ máy không bộ nhớ ngoài trạng thái: mỗi bước đọc một ký tự và chuyển đúng một trạng thái. Năm thành phần và bảng chuyển là toàn bộ định nghĩa.",
      blurb: "Đọc chuỗi bằng năm thành phần.",
      duration: "12 phút",
      level: "Cơ bản",
      tags: ["dfa", "transition", "state", "accept", "deterministic"],
      metrics: [
        { key: "q", label: "Trạng thái", tone: "blue" },
        { key: "sigma", label: "Bảng chữ cái", tone: "coral" },
        { key: "buoc", label: "Bước", tone: "green" },
        { key: "ket", label: "Kết luận", tone: "violet" }
      ],
      nodes: [
        { id: "input", type: "tape", x: 55, y: 80, w: 210, h: 70, label: "Băng nhập", sub: "a a b a b b" },
        { id: "delta", type: "table", x: 350, y: 80, w: 210, h: 70, label: "Hàm chuyển δ", sub: "Q × Σ → Q" },
        { id: "q0", type: "dfa", x: 640, y: 80, w: 175, h: 70, label: "q0", sub: "bắt đầu" },
        { id: "q3", type: "accept", x: 55, y: 310, w: 200, h: 70, label: "q3", sub: "trạng thái nhận" },
        { id: "trap", type: "reject", x: 330, y: 310, w: 200, h: 70, label: "Bẫy", sub: "không bao giờ nhận" },
        { id: "ket", type: "check", x: 620, y: 310, w: 195, h: 70, label: "Kết luận", sub: "nhận / từ chối" }
      ],
      edges: [
        { id: "input-delta", from: "input", to: "delta", kind: "data", label: "từng ký tự" },
        { id: "delta-q0", from: "delta", to: "q0", kind: "request", label: "chuyển" },
        { id: "q0-q3", from: "q0", to: "q3", kind: "data", label: "đi đúng", bow: 20 },
        { id: "q0-trap", from: "q0", to: "trap", kind: "data", label: "đi sai", bow: -20 },
        { id: "q3-ket", from: "q3", to: "ket", kind: "response", label: "nhận" },
        { id: "trap-ket", from: "trap", to: "ket", kind: "response", label: "từ chối", bow: 18 }
      ],
      learn: [
        "Phát biểu đủ năm thành phần của DFA.",
        "Đọc bảng chuyển và chạy một chuỗi bằng tay.",
        "Phân biệt trạng thái nhận, không nhận và trạng thái bẫy.",
        "Giải thích vì sao DFA không cần bộ nhớ ngoài trạng thái hiện tại."
      ],
      steps: [
        {
          short: "Năm thành phần",
          type: "TỔNG QUAN",
          title: "(Q, Σ, δ, q0, F)",
          body: "DFA gồm tập trạng thái hữu hạn <code>Q</code>, bảng chữ cái <code>Σ</code>, hàm chuyển <code>δ: Q × Σ → Q</code>, trạng thái bắt đầu <code>q0</code> và tập trạng thái nhận <code>F</code>. Mấu chốt: với mỗi cặp (trạng thái, ký tự) có <strong>đúng một</strong> trạng thái kế tiếp.",
          focus: ["q0", "delta"],
          edges: ["delta-q0"],
          metrics: { q: "5", sigma: "{a,b}", buoc: "0", ket: "chưa chạy" },
          changes: ["Khai báo bộ năm", "Chưa đọc ký tự"],
          note: "Tính đơn định là điều kiện của DFA. NFA cho phép nhiều lựa chọn hoặc không chuyển, sẽ học ngay sau bài này."
        },
        {
          short: "Bảng chuyển",
          type: "KỸ THUẬT",
          title: "δ viết thành bảng",
          body: "Với ví dụ <code>(a|b)*abb</code>, mỗi trạng thái ghi nhớ đoạn đuôi đã khớp: chưa có gì, đã thấy <code>a</code>, đã thấy <code>ab</code>, đã thấy <code>abb</code>. Hàng là trạng thái, cột là ký tự; ô là trạng thái kế. Bảng chuyển chính là chương trình của máy.",
          focus: ["delta"],
          edges: ["input-delta"],
          metrics: { q: "5", sigma: "{a,b}", buoc: "1", ket: "δ rõ" },
          changes: ["Lập bảng chuyển", "Mỗi ô một đích"],
          note: "Trong code, bảng chuyển thường là mảng hai chiều hoặc đối tượng lồng nhau. Kích thước hữu hạn nên tra cứu O(1)."
        },
        {
          short: "Chạy chuỗi",
          type: "KỸ THUẬT",
          title: "Đọc từng ký tự",
          body: "Bắt đầu ở <code>q0</code>. Với mỗi ký tự, tra bảng và đi tiếp. Sau khi đọc hết chuỗi, nhận nếu trạng thái hiện tại thuộc <code>F</code>. Với <code>aababb</code>, đường đi kết thúc ở trạng thái đã thấy đủ <code>abb</code>; với <code>abab</code>, đường đi dừng ở trạng thái chỉ mới thấy <code>ab</code>.",
          focus: ["input", "q0", "q3"],
          edges: ["input-delta", "delta-q0", "q0-q3"],
          metrics: { q: "5", sigma: "{a,b}", buoc: "6", ket: "aababb ✓" },
          changes: ["Sáu ký tự được đọc", "Dừng ở trạng thái nhận"],
          note: "DFA luôn đọc hết chuỗi (trừ khi bảng chuyển thiếu). Không có quay lui, không có ngăn xếp."
        },
        {
          short: "Bẫy",
          type: "CẢNH BÁO",
          tone: "warn",
          title: "Trạng thái bẫy là bình thường",
          body: "Nếu đang chờ <code>a</code> mà gặp <code>b</code>, không còn cách nào cứu chuỗi. Trạng thái bẫy (dead state) gom mọi đường hỏng để bảng chuyển vẫn đầy đủ. Bẫy không phải lỗi thiết kế; nó giúp mô hình luôn xác định.",
          focus: ["trap", "ket"],
          edges: ["q0-trap", "trap-ket"],
          metrics: { q: "5", sigma: "{a,b}", buoc: "4", ket: "abab ✗" },
          changes: ["Rơi vào bẫy", "Không thể thoát"],
          note: "Trong cài đặt thực tế, có thể bỏ các chuyển vào bẫy và coi “không có chuyển” là từ chối — đó là DFA không đầy đủ."
        },
        {
          short: "Tóm tắt",
          type: "TÓM TẮT",
          tone: "final",
          title: "Bộ nhớ chỉ là trạng thái",
          body: "DFA quyết định thành viên của ngôn ngữ chính quy trong thời gian tuyến tính theo độ dài chuỗi, bộ nhớ hằng. Giới hạn của nó cũng nằm ở đó: chỉ hữu hạn trạng thái nên không đếm được số lượng tùy ý như <code>aⁿbⁿ</code>.",
          focus: "all",
          edges: "all",
          metrics: { q: "hữu hạn", sigma: "hữu hạn", buoc: "O(n)", ket: "quyết định" },
          changes: ["Hiểu sức mạnh DFA", "Thấy giới hạn đếm"],
          note: "Bài tiếp theo nới lỏng tính đơn định: NFA được phép nhiều lựa chọn và ε-dịch chuyển."
        }
      ]
    }
  };

  return { modules, lessons };
})();
