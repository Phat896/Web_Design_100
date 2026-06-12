from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "report-assets"
OUT.mkdir(parents=True, exist_ok=True)

BG = "#F7FAFC"
NAVY = "#12355B"
BLUE = "#1D6FA5"
CYAN = "#2AA7C9"
TEAL = "#16817A"
ORANGE = "#E28A36"
RED = "#C94C4C"
PURPLE = "#6C5AA7"
GREEN = "#3B8C62"
TEXT = "#17212B"
MUTED = "#5A6773"
LINE = "#A9BAC8"
WHITE = "#FFFFFF"


def font(size, bold=False):
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


F_TITLE = font(42, True)
F_SUBTITLE = font(26, True)
F_BODY = font(22)
F_BODY_B = font(22, True)
F_SMALL = font(18)
F_SMALL_B = font(18, True)


def canvas(title, subtitle=None, size=(1800, 1100)):
    image = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, size[0], 108), fill=NAVY)
    draw.text((58, 26), title, font=F_TITLE, fill=WHITE)
    if subtitle:
        draw.text((60, 126), subtitle, font=F_SMALL, fill=MUTED)
    return image, draw


def rounded_box(draw, xy, title, lines=None, fill=WHITE, outline=BLUE, title_fill=None):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=20, fill=fill, outline=outline, width=4)
    if title_fill:
        draw.rounded_rectangle((x1, y1, x2, y1 + 58), radius=18, fill=title_fill)
        draw.rectangle((x1, y1 + 38, x2, y1 + 58), fill=title_fill)
        draw.text((x1 + 22, y1 + 15), title, font=F_BODY_B, fill=WHITE)
        text_y = y1 + 78
    else:
        draw.text((x1 + 22, y1 + 18), title, font=F_BODY_B, fill=TEXT)
        text_y = y1 + 60
    if lines:
        for line in lines:
            draw.text((x1 + 24, text_y), f"• {line}", font=F_SMALL, fill=TEXT)
            text_y += 35


def centered_text(draw, xy, text, text_font=F_BODY_B, fill=TEXT):
    x1, y1, x2, y2 = xy
    bbox = draw.multiline_textbbox((0, 0), text, font=text_font, align="center", spacing=8)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    draw.multiline_text(
        ((x1 + x2 - width) / 2, (y1 + y2 - height) / 2),
        text,
        font=text_font,
        fill=fill,
        align="center",
        spacing=8,
    )


def arrow(draw, start, end, fill=BLUE, width=5, label=None):
    draw.line((start, end), fill=fill, width=width)
    x1, y1 = start
    x2, y2 = end
    dx, dy = x2 - x1, y2 - y1
    length = max((dx * dx + dy * dy) ** 0.5, 1)
    ux, uy = dx / length, dy / length
    px, py = -uy, ux
    tip = (x2, y2)
    left = (x2 - ux * 22 + px * 10, y2 - uy * 22 + py * 10)
    right = (x2 - ux * 22 - px * 10, y2 - uy * 22 - py * 10)
    draw.polygon((tip, left, right), fill=fill)
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        bbox = draw.textbbox((0, 0), label, font=F_SMALL)
        pad = 8
        draw.rounded_rectangle(
            (mx - (bbox[2] - bbox[0]) / 2 - pad, my - 26,
             mx + (bbox[2] - bbox[0]) / 2 + pad, my + 8),
            radius=8,
            fill=BG,
        )
        draw.text((mx - (bbox[2] - bbox[0]) / 2, my - 21), label, font=F_SMALL, fill=MUTED)


def save(image, name):
    path = OUT / name
    image.save(path, "PNG", optimize=True)
    return path


