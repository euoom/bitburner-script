# 🤖 Bitburner Game Assistant

Bitburner는 프로그래밍 기반의 증분 게임입니다. 본 모듈은 게임 내에서 외부 Git 저장소의 스크립트를 손쉽게 동기화할 수 있는 환경을 구축합니다.

## 🚀 시작하기

### 1. GitHub 저장소 설정 (선택 사항)
본인이 작성한 Bitburner 스크립트들을 관리할 GitHub 저장소를 만듭니다. 
저장소 루트에 `manifest.json` 파일을 생성하여 다운로드할 파일 목록을 정의해야 합니다.

**manifest.json 예시:**
```json
{
  "files": [
    "hack-manager.js",
    "server-buyer.js",
    "grow.js",
    "weaken.js",
    "hack.js"
  ]
}
```

### 2. 게임 내에서 스크립트 가져오기 (Pull)
1. Bitburner 게임 내 Terminal을 엽니다.
2. `nano pull.js`를 입력합니다.
3. 이 디렉토리에 있는 `pull.js`의 내용을 복사하여 붙여넣고 저장합니다. (Ctrl+S, Ctrl+Q)
4. 다음과 같이 실행하여 모든 스크립트를 동기화합니다:
   ```bash
   run pull.js [GitHub 사용자명] [저장소명] [브랜치명]
   ```
   *(예: `run pull.js euoom my-scripts main`)*

## 📂 구성 파일

- `pull.js`: 게임 내에서 Git을 통해 스크립트를 일괄 다운로드하는 메인 스크립트.
- `manifest_updater.py`: 로컬 스크립트 목록을 스캔하여 `manifest.json`을 자동 생성하는 도구.
- `scripts/`: 실제 게임에서 사용될 `.js` 스크립트들을 모아두는 로컬 폴더.

## ⚠️ 주의 사항
- `ns.wget`은 브라우저의 CORS 정책에 영향을 받습니다. GitHub의 **Raw Content** URL을 사용해야 하므로 부트스트랩에서는 자동으로 처리합니다.
- 게임 내 저장 공간(VFS)이 부족하지 않도록 주의하세요.
