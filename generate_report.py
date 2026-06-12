import re

files = ["frontend/js/app.js", "frontend/js/planets-enhanced.js", "frontend/js/planet-page.js"]
output_lines = []

for filepath in files:
    output_lines.append(f"=== {filepath} ===")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        # Find any references to location.href, window.location, href, or .html
        matches = re.finditer(r'(location\.href\s*=|window\.location\s*=|href\s*=|href\s*:|\.html)', content)
        lines = content.split("\n")
        for match in matches:
            char_idx = match.start()
            line_no = content[:char_idx].count("\n") + 1
            output_lines.append(f"Line {line_no}: {lines[line_no-1].strip()}")

with open("image_report.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))

print("Search completed successfully.")