def create_use_case():
    image, draw = canvas(
        "BIỂU ĐỒ USE CASE TỔNG QUÁT",
        "Các tác nhân và chức năng được xác định từ giao diện, route và model của StellarMind",
    )
    system = (420, 180, 1390, 1030)
    draw.rounded_rectangle(system, radius=28, fill="#EDF5FA", outline=NAVY, width=5)
    draw.text((460, 198), "HỆ THỐNG STELLARMIND", font=F_SUBTITLE, fill=NAVY)

    actor_boxes = [
        ((65, 300, 340, 450), "Khách truy cập", CYAN),
        ((65, 650, 340, 800), "Người dùng\nđã đăng nhập", ORANGE),
        ((1460, 470, 1730, 620), "Gemini API", PURPLE),
    ]
    for xy, label, color in actor_boxes:
        draw.rounded_rectangle(xy, radius=25, fill=WHITE, outline=color, width=5)
        centered_text(draw, xy, label, F_BODY_B, color)

    use_cases = [
        ((490, 280, 830, 380), "Khám phá Hệ Mặt Trời", BLUE),
        ((945, 280, 1300, 380), "Xem trang hành tinh", TEAL),
        ((490, 430, 830, 530), "Thực hành bài tập thở", GREEN),
        ((945, 430, 1300, 530), "Nghe âm thanh / tương tác", CYAN),
        ((490, 580, 830, 680), "Đăng ký / đăng nhập", ORANGE),
        ((945, 580, 1300, 680), "Đăng bài chia sẻ", RED),
        ((490, 730, 830, 830), "Trả lời và lọc bài viết", PURPLE),
        ((945, 730, 1300, 830), "Trò chuyện với chatbot", BLUE),
        ((720, 880, 1070, 980), "Gửi biểu mẫu liên hệ", TEAL),
    ]
    for xy, label, color in use_cases:
        draw.rounded_rectangle(xy, radius=50, fill=WHITE, outline=color, width=4)
        centered_text(draw, xy, label, F_SMALL_B, TEXT)

    guest = (340, 375)
    member = (340, 725)
    gemini = (1460, 545)
    for target in [(490, 330), (945, 330), (490, 480), (945, 480), (490, 630), (945, 780), (720, 930)]:
        arrow(draw, guest, target, fill=LINE, width=3)
    for target in [(490, 630), (945, 630), (490, 780), (945, 780)]:
        arrow(draw, member, target, fill=ORANGE, width=4)
    arrow(draw, gemini, (1300, 780), fill=PURPLE, width=4, label="GenerateContent")
    return save(image, "07-use-case.png")


def create_architecture():
    image, draw = canvas(
        "KIẾN TRÚC TỔNG THỂ HỆ THỐNG",
        "Kiến trúc web tách frontend tĩnh và backend REST API",
    )
    rounded_box(
        draw, (80, 260, 410, 830), "TRÌNH DUYỆT",
        ["HTML5 / CSS3", "Vanilla JavaScript", "Canvas API", "GSAP / ScrollTrigger", "LocalStorage"],
        fill=WHITE, outline=CYAN, title_fill=CYAN,
    )
    rounded_box(
        draw, (550, 220, 960, 870), "FRONTEND STELLARMIND",
        ["Trang chủ mô phỏng", "8 trang hành tinh", "Trang cộng đồng", "Chatbot dạng cửa sổ", "Trang liên hệ", "Cấu hình Vercel"],
        fill=WHITE, outline=BLUE, title_fill=BLUE,
    )
    rounded_box(
        draw, (1100, 240, 1450, 850), "BACKEND EXPRESS",
        ["Route /api/auth", "Route /api/comments", "Route /api/chat", "JWT và bcryptjs", "Mongoose models", "CORS + JSON middleware"],
        fill=WHITE, outline=ORANGE, title_fill=ORANGE,
    )
    rounded_box(
        draw, (1530, 210, 1740, 500), "MONGODB",
        ["User", "Comment", "Reply lồng"],
        fill=WHITE, outline=GREEN, title_fill=GREEN,
    )
    rounded_box(
        draw, (1530, 620, 1740, 910), "GEMINI API",
        ["Prompt hệ thống", "Sinh phản hồi", "Fallback khi thiếu khóa"],
        fill=WHITE, outline=PURPLE, title_fill=PURPLE,
    )
    arrow(draw, (410, 520), (550, 520), label="Tương tác UI")
    arrow(draw, (960, 465), (1100, 465), label="HTTP/JSON")
    arrow(draw, (1450, 380), (1530, 380), fill=GREEN, label="Mongoose")
    arrow(draw, (1450, 735), (1530, 735), fill=PURPLE, label="HTTPS")
    arrow(draw, (1100, 700), (960, 700), fill=ORANGE, label="JSON response")
    draw.text((94, 940), "Triển khai dự kiến:", font=F_BODY_B, fill=NAVY)
    draw.text(
        (300, 940),
        "Frontend trên Vercel; backend trên Render hoặc nền tảng Node.js tương đương.",
        font=F_BODY,
        fill=TEXT,
    )
    return save(image, "08-kien-truc.png")


