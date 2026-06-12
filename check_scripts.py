import re

files = ["frontend/js/app.js", "frontend/js/planets-enhanced.js", "frontend/js/planet-page.js"]
for filepath in files:
    print(f"=== {filepath} ===")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        # Find any references to location.href or .html
        matches = re.finditer(r'(location\.href\s*=|window\.location\s*=|href\s*=|href\s*:|\.html)', content)
        lines = content.split("\n")
        for match in matches:
            # find line number
            char_idx = match.start()
            line_no = content[:char_idx].count("\n") + 1
            print(f"Line {line_no}: {lines[line_no-1].strip()}")
