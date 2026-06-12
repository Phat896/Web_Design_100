import importlib.util
import os
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEMP_DIR = ROOT / "artifacts" / "tmp"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

os.environ["TEMP"] = str(TEMP_DIR)
os.environ["TMP"] = str(TEMP_DIR)
os.environ["TMPDIR"] = str(TEMP_DIR)
tempfile.tempdir = str(TEMP_DIR)

renderer_candidates = sorted(
    Path("C:/Users/admin!/.codex/plugins/cache/openai-primary-runtime/documents").glob(
        "*/skills/documents/render_docx.py"
    )
)
if not renderer_candidates:
    raise FileNotFoundError("Không tìm thấy render_docx.py trong Documents plugin.")
RENDERER = renderer_candidates[-1]

spec = importlib.util.spec_from_file_location("codex_render_docx", RENDERER)
if spec is None or spec.loader is None:
    raise ImportError(f"Không thể nạp trình render: {RENDERER}")
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)

original_run_cmd = renderer._run_cmd


def run_cmd_with_windows_profile_uri(cmd, env, verbose):
    fixed_cmd = []
    prefix = "-env:UserInstallation=file://"
    for arg in cmd:
        if os.name == "nt" and arg.startswith(prefix):
            raw_path = arg[len(prefix) :]
            arg = "-env:UserInstallation=" + Path(raw_path).resolve().as_uri()
        fixed_cmd.append(arg)
    return original_run_cmd(fixed_cmd, env=env, verbose=verbose)


renderer._run_cmd = run_cmd_with_windows_profile_uri
sys.argv[0] = str(RENDERER)
renderer.main()