def create_data_model():
    image, draw = canvas(
        "MÔ HÌNH DỮ LIỆU MONGODB",
        "Reply được nhúng trong Comment; Comment có thể tham chiếu User qua authorId",
    )
    rounded_box(
        draw, (130, 230, 650, 890), "USER",
        [
            "_id: ObjectId",
            "username: String, unique",
            "password: String (bcrypt hash)",
            "createdAt: Date",
        ],
        fill=WHITE, outline=BLUE, title_fill=BLUE,
    )
    rounded_box(
        draw, (760, 170, 1340, 900), "COMMENT",
        [
            "_id: ObjectId",
            "author: String",
            "authorId: ObjectId → User",
            "avatar: String",
            "text: String",
            "isAnon: Boolean",
            "planet: String | null",
            "signalLevel: Number 1..5",
            "timestamp: Date",
            "replies: Reply[]",
        ],
        fill=WHITE, outline=ORANGE, title_fill=ORANGE,
    )
    rounded_box(
        draw, (1450, 260, 1740, 860), "REPLY (NHÚNG)",
        [
            "author: String",
            "authorId: ObjectId",
            "avatar: String",
            "text: String",
            "timestamp: Date",
        ],
        fill=WHITE, outline=GREEN, title_fill=GREEN,
    )
    arrow(draw, (650, 500), (760, 500), fill=BLUE, label="0..n bình luận")
    arrow(draw, (1340, 550), (1450, 550), fill=GREEN, label="1..n phản hồi")
    draw.text((146, 965), "Quan hệ mềm:", font=F_BODY_B, fill=NAVY)
    draw.text(
        (315, 965),
        "authorId không bắt buộc để hỗ trợ bài đăng ẩn danh hoặc tên tùy chọn.",
        font=F_BODY,
        fill=TEXT,
    )
    return save(image, "09-mo-hinh-du-lieu.png")


def sequence_diagram(title, participants, messages, filename, note):
    image, draw = canvas(title, note, size=(1800, 1200))
    left = 160
    right = 1640
    y_header = 180
    y_start = 285
    y_end = 1090
    step = (right - left) / max(len(participants) - 1, 1)
    xs = [left + i * step for i in range(len(participants))]
    colors = [CYAN, BLUE, ORANGE, GREEN, PURPLE]
    for i, (x, label) in enumerate(zip(xs, participants)):
        box = (x - 120, y_header, x + 120, y_header + 72)
        draw.rounded_rectangle(box, radius=14, fill=WHITE, outline=colors[i % len(colors)], width=4)
        centered_text(draw, box, label, F_SMALL_B, colors[i % len(colors)])
        draw.line((x, y_header + 72, x, y_end), fill=LINE, width=3)

    current_y = y_start
    for source_idx, target_idx, label, response in messages:
        color = BLUE if not response else TEAL
        start = (xs[source_idx], current_y)
        end = (xs[target_idx], current_y)
        if response:
            dash = 14
            x1, x2 = sorted([start[0], end[0]])
            x = x1
            while x < x2:
                draw.line((x, current_y, min(x + dash, x2), current_y), fill=color, width=3)
                x += dash * 2
            arrow(draw, (end[0] - (8 if end[0] > start[0] else -8), current_y), end, fill=color, width=3)
        else:
            arrow(draw, start, end, fill=color, width=4)
        wrapped = "\n".join(wrap(label, width=32))
        bbox = draw.multiline_textbbox((0, 0), wrapped, font=F_SMALL, spacing=4, align="center")
        tw = bbox[2] - bbox[0]
        tx = (start[0] + end[0]) / 2 - tw / 2
        draw.multiline_text((tx, current_y - 54), wrapped, font=F_SMALL, fill=TEXT, align="center", spacing=4)
        current_y += 118

    return save(image, filename)


def create_sequences():
    sequence_diagram(
        "BIỂU ĐỒ TUẦN TỰ: ĐĂNG KÝ VÀ ĐĂNG NHẬP",
        ["Người dùng", "Community UI", "Express Auth", "MongoDB"],
        [
            (0, 1, "Nhập username và password", False),
            (1, 2, "POST /api/auth/register hoặc /login", False),
            (2, 3, "Tìm User / tạo User", False),
            (3, 2, "Trả kết quả truy vấn", True),
            (2, 2, "bcrypt hash/compare và tạo JWT", False),
            (2, 1, "JSON: success, username, token", True),
            (1, 0, "Lưu token vào LocalStorage và cập nhật UI", True),
        ],
        "10-tuan-tu-xac-thuc.png",
        "Hai luồng dùng chung route auth; mật khẩu được xử lý bởi bcryptjs và token có hạn 30 ngày.",
    )
    sequence_diagram(
        "BIỂU ĐỒ TUẦN TỰ: ĐĂNG BÀI VÀ TRẢ LỜI",
        ["Người dùng", "Community UI", "Comments API", "MongoDB"],
        [
            (0, 1, "Nhập nội dung, chọn công khai hoặc ẩn danh", False),
            (1, 2, "POST /api/comments + Bearer token", False),
            (2, 2, "Kiểm tra token tùy chọn và chuẩn hóa tác giả", False),
            (2, 3, "Tạo Comment", False),
            (3, 2, "Comment đã lưu", True),
            (2, 1, "JSON dữ liệu bài viết", True),
            (1, 2, "POST /api/comments/:id/reply", False),
            (2, 3, "Thêm Reply vào mảng replies", False),
        ],
        "11-tuan-tu-cong-dong.png",
        "Reply là subdocument của Comment; giao diện tải lại feed sau khi thao tác thành công.",
    )
    sequence_diagram(
        "BIỂU ĐỒ TUẦN TỰ: CHATBOT GEMINI",
        ["Người dùng", "Chatbot UI", "Express Chat", "Gemini API"],
        [
            (0, 1, "Nhập câu hỏi hoặc chọn gợi ý", False),
            (1, 2, "POST /api/chat { message }", False),
            (2, 2, "Ghép system prompt và kiểm tra GEMINI_API_KEY", False),
            (2, 3, "generateContent theo danh sách model dự phòng", False),
            (3, 2, "candidate.content.parts[0].text", True),
            (2, 1, "JSON { success, reply }", True),
            (1, 0, "Hiển thị phản hồi trong cửa sổ chat", True),
        ],
        "12-tuan-tu-chatbot.png",
        "Khi thiếu khóa API, backend trả phản hồi hướng dẫn cục bộ thay vì gọi dịch vụ bên ngoài.",
    )


