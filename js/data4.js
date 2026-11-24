/* AutoLab course data — phần 4: PDA, CYK, máy Turing */
(function () {
  "use strict";

  const L = window.AUTOLAB.lessons;

  L["pda"] = {
    id: "pda",
    module: "grammar",
    title: "PDA — automata đẩy xuống",
    shortTitle: "PDA",
    subtitle: "PDA thêm một ngăn xếp vào máy hữu hạn. Ngăn xếp cho phép nhớ số cặp ngoặc đã mở, nên PDA nhận đúng lớp ngôn ngữ phi ngữ cảnh.",
    blurb: "Bộ nhớ lồng nhau dưới dạng ngăn xếp.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["pda", "stack", "context-free", "pushdown", "anbn"],
    metrics: [
      { key: "q", label: "Trạng thái", tone: "blue" },
      { key: "stack", label: "Ngăn xếp", tone: "mint" },
      { key: "buoc", label: "Thao tác", tone: "green" },
      { key: "ket", label: "Nhận", tone: "violet" }
    ],
    nodes: [
      { id: "input", type: "tape", x: 50, y: 80, w: 200, h: 70, label: "Băng nhập", sub: "a a b b" },
      { id: "control", type: "dfa", x: 330, y: 80, w: 210, h: 70, label: "Bộ điều khiển", sub: "trạng thái hữu hạn" },
      { id: "stack", type: "stack", x: 620, y: 80, w: 195, h: 70, label: "Ngăn xếp", sub: "đỉnh ở trên" },
      { id: "push", type: "plus", x: 50, y: 315, w: 190, h: 70, label: "Push", sub: "đẩy ký tự" },
      { id: "pop", type: "minus", x: 320, y: 315, w: 210, h: 70, label: "Pop", sub: "lấy đỉnh ra" },
      { id: "accept", type: "accept", x: 610, y: 315, w: 205, h: 70, label: "Nhận", sub: "ngăn xếp rỗng / trạng thái nhận" }
    ],
    edges: [
      { id: "input-control", from: "input", to: "control", kind: "data", label: "đọc" },
      { id: "control-stack", from: "control", to: "stack", kind: "request", label: "đọc đỉnh" },
      { id: "control-push", from: "control", to: "push", kind: "data", label: "push" },
      { id: "control-pop", from: "control", to: "pop", kind: "data", label: "pop" },
      { id: "push-accept", from: "push", to: "accept", kind: "response", label: "mở rộng", bow: 24 },
      { id: "pop-accept", from: "pop", to: "accept", kind: "response", label: "thu hẹp" }
    ],
    learn: [
      "Phát biểu các thành phần của PDA.",
      "Mô tả push và pop trên ngăn xếp.",
      "Chạy PDA cho aⁿbⁿ bằng cách đẩy a và bóp b.",
      "Giải thích quan hệ tương đương giữa CFG và PDA."
    ],
    steps: [
      {
        short: "Mô hình",
        type: "TỔNG QUAN",
        title: "Máy hữu hạn cộng ngăn xếp",
        body: "PDA gồm trạng thái hữu hạn, bảng chuyển, băng nhập đọc một chiều và một <strong>ngăn xếp</strong> truy cập ở đỉnh (LIFO). Mỗi bước đọc ký tự (hoặc ε), lấy ký tự đỉnh, rồi quyết định trạng thái mới và thao tác đẩy/lấy. Ngăn xếp không giới hạn độ sâu, đây là nguồn sức mạnh mới.",
        focus: ["input", "control", "stack"],
        edges: ["input-control", "control-stack"],
        metrics: { q: "hữu hạn", stack: "rỗng", buoc: "0", ket: "chưa chạy" },
        changes: ["Thêm ngăn xếp", "Đọc đỉnh mỗi bước"],
        note: "PDA không đơn định thường mạnh hơn PDA đơn định. Với một số ngôn ngữ phi ngữ cảnh, không có PDA đơn định nào nhận được."
      },
      {
        short: "Push",
        type: "KỸ THUẬT",
        title: "Đẩy để ghi nhớ",
        body: "Khi gặp mỗi <code>a</code>, PDA đẩy một ký tự đánh dấu (thường là <code>A</code>) lên đỉnh ngăn xếp. Số ký tự trên ngăn xếp chính là số <code>a</code> đã đọc. Đẩy là cách ghi nhớ không giới hạn mà DFA không có.",
        focus: ["push", "stack"],
        edges: ["control-push", "control-stack"],
        metrics: { q: "q0", stack: "A A A", buoc: "3 push", ket: "đang đọc a" },
        changes: ["Mỗi a đẩy A", "Độ sâu tăng"],
        note: "Ngăn xếp chỉ cho phép thao tác ở đỉnh; không thể đọc phần tử thứ ba từ trên xuống mà không lấy ra các phần tử phía trên."
      },
      {
        short: "Pop",
        type: "KỸ THUẬT",
        title: "Lấy ra để đối chiếu",
        body: "Khi chuyển sang vùng <code>b</code>, mỗi <code>b</code> phải khớp với một <code>A</code> trên đỉnh: lấy ra và kiểm tra. Nếu gặp <code>b</code> mà ngăn xếp rỗng, hoặc đọc hết chuỗi mà ngăn xếp còn ký tự, chuỗi bị từ chối. Đây chính là phép đếm cân bằng.",
        focus: ["pop", "stack"],
        edges: ["control-pop", "control-stack"],
        metrics: { q: "q1", stack: "A A", buoc: "1 pop", ket: "đang đọc b" },
        changes: ["Mỗi b khớp một A", "Độ sâu giảm"],
        note: "Thứ tự LIFO khiến các cặp khớp theo kiểu lồng nhau, đúng với cấu trúc ngoặc và cây cú pháp."
      },
      {
        short: "Ví dụ",
        type: "KỸ THUẬT",
        title: "aⁿbⁿ chạy trên PDA",
        body: "Với <code>aaabbb</code>: đọc ba <code>a</code>, đẩy <code>AAA</code>; đọc ba <code>b</code>, lấy lần lượt ba <code>A</code>; cuối chuỗi ngăn xếp rỗng nên nhận. Với <code>aabbb</code>, sau hai <code>b</code> ngăn xếp rỗng nhưng còn <code>b</code> thứ ba nên từ chối. Với <code>aaabb</code>, đọc hết chuỗi mà còn một <code>A</code> nên cũng từ chối.",
        focus: ["accept", "push", "pop"],
        edges: ["push-accept", "pop-accept"],
        metrics: { q: "q0 → q1", stack: "rỗng", buoc: "6", ket: "nhận" },
        changes: ["Đẩy rồi lấy cân bằng", "Hai kiểu lệch bị chặn"],
        note: "Có hai quy ước nhận: theo trạng thái nhận, hoặc theo ngăn xếp rỗng. Hai quy ước tương đương về sức mạnh."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "CFG và PDA là một cặp",
        body: "Mọi CFG đều chuyển được thành PDA không đơn định (dùng ngăn xếp mô phỏng dẫn xuất trái nhất), và mọi PDA đều có CFG tương đương. Vì vậy lớp ngôn ngữ phi ngữ cảnh có hai cách nhìn: sinh bằng luật hoặc nhận bằng máy. Bài sau dùng văn phạm CNF để kiểm tra thành viên bằng bảng CYK.",
        focus: "all",
        edges: "all",
        metrics: { q: "hữu hạn", stack: "không giới hạn", buoc: "theo chuỗi", ket: "CFG ↔ PDA" },
        changes: ["Hiểu tương đương", "Chuẩn bị CYK"],
        note: "Ngăn xếp là bộ nhớ không giới hạn nhưng chỉ một chiều. Máy Turing có băng đọc-ghi hai chiều nên mạnh hơn hẳn."
      }
    ]
  };

  L["cyk"] = {
    id: "cyk",
    module: "grammar",
    title: "CYK — kiểm tra thành viên bằng bảng",
    shortTitle: "CYK",
    subtitle: "Với văn phạm ở dạng chuẩn Chomsky, thuật toán CYK điền bảng tam giác: mỗi ô chứa các biến sinh được đoạn con tương ứng. Chuỗi thuộc ngôn ngữ nếu biến bắt đầu có mặt ở ô phủ cả chuỗi.",
    blurb: "Quy hoạch động trên đoạn con.",
    duration: "14 phút",
    level: "Nâng cao",
    tags: ["cyk", "cnf", "parsing", "dynamic programming", "membership"],
    metrics: [
      { key: "n", label: "Độ dài", tone: "blue" },
      { key: "o", label: "Số ô", tone: "coral" },
      { key: "k", label: "Điểm tách", tone: "yellow" },
      { key: "ket", label: "Kết luận", tone: "green" }
    ],
    nodes: [
      { id: "cnf", type: "grammar", x: 50, y: 80, w: 210, h: 70, label: "Văn phạm CNF", sub: "A → BC | a" },
      { id: "word", type: "string", x: 340, y: 80, w: 200, h: 70, label: "Chuỗi w", sub: "a a a b b b" },
      { id: "split", type: "merge", x: 620, y: 80, w: 195, h: 70, label: "Mọi điểm tách", sub: "k từ i đến j−1" },
      { id: "table", type: "table", x: 50, y: 315, w: 210, h: 70, label: "Bảng tam giác", sub: "ô (i, j)" },
      { id: "cell", type: "grid", x: 340, y: 315, w: 200, h: 70, label: "Ô (i, j)", sub: "tập biến sinh w[i..j]" },
      { id: "verdict", type: "check", x: 620, y: 315, w: 195, h: 70, label: "Kết luận", sub: "S ∈ ô (1, n)?" }
    ],
    edges: [
      { id: "cnf-word", from: "cnf", to: "word", kind: "data", label: "áp luật" },
      { id: "word-split", from: "word", to: "split", kind: "request", label: "chia đôi" },
      { id: "split-table", from: "split", to: "table", kind: "data", label: "điền" },
      { id: "table-cell", from: "table", to: "cell", kind: "data", label: "mỗi ô" },
      { id: "cell-verdict", from: "cell", to: "verdict", kind: "response", label: "đọc góc" },
      { id: "cnf-cell", from: "cnf", to: "cell", kind: "data", label: "luật A→BC", bow: 24 }
    ],
    learn: [
      "Nhận biết văn phạm ở dạng chuẩn Chomsky.",
      "Điền bảng CYK theo độ dài đoạn.",
      "Đọc kết quả từ ô phủ toàn chuỗi.",
      "Ước lượng độ phức tạp O(n³·|P|)."
    ],
    steps: [
      {
        short: "CNF",
        type: "TỔNG QUAN",
        title: "Chỉ hai kiểu luật",
        body: "Dạng chuẩn Chomsky chỉ cho luật <code>A → BC</code> (hai biến) hoặc <code>A → a</code> (một ký tự kết thúc). Không có luật rỗng, không có vế phải dài hơn hai. Mọi CFG không sinh ε đều chuyển được về CNF, có thể kèm thêm biến và luật. CYK yêu cầu CNF để mỗi bước chỉ cần ghép hai đoạn.",
        focus: ["cnf", "word"],
        edges: ["cnf-word"],
        metrics: { n: "6", o: "21", k: "—", ket: "CNF hợp lệ" },
        changes: ["Chuẩn hóa văn phạm", "Chỉ còn A→BC, A→a"],
        note: "Văn phạm 0ⁿ1ⁿ dùng trong phòng mô phỏng đã ở CNF: S → AT | AB, T → SB, A → a, B → b."
      },
      {
        short: "Bảng",
        type: "KỸ THUẬT",
        title: "Ô (i, j) chứa biến nào",
        body: "Bảng tam giác có ô cho mọi đoạn con <code>w[i..j]</code>. Đường chéo chính là đoạn dài 1, điền bằng luật <code>A → a</code>. Các đường chéo dài dần điền sau. Với chuỗi dài <code>n</code>, có <code>n(n+1)/2</code> ô — với <code>n = 6</code> là 21 ô.",
        focus: ["table", "cell"],
        edges: ["split-table", "table-cell"],
        metrics: { n: "6", o: "21", k: "—", ket: "khởi tạo" },
        changes: ["Tạo bảng tam giác", "Điền đoạn dài 1"],
        note: "Có thể lưu mỗi ô là Set hoặc mảng đã sắp xếp. Sắp xếp giúp so sánh và hiển thị ổn định."
      },
      {
        short: "Điền ô",
        type: "KỸ THUẬT",
        title: "Thử mọi điểm tách k",
        body: "Để tính ô <code>(i, j)</code>, với mỗi <code>k</code> từ <code>i</code> đến <code>j−1</code>, ghép mọi biến trong ô <code>(i,k)</code> với mọi biến trong ô <code>(k+1,j)</code>. Nếu có luật <code>A → BC</code> khớp cặp <code>B, C</code>, thêm <code>A</code> vào ô. Làm từ đoạn ngắn đến dài để ô con luôn sẵn sàng.",
        focus: ["split", "cell", "cnf"],
        edges: ["word-split", "cnf-cell", "split-table"],
        metrics: { n: "6", o: "21", k: "1…j−i", ket: "quy hoạch động" },
        changes: ["Duyệt k", "Ghép cặp biến"],
        note: "Độ phức tạp O(n³·|P|): ba vòng lồng i, j, k và duyệt luật. Chấp nhận được với câu lệnh ngắn, không dùng cho văn bản lớn."
      },
      {
        short: "Đọc kết quả",
        type: "KỸ THUẬT",
        title: "Chỉ cần ô góc",
        body: "Sau khi điền, chuỗi thuộc ngôn ngữ khi và chỉ khi biến bắt đầu <code>S</code> nằm trong ô <code>(1,n)</code> — ô phủ toàn chuỗi. Với <code>aaabbb</code> và văn phạm 0ⁿ1ⁿ, ô này chứa <code>S</code>; với <code>aabbb</code>, ô chứa <code>T</code> nhưng không có <code>S</code>, nên từ chối.",
        focus: ["verdict", "table"],
        edges: ["cell-verdict"],
        metrics: { n: "6", o: "21", k: "đã điền", ket: "S có mặt" },
        changes: ["Đọc ô (1,n)", "Kết luận thành viên"],
        note: "CYK chỉ trả lời có/không. Muốn lấy cây cú pháp, cần lưu thêm con trỏ truy vết cho mỗi biến được thêm."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Quy hoạch động cho ngôn ngữ",
        body: "CYK biến bài toán thành viên thành bài toán đoạn con, mỗi đoạn giải một lần. Nó là ví dụ sớm của phân tích cú pháp bằng quy hoạch động. Các parser thực tế dùng thuật toán nhanh hơn cho lớp con của CFG, nhưng CYK vẫn là chuẩn mực để hiểu và kiểm thử.",
        focus: "all",
        edges: "all",
        metrics: { n: "n", o: "n(n+1)/2", k: "O(n³)", ket: "thành viên" },
        changes: ["Nắm CYK", "Hiểu chi phí"],
        note: "Bài cuối module chuyển sang mô hình mạnh nhất: máy Turing, nơi băng vừa đọc vừa ghi và không giới hạn số bước."
      }
    ]
  };

  L["may-turing"] = {
    id: "may-turing",
    module: "turing",
    title: "Máy Turing",
    shortTitle: "Máy Turing",
    subtitle: "Máy Turing có băng vô hạn, đầu đọc di chuyển hai chiều và được ghi đè. Với mô hình này, “thuật toán” trở thành khái niệm hình thức — và giới hạn tính toán cũng lộ ra.",
    blurb: "Băng, đầu đọc và luật chuyển.",
    duration: "14 phút",
    level: "Nâng cao",
    tags: ["turing machine", "tape", "head", "configuration", "computation"],
    metrics: [
      { key: "bang", label: "Băng", tone: "blue" },
      { key: "dau", label: "Đầu đọc", tone: "yellow" },
      { key: "buoc", label: "Bước", tone: "green" },
      { key: "ket", label: "Kết luận", tone: "violet" }
    ],
    nodes: [
      { id: "tape", type: "tape", x: 50, y: 80, w: 230, h: 70, label: "Băng vô hạn", sub: "1 0 1 1 _ _ …" },
      { id: "head", type: "tm", x: 360, y: 80, w: 190, h: 70, label: "Đầu đọc", sub: "vị trí hiện tại" },
      { id: "table", type: "table", x: 620, y: 80, w: 195, h: 70, label: "Bảng luật", sub: "(q, đọc) → …" },
      { id: "state", type: "dfa", x: 50, y: 315, w: 200, h: 70, label: "Bộ điều khiển", sub: "trạng thái hữu hạn" },
      { id: "write", type: "merge", x: 330, y: 315, w: 210, h: 70, label: "Ghi đè + di chuyển", sub: "L / R" },
      { id: "halt", type: "accept", x: 620, y: 315, w: 195, h: 70, label: "Dừng", sub: "nhận / từ chối" }
    ],
    edges: [
      { id: "tape-head", from: "tape", to: "head", kind: "data", label: "đọc ô" },
      { id: "head-table", from: "head", to: "table", kind: "request", label: "tra luật" },
      { id: "table-state", from: "table", to: "state", kind: "data", label: "đổi trạng thái" },
      { id: "state-write", from: "state", to: "write", kind: "data", label: "hành động" },
      { id: "write-tape", from: "write", to: "tape", kind: "response", label: "cập nhật", bow: 26 },
      { id: "write-halt", from: "write", to: "halt", kind: "response", label: "khi gặp trạng thái dừng" }
    ],
    learn: [
      "Mô tả băng, đầu đọc và cấu hình tức thời.",
      "Đọc luật chuyển của máy Turing.",
      "Chạy từng bước trên một băng ngắn.",
      "Phân biệt dừng và không dừng."
    ],
    steps: [
      {
        short: "Mô hình",
        type: "TỔNG QUAN",
        title: "Băng hai chiều, ghi được",
        body: "Máy Turing gồm bộ điều khiển hữu hạn, băng chia ô chứa ký tự (có ô trống), đầu đọc chỉ vào một ô, và bảng luật. Mỗi bước: đọc ký tự dưới đầu, ghi ký tự mới, di chuyển trái hoặc phải, đổi trạng thái. Khác PDA, băng cho phép quay lại và sửa dữ liệu đã ghi.",
        focus: ["tape", "head", "state"],
        edges: ["tape-head", "table-state"],
        metrics: { bang: "… 1 0 1 1 …", dau: "ô 1", buoc: "0", ket: "chưa chạy" },
        changes: ["Có băng ghi được", "Đầu đọc hai chiều"],
        note: "Băng vô hạn về lý thuyết; trong mô phỏng, ta cấp thêm ô khi đầu đọc vượt biên. Đây là chi tiết cài đặt, không đổi sức mạnh."
      },
      {
        short: "Luật",
        type: "KỸ THUẬT",
        title: "(q, a) → (p, b, L/R)",
        body: "Luật có dạng: ở trạng thái <code>q</code> đọc <code>a</code>, ghi <code>b</code>, đi <code>L</code> hoặc <code>R</code>, sang <code>p</code>. Nếu không có luật cho cặp (trạng thái, ký tự), máy dừng ngay — có thể coi là từ chối. Trạng thái nhận và từ chối là hai trạng thái dừng tường minh.",
        focus: ["table", "state"],
        edges: ["head-table", "table-state"],
        metrics: { bang: "…", dau: "ô 1", buoc: "1", ket: "áp luật" },
        changes: ["Tra bảng", "Ghi, đi, đổi trạng thái"],
        note: "Cùng một cặp (q, a) chỉ có tối đa một luật ở máy đơn định. Máy không đơn định được phép nhiều luật và mạnh tương đương về khả năng nhận."
      },
      {
        short: "Chạy bước",
        type: "KỸ THUẬT",
        title: "Cấu hình và dấu vết",
        body: "Cấu hình tức thời gồm trạng thái, nội dung băng và vị trí đầu đọc. Với máy cộng 1 nhị phân trên <code>1011</code>: quét sang phải tới ô trống, lùi lại, đổi các bit 1 thành 0, gặp 0 đầu tiên thì thành 1 và dừng. Băng cuối <code>1100</code>, đúng kết quả <code>1011₂ + 1</code>.",
        focus: ["tape", "head", "write"],
        edges: ["tape-head", "state-write", "write-tape"],
        metrics: { bang: "1 1 0 0 _", dau: "sau khi dừng", buoc: "8", ket: "nhận" },
        changes: ["Bit nhớ lan trái", "Băng được ghi đè"],
        note: "Số bước ở đây là số lần áp luật. Máy Turing có thể chạy rất lâu; độ phức tạp thời gian được đo theo số bước như hàm của độ dài nhập."
      },
      {
        short: "Dừng",
        type: "CẢNH BÁO",
        tone: "warn",
        title: "Không dừng cũng là một kết cục",
        body: "Máy Turing có thể chạy mãi không dừng. Với một số máy và đầu vào, không có thuật toán nào quyết định trước liệu máy sẽ dừng — đó là bài toán dừng, sẽ học ở bài cuối. Trong mô phỏng, ta đặt giới hạn bước và báo “chưa dừng sau N bước”, không kết luận vội.",
        focus: ["halt", "state"],
        edges: ["write-halt"],
        metrics: { bang: "…", dau: "…", buoc: "giới hạn", ket: "có thể không dừng" },
        changes: ["Thêm khả năng lặp vô hạn", "Cần giới hạn mô phỏng"],
        note: "Đừng nhầm “chưa dừng sau N bước” với “không bao giờ dừng”. Chỉ khi chứng minh được chu trình lặp mới kết luận không dừng."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Chuẩn mực của tính toán",
        body: "Máy Turing mô phỏng được mọi máy tính thực tế và mọi ngôn ngữ lập trình (luận đề Church–Turing). Nó cũng là mô hình để định nghĩa “quyết định được”, “nhận dạng được” và chứng minh giới hạn. Mọi ngôn ngữ chính quy và phi ngữ cảnh đều nhận được bằng máy Turing, nhưng không ngược lại.",
        focus: "all",
        edges: "all",
        metrics: { bang: "vô hạn", dau: "hai chiều", buoc: "không chặn", ket: "mạnh nhất" },
        changes: ["Hiểu sức mạnh", "Chuẩn bị luận đề"],
        note: "Bài tiếp theo: vì sao nhiều mô hình rất khác nhau lại cùng sức mạnh, và hệ quả của luận đề Church–Turing."
      }
    ]
  };
})();
