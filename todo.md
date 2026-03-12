# Bitburner lib 구축 TODO

> 이번 탐사(RAM 우회 실험)에서 확보한 기법들을 실용적인 유틸리티 라이브러리로 정착시키는 작업 목록

---

## 📦 `euoom/lib/saveReader.js` — 0GB 게임 데이터 리더 (신규)

세이브 데이터(IndexedDB)를 통해 NS API 비용 없이 게임 상태를 읽어오는 유틸리티.

### 확인된 내부 구조
```
bitburnerSave (IndexedDB)
  └── savestring (ObjectStore)
        └── [0]: Uint8Array (gzip 압축 바이너리)
              └── gzip 해제 → JSON
                    └── { ctor, data: { PlayerSave, AllServersSave, ... } }
                          └── AllServersSave[n] = { ctor: "Server", data: {...} }
                          └── PlayerSave = { ctor: "Player", data: {...} }
```

### 구현할 메소드

- [ ] `readSaveData()` — IndexedDB에서 gzip 해제 및 전체 JSON 반환 (기본 함수)
- [ ] `getAllServers()` — 전체 72개 서버 목록 반환 (0GB)
  - 필드: `hostname, moneyAvailable, hackDifficulty, maxRam, hasAdminRights, requiredHackingSkill, minDifficulty, moneyMax`
- [ ] `getServer(hostname)` — 특정 서버 데이터 반환 (0GB, `ns.getServer()` 대체)
- [ ] `getPlayer()` — 플레이어 데이터 반환 (0GB, `ns.getPlayer()` 대체)
  - 필드: `money, skills.hacking, city`

### 주의사항
- 스크립트 시작 직후 자동저장이 트리거되므로, **1.5초 대기 후 읽기** 필요
- 동적 데이터(`moneyAvailable`, `hackDifficulty`)는 실행 중에 변하므로 스냅샷임을 인지
- 정적 데이터(`maxRam`, `requiredHackingSkill`, `minDifficulty`, `moneyMax`)는 완전 신뢰 가능

---

## 🔬 추가 탐사 가능 방향 (별도 작업)

실험 결과 추가로 가능성이 확인된 것들:

- [ ] **`webpackChunkbitburner` 탐색** — 비트버너 내부 모듈 전체 접근 가능한 입구 발견
  - `o.U` 함수(실제 RAM 계산기)를 찾아 재정의하면 런타임 RAM 체크 무력화 가능성 있음
- [ ] **`ns.valueOf()` Proxy 탈피** — 145개 키 노출 확인, naked ns 인스턴스 추가 분석 여지
- [ ] **`updateRAM` 클로저 분석** — `a.hostname`, `a.scripts` 기반 계산 흐름 확인됨

---

## 📐 `euoom/lib/analyze.js` — 분석 메소드 재정의 (수정)

기존 `euoom/analyze/` 스크립트들의 고비용 NS API 호출을 `saveReader.js` 기반으로 교체.

- [ ] `getHackableServers()` — 해킹 가능 서버 필터링 (0GB로 대체)
- [ ] `getBestTarget()` — 최고 수익 서버 선별 (money/sec 계산, 0GB)
- [ ] `getServerMeta(hostname)` — 단일 서버 정적 메타 조회 (0GB)