def create_folder_structure():
    image, draw = canvas(
        "CẤU TRÚC THƯ MỤC DỰ ÁN",
        "Các nhánh chính phục vụ frontend, backend và tài nguyên giao diện",
    )
    tree_lines = [
        ("Project_Web_BWD/", 0, NAVY, True),
        ("frontend/", 1, BLUE, True),
        ("html/ – trang chủ, 8 trang hành tinh, cộng đồng, liên hệ", 2, TEXT, False),
        ("css/ – style, planet-page, community, chatbot, components", 2, TEXT, False),
        ("js/ – app, planet-page, community, chatbot, animations", 2, TEXT, False),
        ("assets/images/planets/ – hình minh họa theo hành tinh", 2, TEXT, False),
        ("planets/ – ảnh texture hành tinh", 2, TEXT, False),
        ("vercel.json – điều hướng triển khai frontend", 2, TEXT, False),
        ("backend/", 1, ORANGE, True),
        ("server.js – khởi tạo Express và khai báo route", 2, TEXT, False),
        ("config/db.js – kết nối MongoDB", 2, TEXT, False),
        ("models/User.js, Comment.js", 2, TEXT, False),
        ("routes/auth.js, comments.js, chat.js", 2, TEXT, False),
        ("package.json – dependencies và script start/dev", 2, TEXT, False),
        ("Tài liệu và công cụ hỗ trợ", 1, TEAL, True),
        ("README.md, DESIGN_SYSTEM.md, IMPLEMENTATION_SUMMARY.md", 2, TEXT, False),
    ]
    y = 185
    for text, level, color, bold in tree_lines:
        x = 120 + level * 90
        if level:
            draw.line((x - 48, y + 17, x - 15, y + 17), fill=LINE, width=3)
            draw.line((x - 48, y - 18, x - 48, y + 17), fill=LINE, width=3)
        marker_color = color if bold else LINE
        draw.rounded_rectangle((x, y, x + 26, y + 26), radius=6, fill=marker_color)
        draw.text((x + 45, y - 2), text, font=F_BODY_B if bold else F_BODY, fill=color)
        y += 52
    draw.rounded_rectangle((1090, 230, 1690, 850), radius=28, fill=WHITE, outline=CYAN, width=4)
    draw.text((1130, 270), "Nguyên tắc phân tách", font=F_SUBTITLE, fill=NAVY)
    notes = [
        "Frontend không dùng framework SPA.",
        "Backend chỉ cung cấp API và không render HTML.",
        "Dữ liệu cảm xúc tập trung trong JavaScript.",
        "Ảnh và style được tổ chức theo chức năng.",
        "Hiện tồn tại một số bản sao file trong frontend/html/js cần đồng bộ.",
    ]
    ny = 350
    for note in notes:
        draw.ellipse((1135, ny + 7, 1151, ny + 23), fill=CYAN)
        wrapped = "\n".join(wrap(note, width=42))
        draw.multiline_text((1170, ny), wrapped, font=F_BODY, fill=TEXT, spacing=5)
        ny += 86
    return save(image, "13-cau-truc-thu-muc.png")


def main():
    paths = [
        create_use_case(),
        create_architecture(),
        create_data_model(),
        create_folder_structure(),
    ]
    create_sequences()
    paths.extend(
        [
            OUT / "10-tuan-tu-xac-thuc.png",
            OUT / "11-tuan-tu-cong-dong.png",
            OUT / "12-tuan-tu-chatbot.png",
        ]
    )
    for path in paths:
        print(path)


if __name__ == "__main__":
    main()
