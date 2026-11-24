/* AutoLab course data — phần 2: NFA, Thompson, subset construction */
(function () {
  "use strict";

  const L = window.AUTOLAB.lessons;

  L["nfa"] = {
    id: "nfa",
    module: "machines",
    title: "NFA — máy hữu hạn không đơn định",
    shortTitle: "NFA",
    subtitle: "NFA cho phép nhiều chuyển trên cùng một ký tự, thậm chí chuyển mà không đọc gì (ε). Máy “đoán” nhánh đúng; ta mô phỏng bằng cách bám mọi nhánh cùng lúc.",
    blurb: "Nhiều lựa chọn, cùng một ngôn ngữ.",
    duration: "11 phút",
    level: "Cơ bản",
    tags: ["nfa", "nondeterminism", "epsilon closure", "subset", "guess"],
    metrics: [
      { key: "q", label: "Trạng thái", tone: "blue" },
      { key: "eps", label: "ε-dịch chuyển", tone: "coral" },
      { key: "nhanh", label: "Nhánh", tone: "yellow" },
      { key: "ket", label: "Kết luận", tone: "green" }
    ],
    nodes: [
      { id: "start", type: "nfa", x: 50, y: 85, w: 190, h: 70, label: "q0", sub: "một trạng thái, nhiều lối" },
      { id: "branch", type: "merge", x: 330, y: 85, w: 220, h: 70, label: "Hai chuyển cùng nhãn", sub: "a → q1 hoặc q2" },
      { id: "eps", type: "eps", x: 640, y: 85, w: 185, h: 70, label: "ε-dịch chuyển", sub: "đổi trạng thái, không đọc" },
      { id: "set", type: "grid", x: 50, y: 315, w: 220, h: 70, label: "Tập trạng thái", sub: "{q1, q2, q5}" },
      { id: "closure", type: "pump", x: 345, y: 315, w: 205, h: 70, label: "ε-closure", sub: "bám mọi nhánh ε" },
      { id: "accept", type: "accept", x: 640, y: 315, w: 185, h: 70, label: "Nhận", sub: "có nhánh tới F" }
    ],
    edges: [
      { id: "start-branch", from: "start", to: "branch", kind: "request", label: "đoán" },
      { id: "branch-eps", from: "branch", to: "eps", kind: "data", label: "ε" },
      { id: "branch-set", from: "branch", to: "set", kind: "data", label: "gom nhánh" },
      { id: "set-closure", from: "set", to: "closure", kind: "data", label: "mở rộng" },
      { id: "closure-accept", from: "closure", to: "accept", kind: "response", label: "kiểm tra" },
      { id: "eps-set", from: "eps", to: "set", kind: "data", label: "thêm trạng thái", bow: 22 }
    ],
    learn: [
      "Phát biểu khác biệt giữa NFA và DFA.",
      "Tính ε-closure của một tập trạng thái.",
      "Mô phỏng NFA bằng tập trạng thái thay vì một trạng thái.",
      "Giải thích vì sao “đoán” không làm NFA mạnh hơn DFA."
    ],
    steps: [
      {
        short: "Định nghĩa",
        type: "TỔNG QUAN",
        title: "Nới lỏng tính đơn định",
        body: "NFA vẫn có bộ năm thành phần, nhưng hàm chuyển trả về một <strong>tập</strong> trạng thái: <code>δ: Q × (Σ ∪ {ε}) → P(Q)</code>. Từ một trạng thái, máy có thể đi nhiều đường hoặc không đi đường nào. Chỉ cần một đường tới trạng thái nhận là chuỗi được nhận.",
        focus: ["start", "branch"],
        edges: ["start-branch"],
        metrics: { q: "6", eps: "có", nhanh: "2", ket: "chưa chạy" },
        changes: ["Cho phép nhiều đích", "Định nghĩa nhận theo tồn tại"],
        note: "“Không đơn định” không nghĩa là ngẫu nhiên. Về lý thuyết, máy được coi là chọn đúng nhánh nếu nhánh đó dẫn tới nhận."
      },
      {
        short: "Đoán nhánh",
        type: "KỸ THUẬT",
        title: "Một ký tự, nhiều lối đi",
        body: "Ví dụ từ <code>q0</code> gặp <code>a</code> có thể sang <code>q1</code> hoặc <code>q2</code>. Đây là cách NFA “đoán” chuỗi sẽ tiếp diễn ra sao. Khi cài đặt, ta không chọn liều: ta giữ cả hai khả năng trong một tập và tiếp tục song song.",
        focus: ["branch", "set"],
        edges: ["branch-set"],
        metrics: { q: "6", eps: "có", nhanh: "2", ket: "bám tập" },
        changes: ["Sinh nhiều nhánh", "Gộp thành tập trạng thái"],
        note: "Số nhánh có thể tăng theo cấp số nhân nếu mô phỏng ngây thơ từng đường; mô phỏng theo tập tránh được điều đó."
      },
      {
        short: "ε-closure",
        type: "KỸ THUẬT",
        title: "Đóng dưới ε",
        body: "<code>ε-closure(S)</code> là <code>S</code> cộng mọi trạng thái đến được bằng 0 hay nhiều chuyển <code>ε</code>. Vì ε không tiêu thụ ký tự, đóng này được tính lại sau mỗi bước đọc. Đây là phép toán nền của mọi mô phỏng NFA và của subset construction.",
        focus: ["eps", "closure"],
        edges: ["branch-eps", "eps-set", "set-closure"],
        metrics: { q: "6", eps: "có", nhanh: "mở rộng", ket: "closure" },
        changes: ["Thêm trạng thái qua ε", "Không đọc ký tự"],
        note: "Cài đặt: duyệt đồ thị ε bằng DFS hoặc BFS. Độ phức tạp tuyến tính theo số chuyển của máy."
      },
      {
        short: "Mô phỏng",
        type: "KỸ THUẬT",
        title: "Chạy tập trạng thái",
        body: "Bắt đầu với <code>ε-closure({q0})</code>. Với ký tự <code>c</code>, lấy mọi đích của các chuyển nhãn <code>c</code> từ tập hiện tại, rồi đóng ε. Cuối chuỗi, nhận nếu tập giao với <code>F</code> khác rỗng. Với <code>(a|b)*abb</code>, tập cuối chứa trạng thái nhận khi chuỗi kết thúc đúng <code>abb</code>.",
        focus: ["set", "closure", "accept"],
        edges: ["set-closure", "closure-accept"],
        metrics: { q: "6", eps: "có", nhanh: "1 tập", ket: "nhận nếu giao F" },
        changes: ["Mỗi bước một tập", "Kết luận theo tồn tại"],
        note: "Khi một tập rỗng, không còn nhánh nào sống — chuỗi chắc chắn bị từ chối, có thể dừng sớm."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Sức mạnh ngang DFA",
        body: "Mọi NFA đều có DFA tương đương nhận cùng ngôn ngữ, nên NFA không mạnh hơn về khả năng nhận. Nó chỉ viết tự nhiên hơn cho một số mẫu, đặc biệt sau khi dựng Thompson. Cái giá là số trạng thái DFA có thể lớn hơn nhiều.",
        focus: "all",
        edges: "all",
        metrics: { q: "hữu hạn", eps: "tùy chọn", nhanh: "tập", ket: "tương đương DFA" },
        changes: ["Hiểu quan hệ NFA–DFA", "Chuẩn bị dựng Thompson"],
        note: "Bài tiếp theo: thuật toán Thompson dựng NFA từ regex theo cấu trúc đệ quy, không cần suy nghĩ thủ công."
      }
    ]
  };

  L["thompson"] = {
    id: "thompson",
    module: "machines",
    title: "Dựng NFA theo Thompson",
    shortTitle: "Thompson",
    subtitle: "Mỗi biểu thức chính quy được dựng thành một mảnh NFA có đúng một cửa vào và một cửa ra. Ghép các mảnh theo phép toán là xong — không cần tối ưu, chỉ cần đúng.",
    blurb: "Regex thành máy, từng mảnh một.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["thompson", "construction", "fragment", "nfa", "epsilon"],
    metrics: [
      { key: "manh", label: "Mảnh", tone: "coral" },
      { key: "noi", label: "Nối", tone: "blue" },
      { key: "hop", label: "Hợp", tone: "violet" },
      { key: "sao", label: "Sao", tone: "green" }
    ],
    nodes: [
      { id: "regex", type: "regex", x: 50, y: 80, w: 210, h: 70, label: "Regex E", sub: "cây cú pháp" },
      { id: "frag", type: "nfa", x: 340, y: 80, w: 210, h: 70, label: "Mảnh NFA", sub: "một vào, một ra" },
      { id: "cat", type: "string", x: 630, y: 80, w: 195, h: 70, label: "Nối", sub: "nối ra–vào" },
      { id: "alt", type: "merge", x: 50, y: 310, w: 210, h: 70, label: "Hợp", sub: "vào chung, ra chung" },
      { id: "star", type: "pump", x: 340, y: 310, w: 210, h: 70, label: "Sao", sub: "vòng lặp ε" },
      { id: "final", type: "accept", x: 630, y: 310, w: 195, h: 70, label: "Máy kết quả", sub: "nhận đúng L(E)" }
    ],
    edges: [
      { id: "regex-frag", from: "regex", to: "frag", kind: "data", label: "đệ quy" },
      { id: "frag-cat", from: "frag", to: "cat", kind: "data", label: "ghép" },
      { id: "frag-alt", from: "frag", to: "alt", kind: "data", label: "song song" },
      { id: "frag-star", from: "frag", to: "star", kind: "data", label: "lặp" },
      { id: "cat-final", from: "cat", to: "final", kind: "response", label: "hoàn tất" },
      { id: "star-final", from: "star", to: "final", kind: "response", label: "hoàn tất", bow: 22 }
    ],
    learn: [
      "Mô tả bất biến “một vào, một ra” của mảnh Thompson.",
      "Dựng mảnh cho ký tự, phép nối, phép hợp và sao.",
      "Ước lượng số trạng thái của NFA kết quả.",
      "Giải thích vì sao thuật toán không cần quay lui hay tối ưu."
    ],
    steps: [
      {
        short: "Mảnh",
        type: "TỔNG QUAN",
        title: "Mỗi biểu thức là một hộp",
        body: "Thuật toán Thompson dựng đệ quy: mỗi biểu thức con trở thành một mảnh NFA với đúng một trạng thái vào và một trạng thái ra. Bên trong có thể tùy ý, nhưng bên ngoài chỉ thấy hai cửa. Nhờ vậy, ghép mảnh không cần biết chi tiết bên trong.",
        focus: ["regex", "frag"],
        edges: ["regex-frag"],
        metrics: { manh: "1", noi: "—", hop: "—", sao: "—" },
        changes: ["Định nghĩa giao diện mảnh", "Bắt đầu đệ quy"],
        note: "Trạng thái vào/ra của mảnh không nhất thiết là trạng thái bắt đầu/nhận của toàn máy; chúng chỉ là điểm nối."
      },
      {
        short: "Nối",
        type: "KỸ THUẬT",
        title: "Ký tự và phép nối",
        body: "Ký tự <code>a</code> thành mảnh hai trạng thái với một chuyển nhãn <code>a</code>. Với <code>E1E2</code>, dựng hai mảnh rồi nối cửa ra của mảnh một vào cửa vào của mảnh hai bằng ε. Không cần thêm trạng thái mới cho phép nối.",
        focus: ["frag", "cat"],
        edges: ["frag-cat"],
        metrics: { manh: "2", noi: "1 ε", hop: "—", sao: "—" },
        changes: ["Hai mảnh ký tự", "Một cầu ε"],
        note: "Có thể bỏ ε nối nếu đầu ra của mảnh trước trùng đầu vào mảnh sau; bản chuẩn giữ ε cho rõ ràng."
      },
      {
        short: "Hợp",
        type: "KỸ THUẬT",
        title: "Hai nhánh song song",
        body: "Với <code>E1|E2</code>, tạo trạng thái vào mới nối ε tới hai mảnh, và trạng thái ra mới nhận ε từ hai mảnh. Máy có thể đi nhánh nào cũng được — đúng tinh thần không đơn định. Tốn thêm hai trạng thái và bốn cầu ε.",
        focus: ["alt", "frag"],
        edges: ["frag-alt"],
        metrics: { manh: "3", noi: "—", hop: "2 ε vào, 2 ε ra", sao: "—" },
        changes: ["Thêm vào/ra chung", "Hai nhánh độc lập"],
        note: "Nếu một nhánh chết, nhánh còn lại vẫn tiếp tục; NFA không cần chọn trước."
      },
      {
        short: "Sao",
        type: "KỸ THUẬT",
        title: "Vòng lặp ε",
        body: "Với <code>E*</code>, thêm trạng thái vào/ra mới. Từ vào có ε tới mảnh và ε thẳng tới ra (bỏ qua, tức 0 lần). Từ ra của mảnh có ε quay lại đầu mảnh (lặp) và ε tới ra mới. Với <code>E+</code>, bỏ đường ε bỏ qua; với <code>E?</code>, giữ đường bỏ qua nhưng bỏ vòng lặp.",
        focus: ["star", "final"],
        edges: ["frag-star", "star-final"],
        metrics: { manh: "4", noi: "—", hop: "—", sao: "3 ε" },
        changes: ["Thêm vòng lặp", "Cho phép 0 lần"],
        note: "Vòng ε không đọc ký tự nên không làm máy treo miễn là ε-closure dùng tập đã thăm. Đừng viết DFS không đánh dấu."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Tuyến tính theo kích thước regex",
        body: "Mỗi ký tự sinh 2 trạng thái; mỗi phép hợp, sao thêm tối đa 2 trạng thái. NFA kết quả có <code>O(|E|)</code> trạng thái và chuyển, dựng trong thời gian tuyến tính. Máy có thể dư thừa nhưng luôn đúng — đó là mục tiêu của Thompson.",
        focus: "all",
        edges: "all",
        metrics: { manh: "O(|E|)", noi: "O(|E|)", hop: "O(|E|)", sao: "O(|E|)" },
        changes: ["Có NFA từ mọi regex", "Không tối ưu, chỉ đúng"],
        note: "NFA này thường lớn hơn cần thiết. Bước tiếp theo đổi sang DFA để chạy nhanh và không cần bám tập."
      }
    ]
  };

  L["subset"] = {
    id: "subset",
    module: "machines",
    title: "Subset construction: NFA thành DFA",
    shortTitle: "Subset",
    subtitle: "Mỗi trạng thái DFA đại diện cho một tập trạng thái NFA. Đọc cùng một ký tự, tập mới được tính bằng phép chuyển rồi đóng ε. Chỉ giữ các tập đến được từ tập đầu.",
    blurb: "Bỏ đoán bằng cách mang cả tập theo.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["subset construction", "dfa", "nfa", "powerset", "closure"],
    metrics: [
      { key: "tap", label: "Tập NFA", tone: "blue" },
      { key: "dfa", label: "Trạng thái DFA", tone: "coral" },
      { key: "den", label: "Đến được", tone: "green" },
      { key: "no", label: "Bùng nổ", tone: "yellow" }
    ],
    nodes: [
      { id: "nfa", type: "nfa", x: 50, y: 80, w: 200, h: 70, label: "NFA", sub: "6 trạng thái" },
      { id: "seed", type: "eps", x: 330, y: 80, w: 210, h: 70, label: "Tập đầu", sub: "ε-closure({q0})" },
      { id: "move", type: "merge", x: 620, y: 80, w: 195, h: 70, label: "move + ε", sub: "δ(S, c)" },
      { id: "queue", type: "queue", x: 50, y: 315, w: 210, h: 70, label: "Hàng đợi tập", sub: "khám phá dần" },
      { id: "table", type: "table", x: 335, y: 315, w: 210, h: 70, label: "Bảng DFA", sub: "A, B, C…" },
      { id: "final", type: "dfa", x: 620, y: 315, w: 195, h: 70, label: "DFA", sub: "5 trạng thái" }
    ],
    edges: [
      { id: "nfa-seed", from: "nfa", to: "seed", kind: "data", label: "đóng ε" },
      { id: "seed-move", from: "seed", to: "move", kind: "request", label: "đọc ký tự" },
      { id: "move-queue", from: "move", to: "queue", kind: "data", label: "tập mới" },
      { id: "queue-table", from: "queue", to: "table", kind: "data", label: "đặt tên" },
      { id: "table-final", from: "table", to: "final", kind: "response", label: "hoàn tất" },
      { id: "move-move", from: "move", to: "move", kind: "data", label: "lặp", bow: -30 }
    ],
    learn: [
      "Định nghĩa trạng thái DFA là một tập trạng thái NFA.",
      "Áp dụng công thức chuyển có ε-closure.",
      "Chỉ sinh trạng thái đến được để tránh lãng phí.",
      "Ước lượng trường hợp xấu nhất 2ⁿ trạng thái."
    ],
    steps: [
      {
        short: "Ý tưởng",
        type: "TỔNG QUAN",
        title: "Mang cả tập theo",
        body: "Thay vì đoán một nhánh, DFA mang <strong>tập tất cả</strong> trạng thái NFA có thể đang ở. Mỗi tập như vậy là một trạng thái DFA. Vì NFA hữu hạn, số tập hữu hạn, nên DFA cũng hữu hạn — dù có thể rất lớn.",
        focus: ["nfa", "seed"],
        edges: ["nfa-seed"],
        metrics: { tap: "{q0,…}", dfa: "1", den: "khởi tạo", no: "2ⁿ" },
        changes: ["Chuyển sang ngữ nghĩa tập", "Trạng thái DFA = tập"],
        note: "Tên trạng thái DFA trong bài được đánh A, B, C… theo thứ tự phát hiện, không theo nội dung tập."
      },
      {
        short: "Tập đầu",
        type: "KỸ THUẬT",
        title: "Đóng ε của trạng thái bắt đầu",
        body: "Tập đầu là <code>ε-closure({q0})</code>, không chỉ <code>{q0}</code>. Nếu <code>q0</code> có ε tới vài trạng thái khác, những trạng thái đó cũng có mặt ngay từ trước khi đọc ký tự nào. Bỏ sót bước này là lỗi phổ biến khi cài đặt.",
        focus: ["seed"],
        edges: ["nfa-seed"],
        metrics: { tap: "{q0,q1,q3}", dfa: "1", den: "A", no: "2ⁿ" },
        changes: ["Mở rộng bằng ε", "Đặt tên A"],
        note: "Tập đầu cũng là trạng thái nhận nếu nó chứa trạng thái nhận của NFA — nghĩa là ε thuộc ngôn ngữ."
      },
      {
        short: "Công thức",
        type: "KỸ THUẬT",
        title: "δ_DFA(S, c) = ε-closure(move(S, c))",
        body: "Với tập <code>S</code> và ký tự <code>c</code>, trước hết lấy mọi đích của các chuyển nhãn <code>c</code> từ trạng thái trong <code>S</code>, sau đó đóng ε. Kết quả là một tập mới, tức một trạng thái DFA. Nếu tập rỗng, có thể bỏ chuyển hoặc dẫn tới trạng thái bẫy.",
        focus: ["move", "seed"],
        edges: ["seed-move", "move-queue"],
        metrics: { tap: "S → S′", dfa: "+1", den: "tính mới", no: "2ⁿ" },
        changes: ["Áp dụng move", "Đóng ε"],
        note: "Thứ tự move rồi closure là bắt buộc. Làm ngược lại sẽ sinh trạng thái sai."
      },
      {
        short: "Chỉ đến được",
        type: "KỸ THUẬT",
        title: "Khám phá bằng hàng đợi",
        body: "Không liệt kê mọi tập con của <code>Q</code>. Bắt đầu từ tập đầu, với mỗi ký tự tính tập kế, nếu chưa có thì thêm vào hàng đợi và bảng. Khi hàng đợi rỗng, DFA hoàn tất. Với <code>(ab)+</code> chỉ có 3 trạng thái đến được, dù giới hạn lý thuyết là 2⁶.",
        focus: ["queue", "table"],
        edges: ["move-queue", "queue-table"],
        metrics: { tap: "hữu hạn", dfa: "3", den: "BFS", no: "tránh lãng phí" },
        changes: ["Duyệt BFS", "Chỉ lưu tập mới"],
        note: "Cần chuẩn hóa tập (sắp xếp id) để so sánh và tránh tạo trùng. Trong JS có thể dùng khóa nối bằng dấu phẩy."
      },
      {
        short: "Tóm tắt",
        type: "TÓM TẮT",
        tone: "final",
        title: "Đổi không đơn định lấy kích thước",
        body: "Subset construction luôn cho DFA tương đương, chạy tuyến tính theo chuỗi mà không cần bám tập. Cái giá là số trạng thái có thể tăng theo cấp số nhân; có ngôn ngữ mà DFA nhỏ nhất vẫn cần <code>2ⁿ</code> trạng thái so với NFA <code>n</code> trạng thái. Đó là lý do công cụ thực tế cân nhắc giữa NFA mô phỏng và DFA dựng sẵn.",
        focus: "all",
        edges: "all",
        metrics: { tap: "2ⁿ tối đa", dfa: "tương đương", den: "BFS", no: "cấp số nhân" },
        changes: ["Có DFA từ NFA", "Hiểu trade-off"],
        note: "DFA sinh ra có thể còn trạng thái thừa. Bài tiếp theo gộp các trạng thái tương đương để thu gọn."
      }
    ]
  };
})();
