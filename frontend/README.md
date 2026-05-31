# Tài liệu hướng dẫn dự án: Solar System Explorer

Chào mừng đến với **Solar System Explorer** — Một ứng dụng web tương tác trực quan mang phong cách điện ảnh (Cinematic Sci-fi) dùng để khám phá Hệ Mặt Trời. 

Dự án không chỉ là một mô hình quỹ đạo 3D cơ bản, mà còn kết hợp các yếu tố tâm lý học: gán mỗi hành tinh với một trạng thái cảm xúc (ví dụ: Sao Hỏa = Tức giận, Trái Đất = Bình an, Mộc Tinh = Tự tin) thông qua giao diện người dùng sống động (UI/UX).

---

## 🌟 Các Tính Năng Nổi Bật

- **Mô phỏng 3D thời gian thực (Interactive Orrery)**: Trải nghiệm không gian mượt mà (60fps) vẽ bằng HTML5 Canvas nguyên bản, kết hợp vành đai tiểu hành tinh, sao băng và hiệu ứng chuyển động Parallax đa lớp.
- **Thiết kế UI Cao Cấp (Glassmorphism 2.0)**: Bảng điều khiển được thiết kế theo xu hướng phi thuyền tương lai với hiệu ứng viền phát sáng, nhiễu hạt kính (noise overlay) và bóng đổ đa tầng (multi-layered shadows).
- **Hệ thống Hành Tinh Cảm Xúc (Emotional Planets)**: Mỗi hành tinh sở hữu một trang chi tiết (Detail Page) với bảng màu gradient, hiệu ứng hạt không gian và hoạt ảnh chữ độc quyền.
- **Hướng dẫn thở năng lượng (Breathing Halo)**: Module giúp thư giãn, đập nhịp nhàng kết hợp hào quang phát sáng để điều hòa cảm xúc.
- **Terminal chia sẻ cảm xúc (AI Input)**: Giao diện nhập liệu giả lập console tương lai để người dùng "giao tiếp" và chia sẻ cảm xúc cá nhân.

---

## 📂 Cấu Trúc Thư Mục

Dự án sử dụng cấu trúc module tách biệt để dễ bảo trì:

```text
Project_Web_BWM/
│
├── html/                      # Thư mục chứa toàn bộ giao diện
│   ├── index.html             # Trang chủ (Mô phỏng Hệ mặt trời)
│   ├── earth.html             # Trang chi tiết Trái Đất
│   ├── mars.html              # Trang chi tiết Sao Hỏa
│   ├── jupiter.html           # Trang chi tiết Sao Mộc
│   └── ... (các hành tinh khác)
│
├── css/                       # Thư mục chứa stylesheet
│   ├── style.css              # Style cho trang chủ
│   ├── planet-page.css        # Style giao diện Sci-Fi cho trang chi tiết
│   └── planets-enhanced.css   # Style phụ trợ cho các component
│
├── js/                        # Thư mục chứa logic xử lý
│   ├── app.js                 # Core engine xử lý Canvas render (Animation loop)
│   ├── planet-page.js         # Logic tương tác (Tab, Breathing, AI) cho trang chi tiết
│   └── planets-enhanced.js    # Quản lý sự kiện nâng cao
│
├── planets/                   # Thư mục chứa tài nguyên hình ảnh (Textures)
│   ├── earth.jpg
│   ├── mars.png
│   └── ...
│
└── README.md                  # Tài liệu hướng dẫn này
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

Dự án được xây dựng hoàn toàn bằng **Vanilla JavaScript, HTML5 và CSS3** mà không phụ thuộc vào bất kỳ framework hoặc thư viện bên thứ 3 nào. 

Tuy nhiên, do yêu cầu của trình duyệt về vấn đề bảo mật CORS khi load hình ảnh Texture vào Canvas (`app.js`), **bạn KHÔNG THỂ mở trực tiếp file `index.html` bằng cách nhấp đúp chuột.**

### Các bước chạy:

1. **Cài đặt tiện ích Live Server**: 
   - Nếu bạn dùng Visual Studio Code (VS Code), hãy cài extension có tên **Live Server** (bởi Ritwick Dey).
2. **Khởi chạy**: 
   - Mở thư mục dự án `Project_Web_BWM` trong VS Code.
   - Nhấp chuột phải vào file `html/index.html` và chọn **"Open with Live Server"** (Hoặc bấm nút `Go Live` ở góc phải bên dưới thanh trạng thái).
3. **Thưởng thức**: 
   - Ứng dụng sẽ tự động mở trên trình duyệt (thường ở địa chỉ `http://127.0.0.1:5500/html/index.html`). 
   - Bấm vào một hành tinh và nhấn nút **"Khám phá"** để chuyển sang trang chi tiết với hiệu ứng ấn tượng!

---

## 🎨 Ghi Chú Dành Cho Nhà Phát Triển (Developer Notes)

- **Đồ họa Canvas**: Vui lòng **KHÔNG can thiệp** vào hàm `init()` hoặc vòng lặp `requestAnimationFrame` bên trong `app.js` nếu chưa hiểu rõ logic camera/hit-testing, để tránh làm hỏng mô phỏng vật lý.
- **Đường dẫn Relative Paths**: Vì các file html nằm trong thư mục `html/`, mọi tài nguyên nạp vào phải dùng đường dẫn tương đối trỏ ra ngoài như `../css/` hoặc `../planets/`. Đừng sửa thành đường dẫn tuyệt đối tĩnh.
- **Tùy chỉnh màu sắc**: Bạn có thể tinh chỉnh màu chủ đạo của một hành tinh bằng cách sửa biến `--acc` (màu Hex) và `--acc-rgb` (màu RGB) bên trong `planet-page.css` ở khu vực `:root` tương ứng với mỗi thuộc tính `data-planet`.

---
*Phát triển với ❤️ cho vũ trụ và tâm trí con người.*
