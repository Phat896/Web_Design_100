import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument(
    "--source",
    type=Path,
    default=ROOT / "artifacts" / "final-render",
)
parser.add_argument(
    "--output",
    type=Path,
    default=ROOT / "artifacts" / "contact-sheets",
)
args = parser.parse_args()

SOURCE = args.source.resolve()
OUTPUT = args.output.resolve()
OUTPUT.mkdir(parents=True, exist_ok=True)

pages = sorted(
    SOURCE.glob("page-*.png"),
    key=lambda path: int(path.stem.split("-")[1]),
)

columns = 4
rows = 2
thumb_width = 360
thumb_height = 510
label_height = 32
gutter = 18
sheet_size = columns * rows
font = ImageFont.load_default(size=18)

for sheet_index in range(0, len(pages), sheet_size):
    batch = pages[sheet_index : sheet_index + sheet_size]
    canvas_width = columns * thumb_width + (columns + 1) * gutter
    canvas_height = rows * (thumb_height + label_height) + (rows + 1) * gutter
    canvas = Image.new("RGB", (canvas_width, canvas_height), "#b8bdc7")
    draw = ImageDraw.Draw(canvas)

    for index, page_path in enumerate(batch):
        row, column = divmod(index, columns)
        x = gutter + column * thumb_width
        y = gutter + row * (thumb_height + label_height)

        with Image.open(page_path) as page:
            page = page.convert("RGB")
            page.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
            offset_x = x + (thumb_width - page.width) // 2
            offset_y = y + (thumb_height - page.height) // 2
            canvas.paste(page, (offset_x, offset_y))

        label = f"Trang {page_path.stem.split('-')[1]}"
        box = draw.textbbox((0, 0), label, font=font)
        text_width = box[2] - box[0]
        draw.text(
            (x + (thumb_width - text_width) // 2, y + thumb_height + 5),
            label,
            fill="#111827",
            font=font,
        )

    output_path = OUTPUT / f"contact-{sheet_index // sheet_size + 1}.png"
    canvas.save(output_path, quality=95)
    print(output_path)
