# Bitburner RAM 우회 탐사 — 결론 및 정리

> 작성일: 2026-03-13  
> 위치: `/mnt/e/workspace/game-assistant/Bitburner/`

---

## 🛑 탐사 요약: "Action 함수(hack 등)의 0GB 우회는 현재로선 거의 불가능하다"

Bitburner v2.8.1 (Webpack 5 적용 버전) 기준으로, 우리가 엔진 깊숙히 찔러본 결과 엔진 측의 런타임 방어와 상태 은닉이 매우 견고해졌음을 확인했습니다.

### 우리가 발견한 엔진의 방어 기제
1. **ESM Module Getter 록업(Lock-up)**
   - `o.U` 같은 RAM 계산기 함수를 식별(ID `31227` 등)하는 것까진 성공했습니다.
   - 하지만 Webpack이 모든 모듈 export를 `Object.defineProperty(exports, "e", {get: () => e})` 형태로 감쌌고, 이를 우회해서 임의의 함수(예: 무조건 0기가를 리턴하는 가짜함수)로 덮어쓰려 하자 **`Cannot set property... has only a getter`** 혹은 **`Cannot redefine property`** 에러를 뿜으며 자바스크립트 엔진 단에서 거부했습니다.

2. **Strict Execution Context (this) & Proxy Binding**
   - 궁극적 목적인 `ns.hack()` 의 0GB 우회를 위해 `ns.valueOf().hack` 등 프록시 껍데기를 벗겨내 순수 함수를 꺼냈습니다.
   - 이 함수를 호출(`apply(ns)` 등)했으나, **`undefined`**가 떨어지거나 스크립트가 정지했습니다.
   - 원인은 함수 내부에서 `r._$.checkEnvFlags(o)` 처럼 실행 컨텍스트에 묶인 전용 식별자(`o`, 즉 WorkerScript)와 동적 램 업데이트(`updateDynamicRam`)가 강하게 결합되어 있어, 컨텍스트가 조금이라도 틀어지면 실행 자체를 드랍시키기 때문입니다.

3. **Global Space & Event Loop 은닉 최적화**
   - 과거 버전들처럼 전역 메모리(`g.Player` 등)에 게임 상태를 노출시키지 않습니다.
   - React Fiber의 State(`memoizedState`)나 클로저 깊숙한 곳에서 관리되며, 심지어 `setTimeout` 같은 타이머 루프조차도 평범하게 후킹되지 않았습니다.

---

## ✅ 그렇다면 우리는 무엇을 얻었는가? (절반의 대성공)

엔진 객체 조작(Monkey Patch)이나 행동 함수(`hack`)의 0GB 실행은 막혔지만, **데이터 조회(Read) API 들은 완벽하게 0GB로 가져오는 "뒷문"을 확보했습니다.**

### 🏆 `saveReader.js` (IndexedDB 직접 파싱 기법)
`ns.getServer()`, `ns.getPlayer()` 같은 고비용 API(보통 1~2GB 소모)를 사용할 필요가 없어졌습니다. 
게임이 자동 저장하는 IndexedDB의 데이터를 실시간으로 가로채서 메모리 비용 **0GB**로 현재 게임의 전체 상태(모든 서버 72개의 자금/해킹난이도, 플레이어 스킬 등)를 읽어옵니다.

- **장점**: UI 업데이트 용도나 서버 트리를 구축할 때 수십 기가의 RAM을 아낄 수 있습니다.
- **활용**: 정보 분석용 마스터 스크립트는 이제 `1.6GB (base)` 만으로 존재하며, 맵 전체의 흐름을 통제할 수 있습니다.

---

## 🚀 다음 단계 (Action Items)

이제 탐사(Sandbox) 단계를 성공적으로 마무리하고, **실전 배치** 단계로 넘어가야 합니다.

1. **`lib/saveReader.js` 활용**: 이전 세션들에서 만들었던 분석 스크립트(`analyze/`)들의 API 호출을 이 0GB 리더기로 교체하여 RAM 다이어트 진행.
2. **해킹 컨트롤러 설계**: 정보 조회는 0GB로 하되, 실제 해킹 명령(`hack()`, `grow()`, `weaken()`)은 최소한의 기능만 담은 1.7GB 짜리 슬레이브(Slave) 스크립트를 서버들에 배치하여 파이프라인(Master-Slave) 구조 구축.

이 문서는 지식 베이스(또는 `continue.md`)에 합쳐질 것입니다. 
