import os
import json
from pathlib import Path

def generate_manifest(script_dir="scripts", output_file="manifest.json"):
    """
    scripts 디렉토리 내의 .js 파일들을 찾아 manifest.json을 생성합니다.
    """
    p = Path(script_dir)
    if not p.exists():
        print(f"Error: Directory '{script_dir}' not found.")
        return

    scripts = [f.name for f in p.glob("*.js")]
    manifest = {"files": scripts}

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=4)
    
    print(f"✅ Generated {output_file} with {len(scripts)} scripts.")

if __name__ == "__main__":
    # 기본적으로 Bitburner 루트에서 실행된다고 가정
    script_path = Path(__file__).parent / "scripts"
    if not script_path.exists():
        script_path.mkdir(exist_ok=True)
        # 기본 템플릿 파일 생성
        (script_path / "template.js").write_text("/** @param {NS} ns */\nexport async function main(ns) {\n    ns.tprint('Hello from Bitburner Assistant!');\n}")
        print("📁 Created scripts directory and template.js")

    generate_manifest(script_path, Path(__file__).parent / "manifest.json")
