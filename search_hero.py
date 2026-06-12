import os

js_dir = r"E:\Project_Web_BWD\frontend\js"
css_dir = r"E:\Project_Web_BWD\frontend\css"
html_dir = r"E:\Project_Web_BWD\frontend\html"

print("=== SEARCH FOR HERO-BG ===")
for root, dirs, files in os.walk(r"E:\Project_Web_BWD\frontend"):
    for file in files:
        if file.endswith((".js", ".css", ".html")):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if "hero-bg" in content:
                    print(f"Found in {file} (path: {path})")
