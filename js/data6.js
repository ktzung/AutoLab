/* AutoLab course data — phần 6: cheatsheets */
(function () {
  "use strict";

  window.AUTOLAB.cheatsheets = [
    {
      id: "regex",
      num: "01",
      title: "Regex & dựng máy",
      intro: "Cú pháp regex, thứ tự ưu tiên, các mảnh Thompson và công thức subset construction — tra nhanh khi làm bài hoặc cài đặt.",
      cards: [
        {
          title: "Cú pháp và ưu tiên",
          wide: true,
          html: `<pre><code>E → E | F      hợp: một trong hai
F → F G        nối: viết liền
G → H*         sao: 0 lần trở lên
H → (E) | a | ε

Ưu tiên:  *  >  nối  >  |
ab*   = a(b*)
a|bc  = a | (bc)
E+ = EE*      E? = E | ε</code></pre>
<p>Luôn thêm ngoặc khi muốn nhóm khác mặc định. Regex trong công cụ thực tế có thêm lớp ký tự, neo <code>^ $</code>, lookaround — nhưng phần lõi vẫn quy về ba phép toán.</p>`
        },
        {
          title: "Mảnh Thompson",
          html: `<pre><code>Ký tự a:   ○ --a--> ○
Nối FG:    fragF --ε--> fragG
Hợp F|G:   ○ --ε--> F
           ○ --ε--> G
           F,G --ε--> ○
Sao F*:    ○ --ε--> fragF
           ○ --ε--> ○ (bỏ qua)
           fragF --ε--> fragF (lặp)
           fragF --ε--> ○</code></pre>
<p>Bất biến: mỗi mảnh có đúng một cửa vào, một cửa ra. Kích thước <code>O(|E|)</code> trạng thái.</p>`
        },
        {
          title: "Subset construction",
          html: `<pre><code>q0' = ε-closure({q0})
δ'(S, c) = ε-closure(move(S, c))
F' = { S | S ∩ F ≠ ∅ }</code></pre>
<p>Mỗi trạng thái DFA là một tập trạng thái NFA. Chỉ sinh tập đến được từ <code>q0'</code> bằng BFS. Trường hợp xấu nhất <code>2ⁿ</code> trạng thái.</p>`
        },
        {
          title: "Tối thiểu hóa",
          html: `<pre><code>1. P = { F, Q − F }
2. Lặp: tách lớp nếu tồn tại c
   δ(p,c), δ(q,c) khác lớp
3. Dừng khi ổn định
4. Máy thương: mỗi lớp một trạng thái</code></pre>
<p>Hai trạng thái tương đương nếu mọi chuỗi tiếp theo cho cùng kết luận nhận/từ chối. DFA tối thiểu là duy nhất sai khác tên.</p>`
        },
        {
          title: "Bổ đề bơm — mẫu 4 bước",
          wide: true,
          html: `<pre><code>Giả sử L chính quy, độ dài bơm p.
Chọn w ∈ L, |w| ≥ p.
Với MỌI cách chia w = xyz:
  |xy| ≤ p, |y| ≥ 1
Chỉ ra i sao cho xyⁱz ∉ L.
Kết luận: mâu thuẫn → L không chính quy.</code></pre>
<p>Ví dụ <code>aⁿbⁿ</code>: chọn <code>aᵖbᵖ</code>; vì <code>|xy| ≤ p</code>, <code>y</code> toàn <code>a</code>; bơm <code>i = 2</code> làm số <code>a</code> nhiều hơn <code>b</code>.</p>
<p>Bổ đề là điều kiện <b>cần</b>. Bơm được không chứng minh chính quy; không bơm được mới chứng minh không chính quy.</p>`
        },
        {
          title: "Bẫy thường gặp",
          html: `<ul>
<li><b>Không neo:</b> <code>\\d+</code> khớp một phần chuỗi; dùng <code>^…$</code> nếu cần cả chuỗi.</li>
<li><b>Lồng lượng tử:</b> <code>(a+)+b</code> bùng nổ khi thất bại; viết lại <code>a+b</code>.</li>
<li><b>Ngoặc lồng:</b> không regex nào đếm được độ sâu tùy ý; cần PDA/parser.</li>
<li><b>Email:</b> regex chỉ kiểm tra hình dạng; xác thực thật bằng gửi thư.</li>
<li><b>Dấu chấm:</b> tùy engine, <code>.</code> có thể không khớp xuống dòng.</li>
</ul>`
        }
      ]
    },
    {
      id: "automata",
      num: "02",
      title: "Máy & ngôn ngữ",
      intro: "Bộ năm/bảy thành phần, quan hệ sức mạnh, tính đóng và các kết quả quyết định — bảng tra cho phần lý thuyết.",
      cards: [
        {
          title: "Bộ định nghĩa",
          wide: true,
          html: `<pre><code>DFA  (Q, Σ, δ, q0, F)
     δ: Q × Σ → Q

NFA  (Q, Σ, δ, q0, F)
     δ: Q × (Σ ∪ {ε}) → P(Q)

PDA  (Q, Σ, Γ, δ, q0, Z0, F)
     δ: Q × (Σ ∪ {ε}) × Γ → P(Q × Γ*)

TM   (Q, Σ, Γ, δ, q0, qA, qR)
     δ: Q × Γ → Q × Γ × {L,R}</code></pre>
<p>DFA/NFA: bộ nhớ hữu hạn. PDA: thêm ngăn xếp. TM: băng vô hạn đọc-ghi hai chiều.</p>`
        },
        {
          title: "Bậc thang sức mạnh",
          html: `<pre><code>Chính quy  ⊂  Phi ngữ cảnh
           ⊂  Ngữ cảnh
           ⊂  Đệ quy
           ⊂  Liệt kê đệ quy

Regex = DFA = NFA
CFG = PDA
TM = mọi thứ tính được</code></pre>
<p>Ví dụ phân tầng: <code>aⁿbⁿ</code> phi ngữ cảnh nhưng không chính quy; <code>aⁿbⁿcⁿ</code> ngữ cảnh nhưng không phi ngữ cảnh.</p>`
        },
        {
          title: "Tính đóng",
          html: `<pre><code>Chính quy: đóng với ∪, ∩, ·, *, bù, giao
CFG:       đóng với ∪, ·, *
           KHÔNG đóng với ∩, bù
TM nhận dạng: đóng với ∪, ∩
           KHÔNG đóng với bù</code></pre>
<p>Hệ quả: giao hai CFG có thể ra ngôn ngữ không phi ngữ cảnh. Muốn kiểm tra giao, thường quy về TM hoặc dùng thuộc tính cụ thể.</p>`
        },
        {
          title: "Quan hệ nhận–quyết định",
          html: `<pre><code>Quyết định được:
  máy luôn dừng, trả lời có/không
Nhận dạng được:
  máy dừng và nhận nếu thuộc L;
  có thể chạy mãi nếu không thuộc

Quyết định được ⇒ nhận dạng được
Ngược lại: KHÔNG</code></pre>
<p>Ngôn ngữ chính quy và phi ngữ cảnh đều quyết định được. Lớp TM chỉ nhận dạng được rộng hơn lớp quyết định được.</p>`
        },
        {
          title: "Bài toán dừng",
          html: `<pre><code>HALT = { ⟨M,w⟩ | M dừng trên w }
HALT không quyết định được.

Chứng minh (đường chéo):
Giả sử H quyết định HALT.
Dựng D dùng H: nếu H nói dừng
thì D lặp mãi; nếu không dừng
thì D dừng.
Chạy D trên ⟨D⟩ → mâu thuẫn.</code></pre>
<p>Giới hạn logic, không phụ thuộc tốc độ hay bộ nhớ. Mọi câu hỏi tổng quát về hành vi chương trình đều bất khả quyết.</p>`
        },
        {
          title: "Giảm dẫn",
          html: `<pre><code>A ≤ B: biến đầu vào A thành
đầu vào B, giữ nguyên đáp án.

Nếu B quyết định được → A quyết định được.
Nếu A bất khả quyết và A ≤ B
→ B bất khả quyết.</code></pre>
<p>Muốn chứng minh B khó, giảm từ bài toán đã biết khó xuống B (không làm ngược chiều). Ví dụ: HALT ≤ EQ_TM, nên EQ_TM bất khả quyết.</p>`
        }
      ]
    },
    {
      id: "grammar",
      num: "03",
      title: "Văn phạm, CYK & TM",
      intro: "Cú pháp văn phạm, dạng chuẩn Chomsky, cách điền bảng CYK và luật máy Turing — dùng khi giải bài tập và kiểm tra mô phỏng.",
      cards: [
        {
          title: "CFG và dẫn xuất",
          wide: true,
          html: `<pre><code>G = (V, T, P, S)
Luật: A → α,  A ∈ V, α ∈ (V ∪ T)*
Dẫn xuất: S ⇒ w1 ⇒ w2 ⇒ … ⇒ w
L(G) = { w ∈ T* | S ⇒* w }</code></pre>
<p>Dẫn xuất trái nhất thay biến trái nhất; phải nhất thay biến phải nhất. Cây cú pháp gộp các dẫn xuất cùng cấu trúc. Hai cây khác nhau cho cùng chuỗi ⇒ văn phạm nhập nhằng.</p>`
        },
        {
          title: "Ví dụ văn phạm",
          html: `<pre><code>aⁿbⁿ:     S → aSb | ab
Palindrome: S → aSa | bSb | a | b | ε
Biểu thức: E → E + T | T
           T → T × F | F
           F → (E) | id</code></pre>
<p>Đệ quy biểu diễn cấu trúc lồng. Tách tầng E/T/F cố định ưu tiên và khử nhập nhằng cho biểu thức.</p>`
        },
        {
          title: "Chuyển về CNF",
          html: `<pre><code>1. Khử ε (trừ S → ε nếu cần)
2. Khử luật đơn vị A → B
3. Đưa ký tự kết thúc vào biến phụ
4. Tách vế phải dài hơn 2 thành
   chuỗi luật nhị phân

Kết quả: A → BC  hoặc  A → a</code></pre>
<p>Ví dụ <code>S → aSb</code> sau chuẩn hóa có thể thành <code>S → AT | AB</code>, <code>T → SB</code>, <code>A → a</code>, <code>B → b</code>.</p>`
        },
        {
          title: "Điền bảng CYK",
          wide: true,
          html: `<pre><code>Với mỗi i: table[i][i] = { A | A → w[i] }
Với len = 2..n:
  với i, j = i+len−1:
    table[i][j] = { A |
      ∃k, A → BC,
      B ∈ table[i][k],
      C ∈ table[k+1][j] }

Nhận ⇔ S ∈ table[0][n−1]</code></pre>
<p>Số ô <code>n(n+1)/2</code>. Thời gian <code>O(n³·|P|)</code>. Bảng chỉ trả lời có/không; muốn cây phải lưu truy vết.</p>`
        },
        {
          title: "PDA",
          html: `<pre><code>δ(q, a, X) = (p, γ)
  đọc a, đỉnh X, sang p,
  thay X bằng γ (γ rỗng = pop)

aⁿbⁿ:
  đọc a: push A
  đọc b: pop A
  hết chuỗi + stack rỗng → nhận</code></pre>
<p>Ngăn xếp LIFO tạo cấu trúc lồng. CFG ↔ PDA: mọi CFG có PDA không đơn định tương đương và ngược lại.</p>`
        },
        {
          title: "Máy Turing",
          html: `<pre><code>Luật: (q, a) → (p, b, D)
  q: trạng thái hiện tại
  a: ký tự đọc
  b: ký tự ghi
  D: L hoặc R
  p: trạng thái kế

Cấu hình: (trạng thái, băng, đầu đọc)
Nhận: tới qA. Từ chối: tới qR
hoặc không có luật.</code></pre>
<p>Máy có thể không dừng. “Chưa dừng sau N bước” không phải bằng chứng không dừng. Nhiều băng và không đơn định không đổi lớp ngôn ngữ nhận được.</p>`
        }
      ]
    }
  ];
})();
