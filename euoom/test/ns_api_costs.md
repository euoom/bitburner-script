# Bitburner NS API RAM Cost Reference

이 문서는 `ram_lab.js`와 `ls_ns.js`를 통해 실측한 Bitburner NS API의 메소드별 정적 RAM 소모량 및 동적 우회(Bypass) 가능 여부를 기록합니다.

## 1. 0GB RAM 소모 API (우회 필요 없음)
공식적으로 0GB를 소모하며, 동적 호출 시에도 추가 비용이 발생하지 않는 항목들입니다.

| API 메소드 | RAM Cost (GB) | 비고 |
| :--- | :--- | :--- |
| `ns.alert` | 0 | 사용자 알림 창 |
| `ns.asleep` | 0 | 비동기 대기 |
| `ns.atExit` | 0 | 스크립트 종료 콜백 |
| `ns.clearLog` | 0 | |
| `ns.disableLog` | 0 | |
| `ns.enableLog` | 0 | |
| `ns.exit` | 0 | |
| `ns.flags` | 0 | 명령줄 인자 파싱 |
| `ns.formatNumber` | 0 | |
| `ns.formatRam` | 0 | |
| `ns.getPortHandle` | 0 | 포트 데이터 직접 접근 |
| `ns.getScriptName` | 0 | |
| `ns.getScriptLogs` | 0 | |
| `ns.print` / `ns.tprint` | 0 | |
| `ns.read` | 0 | 파일 읽기 |
| `ns.renamePurchasedServer` | 0 | |
| `ns.sleep` | 0 | |
| `ns.wget` | 0 | 인터넷 파일 다운로드 |

## 2. 주요 Hacking & Stats API (0.05GB ~ 1.3GB)
실질적인 비용이 발생하며, 1.6GB Override 우회 테스트의 핵심 대상들입니다.

| API 메소드 | RAM Cost (GB) | 우회(Bypass) 여부 |
| :--- | : :--- | :--- |
| `ns.hack` / `ns.grow` | 0.1 ~ 0.17 | ✅ LIVE |
| `ns.weaken` | 0.175 | ✅ LIVE |
| `ns.scan` | 0.2 | ✅ LIVE |
| `ns.exec` | 1.3 | ✅ LIVE |
| `ns.hackAnalyze` | 1.0 | ✅ LIVE |
| `ns.getServerMaxRam` | 0.1 | ✅ LIVE |
| `ns.getServerMoneyAvailable` | 0.1 | ✅ LIVE |

## 3. 고비용 네임스페이스 (4.0GB ~ Infinity)
객체 접근만으로도 엄청난 비용을 요구하는 특수 API들입니다.

| API 네임스페이스 | RAM Cost (GB) | 우회(Bypass) 여부 | 비고 |
| :--- | :--- | :--- | :--- |
| `ns.hacknet` | 4.0 | ✅ LIVE | 인스턴스 접근 비용 4GB, 내부 메소드는 0GB |
| `ns.singularity` | 4.0 | ✅ LIVE | |
| `ns.formulas` | 5.0 | ✅ LIVE | 내부 함수(`hackChance` 등) 호출 시에도 우회 확인됨 |
| `ns.stock` | 2.0 | ✅ LIVE | |
| `ns.corporation` | Infinity | ✅ LIVE | 접근에 엄청난 비용(또는 특정 조건) 필요 |

---
**최종 업데이트**: 2026-03-13
**Conclusion**: `ns["method"]` 방식과 `ramOverride(1.6)`를 조합하면 사실상 모든 API의 정적 램 비용을 무시하고 실행 가능함이 확인됨.
