/* AutoLab course data — phần 5: Church–Turing, tính quyết định, luyện tập */
(function () {
  "use strict";

  const L = window.AUTOLAB.lessons;

  L["luan-de"] = {
    id: "luan-de",
    module: "turing",
    title: "Luận đề Church–Turing và các biến thể",
    shortTitle: "Church–Turing",
    subtitle: "Máy nhiều băng, máy không đơn định, máy RAM hay ngôn ngữ lập trình đều mô phỏng lẫn nhau. Luận đề Church–Turing nói rằng “tính được” là khái niệm độc lập với mô hình cụ thể.",
    blurb: "Mọi mô hình hợp lý đều gặp nhau.",
    duration: "10 phút",
    level: "Nâng cao",
    tags: ["church-turing", "multi-tape", "nondeterministic", "simulation", "computation"],
    metrics: [
      { key: "mo", label: "Mô hình", tone: "blue" },
      { key: "chi", label: "Chi phí", tone: "yellow" },
      { key: "manh", label: "Sức mạnh", tone: "green" },
      { key: "ket", label: "Kết luận", tone: "violet" }
    ],
    nodes: [
      { id: "tm", type: "tm", x: 50, y: 80, w: 190, h: 70, label: "Máy Turing", sub: "một băng" },
      { id: "multi", type: "tape", x: 320, y: 80, w: 210, h: 70, label: "Máy nhiều băng", sub: "mô phỏng được" },
      { id: "nd", type: "nfa", x: 620, y: 80, w: 195, h: 70, label: "Máy không đơn định", sub: "duyệt cây tính toán" },
      { id: "ram", type: "cpu", x: 50, y: 315, w: 190, h: 70, label: "Máy RAM", sub: "bộ nhớ truy cập trực tiếp" },
      { id: "prog", type: "code", x: 320, y: 315, w: 210, h: 70, label: "Ngôn ngữ lập trình", sub: "C, Python, JS…" },
      { id: "same", type: "check", x: 620, y: 315, w: 195, h: 70, label: "Tương đương", sub: "cùng lớp hàm tính được" }
    ],
    edges: [
      { id: "tm-multi", from: "tm", to: "multi", kind: "data", label: "thêm băng" },
      { id: "tm-nd", from: "tm", to: "nd", kind: "data", label: "thêm nhánh" },
      { id: "multi-ram", from: "multi", to: "ram", kind: "data", label: "mô phỏng" },
      { id: "nd-prog", from: "nd", to: "prog", kind: "data", label: "mô phỏng" },
      { id: "ram-same", from: "ram", to: "same", kind: "response", label: "quy về" },
      { id: "prog-same", from: "prog", to: "same", kind: "response", label: "quy về", bow: 22 }
    ],
    learn: [
      "Phát biểu luận đề Church–Turing và giới hạn của nó.",
      "Giải thích máy nhiều băng không mạnh hơn máy một băng.",
      "Hiểu chi phí mô phỏng máy không đơn định.",
      "Phân biệt “tính được” với “hiệu quả”."
    ],
    steps: [
      {
        short: "Luận đề",
        type: "TỔNG QUAN",
        title: "Tính được = máy Turing",
        body: "Luận đề Church–Turing phát biểu: hàm nào “tính được bằng thủ tục hữu hạn” thì cũng tính được bằng máy Turing, và ngược lại. Đây không phải định lý chứng minh được vì “thủ tục hữu hạn” không hình thức; nó là luận đề định nghĩa. Mọi mô hình tính toán hợp lý đều cho cùng lớp hàm.",
        focus: ["tm", "same"],
        edges: ["tm-multi"],
        metrics: { mo: "máy Turing", chi: "—", manh: "chuẩn", ket: "định nghĩa tính được" },
        changes: ["Chọn mô hình chuẩn", "Định nghĩa lớp hàm"],
        note: "Luận đề không nói máy Turing nhanh nhất, chỉ nói nó đủ để mô tả mọi tính toán. Hiệu quả là câu chuyện khác."
      },
      {
        short: "Nhiều băng",
        type: "KỸ THUẬT",
        title: "Nhiều băng không mạnh hơn",
        body: "Máy nhiều băng có thể thuận tiện hơn, nhưng máy một băng mô phỏng được bằng cách chia băng thành các vùng có dấu phân cách và dịch chuyển đầu đọc. Thời gian có thể tăng bình phương, nhưng khả năng nhận không đổi. Vì vậy khi chứng minh, được phép giả sử nhiều băng nếu tiện.",
        focus: ["multi", "tm"],
        edges: ["tm-multi", "multi-ram"],
        metrics: { mo: "nhiều băng", chi: "O(t²)", manh: "tương đương", ket: "tiện cho chứng minh" },
        changes: ["Thêm băng", "Mô phỏng bằng vùng"],
        note: "Trong phân tích độ phức tạp, số băng ảnh hưởng hằng số và đôi khi cả bậc đa thức, nhưng không đổi lớp P/NP."
      },
      {
        short: "Không đơn định",
        type: "KỸ THUẬT",
        title: "Đoán song song",
        body: "Máy Turing không đơn định được phép nhiều luật cho cùng (q, a). Nó nhận nếu tồn tại một nhánh chấp nhận. Về khả năng nhận, máy không đơn định tương đương máy đơn định: máy đơn định duyệt cây tính toán theo BFS. Về thời gian, mô phỏng có thể tốn hàm mũ — đây là gốc của bài toán P vs NP.",
        focus: ["nd", "prog"],
        edges: ["tm-nd", "nd-prog"],
        metrics: { mo: "không đơn định", chi: "có thể mũ", manh: "tương đương", ket: "P vs NP" },
        changes: ["Thêm nhánh", "Duyệt cây bằng BFS"],
        note: "Đừng kết luận máy không đơn định “giải nhanh hơn” theo nghĩa thực tế; nó chỉ là mô hình lý thuyết cho phép đoán."
      },
      {
        short: "Hệ quả",
        type: "KỸ THUẬT",
        title: "Độc lập với công nghệ",
        body: "Vì C, Python, chip ARM hay máy RAM đều mô phỏng được máy Turing (và ngược lại), kết quả về tính quyết định áp dụng cho mọi ngôn ngữ lập trình. Một bài toán không có thuật toán trên máy Turing thì không có trên bất kỳ máy tính thực tế nào. Đây là nền của toàn bộ lý thuyết tính toán.",
        focus: ["prog", "ram", "same"],
        edges: ["ram-same", "prog-same"],
        metrics: { mo: "mọi mô hình", chi: "đa thức thường", manh: "cùng lớp", ket: "hệ quả rộng" },
        changes: ["Quy mọi mô hình về TM", "Kết quả áp dụng toàn cầu"],
        note: "Mô phỏng giữa các mô hình thường chỉ sai khác đa thức, nên lớp P và NP ổn định qua các mô hình hợp lý."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Một lớp hàm, nhiều cách nhìn",
        body: "Luận đề Church–Turing cho phép ta chọn mô hình thuận tiện nhất cho từng chứng minh: nhiều băng, không đơn định, hay thậm chí ngôn ngữ bậc cao. Đổi lại, nó không giúp giải bài toán không tính được. Bài cuối cùng chỉ ra những bài toán như vậy và cách chứng minh bằng giảm dẫn.",
        focus: "all",
        edges: "all",
        metrics: { mo: "nhiều", chi: "đa thức", manh: "một lớp", ket: "chọn mô hình tùy ý" },
        changes: ["Hiểu luận đề", "Chuẩn bị giới hạn"],
        note: "Luận đề không nói gì về hiệu quả thực tế. Một thuật toán O(n¹⁰⁰) vẫn “tính được” nhưng vô dụng trong thực hành."
      }
    ]
  };

  L["quyet-dinh"] = {
    id: "quyet-dinh",
    module: "turing",
    title: "Tính quyết định và giảm dẫn",
    shortTitle: "Quyết định",
    subtitle: "Không phải bài toán nào cũng có thuật toán. Bài toán dừng là ví dụ nổi tiếng: không có máy Turing nào luôn dừng và trả lời đúng. Giảm dẫn là công cụ chứng minh các bài toán khác cũng bất khả quyết.",
    blurb: "Có giới hạn không thể vượt.",
    duration: "15 phút",
    level: "Nâng cao",
    tags: ["decidable", "halting problem", "reduction", "undecidable", "diagonal"],
    metrics: [
      { key: "qd", label: "Quyết định", tone: "green" },
      { key: "nd", label: "Nhận dạng", tone: "yellow" },
      { key: "gd", label: "Giảm dẫn", tone: "coral" },
      { key: "ket", label: "Kết luận", tone: "violet" }
    ],
    nodes: [
      { id: "problem", type: "alert", x: 50, y: 80, w: 210, h: 70, label: "Bài toán", sub: "đầu vào → có/không" },
      { id: "lang", type: "language", x: 340, y: 80, w: 200, h: 70, label: "Ngôn ngữ", sub: "tập đầu vào “có”" },
      { id: "tm", type: "tm", x: 620, y: 80, w: 195, h: 70, label: "Máy quyết định", sub: "luôn dừng" },
      { id: "halt", type: "clock", x: 50, y: 315, w: 210, h: 70, label: "Bài toán dừng", sub: "M dừng trên w?" },
      { id: "reduce", type: "merge", x: 340, y: 315, w: 200, h: 70, label: "Giảm dẫn", sub: "A ≤ B" },
      { id: "no", type: "reject", x: 620, y: 315, w: 195, h: 70, label: "Bất khả quyết", sub: "không thuật toán" }
    ],
    edges: [
      { id: "problem-lang", from: "problem", to: "lang", kind: "data", label: "mã hóa" },
      { id: "lang-tm", from: "lang", to: "tm", kind: "request", label: "quyết định" },
      { id: "halt-reduce", from: "halt", to: "reduce", kind: "data", label: "là mẫu" },
      { id: "reduce-no", from: "reduce", to: "no", kind: "data", label: "lan truyền" },
      { id: "tm-no", from: "tm", to: "no", kind: "response", label: "không tồn tại", bow: 24 },
      { id: "halt-no", from: "halt", to: "no", kind: "response", label: "không thuật toán" }
    ],
    learn: [
      "Phân biệt quyết định được và nhận dạng được.",
      "Trình bày ý tưởng chứng minh bài toán dừng bất khả quyết.",
      "Hiểu giảm dẫn A ≤ B và chiều lan truyền.",
      "Nêu ví dụ bài toán thực tế không có thuật toán tổng quát."
    ],
    steps: [
      {
        short: "Hai mức",
        type: "TỔNG QUAN",
        title: "Quyết định và nhận dạng",
        body: "Ngôn ngữ <code>L</code> <strong>quyết định được</strong> nếu có máy Turing luôn dừng và trả lời đúng có/không cho mọi đầu vào. <code>L</code> <strong>nhận dạng được</strong> nếu có máy dừng và nhận khi chuỗi thuộc <code>L</code>, nhưng có thể chạy mãi khi chuỗi không thuộc. Quyết định được mạnh hơn: nó luôn cho câu trả lời.",
        focus: ["problem", "lang", "tm"],
        edges: ["problem-lang", "lang-tm"],
        metrics: { qd: "luôn dừng", nd: "có thể treo", gd: "—", ket: "phân biệt" },
        changes: ["Định nghĩa hai mức", "Máy quyết định luôn dừng"],
        note: "Mọi ngôn ngữ quyết định được đều nhận dạng được. Chiều ngược lại không đúng."
      },
      {
        short: "Bài toán dừng",
        type: "CẢNH BÁO",
        tone: "warn",
        title: "Không thể luôn trả lời",
        body: "Bài toán dừng hỏi: máy <code>M</code> có dừng trên chuỗi <code>w</code> không? Giả sử có máy <code>H</code> quyết định bài toán này. Ta dựng máy <code>D</code> dùng <code>H</code> để làm ngược lại: nếu <code>H</code> nói “dừng” thì <code>D</code> lặp mãi, nếu “không dừng” thì <code>D</code> dừng. Chạy <code>D</code> trên chính mã của nó tạo mâu thuẫn. Vậy <code>H</code> không tồn tại.",
        focus: ["halt", "no"],
        edges: ["halt-no"],
        metrics: { qd: "không", nd: "có", gd: "—", ket: "bất khả quyết" },
        changes: ["Giả sử có H", "D mâu thuẫn với chính nó"],
        note: "Đây là lập luận đường chéo kiểu Cantor. Nó không phụ thuộc tốc độ hay bộ nhớ — giới hạn là logic, không phải công nghệ."
      },
      {
        short: "Giảm dẫn",
        type: "KỸ THUẬT",
        title: "A ≤ B: chuyển bài toán",
        body: "Giảm dẫn <code>A ≤ B</code> nghĩa là có thủ tục tính được biến mỗi đầu vào của <code>A</code> thành đầu vào của <code>B</code> sao cho câu trả lời giữ nguyên. Nếu <code>B</code> quyết định được thì <code>A</code> quyết định được. Phản đề: nếu <code>A</code> bất khả quyết và <code>A ≤ B</code>, thì <code>B</code> cũng bất khả quyết.",
        focus: ["reduce", "problem"],
        edges: ["halt-reduce", "reduce-no"],
        metrics: { qd: "A ≤ B", nd: "—", gd: "bảo toàn", ket: "lan bất khả quyết" },
        changes: ["Xây phép biến đổi", "Chuyển kết luận"],
        note: "Chiều giảm rất quan trọng: A ≤ B nói B khó ít nhất bằng A. Muốn chứng minh B khó, giảm từ bài toán đã biết khó xuống B."
      },
      {
        short: "Ví dụ",
        type: "KỸ THUẬT",
        title: "Từ dừng sang tương đương máy",
        body: "Bài toán “hai máy Turing có nhận cùng ngôn ngữ không?” bất khả quyết: giảm từ bài toán dừng bằng cách dựng một máy tầm thường và một máy chạy <code>M</code> trên <code>w</code> rồi mới nhận mọi chuỗi. Tương tự, các câu hỏi tổng quát về chương trình — có bao giờ in “hello”, có truy cập mảng ngoài biên, có tương đương với chương trình khác — đều bất khả quyết. Công cụ kiểm thử thực tế chỉ xấp xỉ hoặc giới hạn miền.",
        focus: ["reduce", "no"],
        edges: ["reduce-no", "tm-no"],
        metrics: { qd: "không", nd: "—", gd: "từ dừng", ket: "nhiều bài toán" },
        changes: ["Dựng máy phụ thuộc M,w", "Lan sang bài toán khác"],
        note: "Đây là lý do không có công cụ nào chứng minh mọi chương trình không bao giờ lỗi. Bạn chỉ có thể kiểm thử, phân tích tĩnh trong giới hạn, hoặc dùng ngôn ngữ hạn chế."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Biết giới hạn để chọn cách",
        body: "Lý thuyết tính toán không chỉ nói cái gì làm được mà còn nói cái gì không. Với bài toán bất khả quyết, kỹ thuật thực tế là giới hạn miền, xấp xỉ, hoặc chứng minh cho lớp con. Hiểu giảm dẫn giúp nhận ra khi nào một yêu cầu là bất khả thi ngay từ đầu — trước khi viết hàng nghìn dòng code.",
        focus: "all",
        edges: "all",
        metrics: { qd: "một số lớp", nd: "rộng hơn", gd: "công cụ", ket: "chọn giới hạn" },
        changes: ["Hiểu bức tranh tổng thể", "Áp dụng tư duy giới hạn"],
        note: "Hết lộ trình AutoLab. Hãy thử phòng mô phỏng: tự dựng regex, chạy CYK và máy Turing, rồi hoàn thành 6 nhiệm vụ."
      }
    ]
  };

  window.AUTOLAB.practice = [
    {
      tag: "REGEX",
      title: "Mẫu email quá rộng",
      scenario: "Một form kiểm tra email bằng regex `\\S+@\\S+` và chấp nhận cả `a@b`, `@@`, thậm chí chuỗi có dấu cách bị cắt sai. Người dùng nhập email sai vẫn qua bước kiểm tra.",
      metrics: [
        { label: "Mẫu", value: "\\S+@\\S+" },
        { label: "Kiểm tra", value: "chỉ hình dạng" },
        { label: "Hậu quả", value: "nhận email rác", danger: true }
      ],
      options: [
        "Thêm `^` và `$` là đủ chính xác",
        "Dùng regex chặt hơn cho phần cú pháp, vẫn phải xác thực bằng gửi thư",
        "Bỏ kiểm tra phía client, chỉ dựa vào cơ sở dữ liệu",
        "Chuyển sang kiểm tra độ dài chuỗi dưới 20 ký tự"
      ],
      correct: 1,
      explain: "Regex chỉ nên kiểm tra hình dạng cơ bản: có đúng một @, phần trước/sau hợp lệ, không khoảng trắng. Không regex nào xác nhận hộp thư tồn tại; bước gửi thư xác thực mới quyết định. Neo ^...$ giúp tránh khớp một phần nhưng không sửa được mẫu quá rộng."
    },
    {
      tag: "HIỆU NĂNG",
      title: "Regex treo với chuỗi dài",
      scenario: "Mẫu `(a+)+b` chạy trên chuỗi gồm 30 chữ `a` không có `b` làm trình duyệt đứng vài giây. Cùng mẫu với 40 chữ `a` gần như treo hẳn.",
      metrics: [
        { label: "Mẫu", value: "(a+)+b" },
        { label: "Nhập", value: "a…a (không b)" },
        { label: "Hiện tượng", value: "bùng nổ tổ hợp", danger: true }
      ],
      options: [
        "Tăng giới hạn thời gian chạy regex lên 30 giây",
        "Viết lại mẫu tránh lồng lượng tử, ví dụ `a+b`, hoặc dùng công cụ có giới hạn",
        "Chuyển toàn bộ sang so khớp chuỗi con bằng vòng lặp",
        "Thêm cờ không phân biệt hoa thường"
      ],
      correct: 1,
      explain: "Lồng lượng tử như (a+)+ tạo nhiều cách chia cùng một đoạn a, dẫn tới số bước mũ khi thất bại. Viết lại thành a+b loại bỏ nhập nhằng. Với mẫu phức tạp, dùng engine tuyến tính hoặc đặt giới hạn độ dài đầu vào thay vì tăng timeout."
    },
    {
      tag: "DFA",
      title: "Hai trạng thái thừa",
      scenario: "Một DFA nhận chuỗi nhị phân có số 1 lẻ có 5 trạng thái, nhưng hai trạng thái luôn chuyển tới cùng đích với mọi ký tự và cùng là không nhận. Đồng nghiệp định thêm ký tự mới thay vì gộp.",
      metrics: [
        { label: "Trạng thái", value: "5" },
        { label: "Cặp tương đương", value: "2" },
        { label: "Cần làm", value: "tối thiểu hóa" }
      ],
      options: [
        "Thêm ký tự mới để phân biệt hai trạng thái",
        "Gộp hai trạng thái tương đương rồi kiểm tra lại bảng chuyển",
        "Đổi sang NFA để giảm số trạng thái",
        "Giữ nguyên vì DFA dư trạng thái không ảnh hưởng kết quả"
      ],
      correct: 1,
      explain: "Nếu hai trạng thái không thể phân biệt bằng bất kỳ chuỗi tiếp theo nào, chúng tương đương và phải gộp trong DFA tối thiểu. Thêm ký tự làm máy phức tạp hơn mà không sửa gốc. NFA có thể nhỏ hơn nhưng khi chạy vẫn cần bám tập."
    },
    {
      tag: "CHỨNG MINH",
      title: "Bổ đề bơm dùng sai chiều",
      scenario: "Một sinh viên chỉ ra rằng với L = {aⁿbⁿ}, chọn w = aᵖbᵖ, chia y = a và bơm i = 1 vẫn thuộc L. Kết luận L chính quy vì “bơm được”.",
      metrics: [
        { label: "Bổ đề", value: "điều kiện cần" },
        { label: "Đã xét", value: "một cách chia" },
        { label: "Lỗi", value: "kết luận ngược", danger: true }
      ],
      options: [
        "Đúng, chỉ cần tồn tại một cách chia bơm được là đủ",
        "Sai: phải xét mọi cách chia và mọi i; bơm được không chứng minh chính quy",
        "Đúng nếu chọn p bằng số trạng thái DFA",
        "Sai vì aⁿbⁿ là ngôn ngữ hữu hạn"
      ],
      correct: 1,
      explain: "Bổ đề bơm là điều kiện cần: L chính quy ⇒ tồn tại cách chia thỏa với mọi i. Muốn chứng minh không chính quy, phải chỉ ra mọi cách chia đều có i làm chuỗi ra ngoài L. Một cách chia bơm được không nói gì. Muốn chứng minh chính quy phải dựng DFA/NFA/regex."
    },
    {
      tag: "CFG",
      title: "Dangling else",
      scenario: "Văn phạm `S → if E then S | if E then S else S | stmt` cho câu `if a then if b then x else y`. Hai cây cú pháp khác nhau: else gắn với if ngoài hay if trong?",
      metrics: [
        { label: "Câu lệnh", value: "if lồng" },
        { label: "Số cây", value: "2", danger: true },
        { label: "Vấn đề", value: "nhập nhằng" }
      ],
      options: [
        "Thêm luật ưu tiên để else luôn gắn với if gần nhất, hoặc viết văn phạm tách tầng",
        "Đổi else thành từ khóa bắt buộc",
        "Xóa luật if không else khỏi văn phạm",
        "Dùng CYK để tự chọn cây đúng"
      ],
      correct: 1,
      explain: "Đây là nhập nhằng kinh điển của câu lệnh if. Cách chuẩn: quy ước else gắn với if gần nhất, thường bằng văn phạm tách matched/unmatched statement, hoặc dùng luật ưu tiên trong parser. Xóa luật if không else làm mất khả năng viết if đơn. CYK chỉ kiểm tra thành viên, không tự chọn nghĩa."
    },
    {
      tag: "CYK",
      title: "Văn phạm chưa chuẩn hóa",
      scenario: "Bạn muốn dùng CYK cho văn phạm `S → aSb | ab`. Cài đặt báo lỗi vì luật không phải CNF, nhưng bạn cần kết quả ngay.",
      metrics: [
        { label: "Luật", value: "S → aSb | ab" },
        { label: "Dạng", value: "chưa CNF", danger: true },
        { label: "Thuật toán", value: "CYK" }
      ],
      options: [
        "Bỏ qua kiểm tra CNF và chạy CYK với luật gốc",
        "Chuyển văn phạm về CNF (thêm biến, tách luật) rồi chạy CYK",
        "Thay CYK bằng bổ đề bơm",
        "Đổi bảng chữ cái để luật dài hơn hai ký tự"
      ],
      correct: 1,
      explain: "CYK yêu cầu mỗi luật chỉ có dạng A → BC hoặc A → a. Văn phạm aⁿbⁿ chuyển được về CNF với các biến phụ, ví dụ S → AT | AB, T → SB, A → a, B → b. Chạy CYK với luật gốc sẽ cho bảng sai vì bước ghép hai đoạn không còn đúng. Bổ đề bơm không phải thuật toán kiểm tra thành viên."
    },
    {
      tag: "MÁY TURING",
      title: "Dừng sau 1000 bước",
      scenario: "Mô phỏng máy Turing chạy 1000 bước vẫn chưa dừng. Một bạn kết luận máy không bao giờ dừng và loại bỏ mô hình.",
      metrics: [
        { label: "Đã chạy", value: "1000 bước" },
        { label: "Trạng thái", value: "chưa dừng" },
        { label: "Kết luận vội", value: "không dừng", danger: true }
      ],
      options: [
        "Đúng, 1000 bước là đủ để kết luận không dừng",
        "Sai: chưa dừng sau N bước không chứng minh không dừng; cần phân tích chu trình hoặc chứng minh",
        "Đúng nếu máy có ít hơn 10 trạng thái",
        "Sai vì máy Turing luôn dừng sau hữu hạn bước"
      ],
      correct: 1,
      explain: "Máy Turing có thể chạy bất kỳ số bước nào rồi mới dừng, nên quan sát hữu hạn không đủ kết luận. Muốn nói không dừng, phải tìm chu trình lặp của cấu hình hoặc chứng minh. Ngược lại, máy Turing không được đảm bảo luôn dừng — đó chính là bài toán dừng."
    },
    {
      tag: "ỨNG DỤNG",
      title: "Regex cho ngoặc lồng nhau",
      scenario: "Bạn cần kiểm tra biểu thức có ngoặc tròn cân bằng trong mã nguồn, ví dụ `((a+b)*c)`. Regex `\\(.*\\)` chấp nhận cả `)(` và không đếm được độ sâu.",
      metrics: [
        { label: "Mẫu", value: "\\(.*\\)" },
        { label: "Cần", value: "đếm lồng" },
        { label: "Giới hạn", value: "không chính quy", danger: true }
      ],
      options: [
        "Thêm `*` và `+` để regex đếm được độ sâu",
        "Dùng ngăn xếp hoặc parser (PDA) để kiểm tra cân bằng",
        "Đổi sang regex có lookahead để đếm ngoặc",
        "Chỉ kiểm tra số lượng dấu mở và đóng bằng nhau"
      ],
      correct: 1,
      explain: "Ngôn ngữ ngoặc cân bằng không chính quy: không regex/DFA nào đếm được độ sâu tùy ý. Cần ngăn xếp — đúng mô hình PDA — hoặc parser. Đếm số mở bằng số đóng vẫn nhận sai chuỗi `)(`. Lookahead của công cụ thực tế cũng không vượt giới hạn lý thuyết trừ khi dùng tính năng đệ quy đặc biệt."
    }
  ];
})();
