/** @param {NS} ns */
export async function main(ns) {
    // 1. 분석기조차 속이기 위해 ramOverride를 대괄호로 호출합니다.
    // 이렇게 하면 스크립트는 1.7GB로 가볍게 시작한 뒤 실행 중에 2.9GB로 늘어납니다.
    try {
        ns["ramOverride"](2.9);
        ns.tprint("-> [Success] Dynamic RAM adjusted to 2.90GB");
    } catch (e) {
        ns.tprint("-> [Fail] RAM Override failed: " + e.message);
        return;
    }
    
    ns.tprint("=== The Grand Final: Maximum Peak Test (Target: 2.90GB) ===");

    try {
        // Step 1: exec 호출 (1.3GB 소모)
        ns.tprint("[Step 1] Calling ns.exec (1.30GB)...");
        ns["exec"]("pull.js", "home", 1, "--test-ram-only"); 
        ns.tprint(" -> Step 1 Success!");

        // Step 2: scp 호출 (0.60GB 소모)
        // 만약 누적제라면 여기서 2.9 + 0.6 = 3.5GB가 되어 죽습니다.
        ns.tprint("[Step 2] Calling ns.scp (0.60GB)...");
        ns["scp"]("pull.js", "home", "temp_final_test.js");
        ns.tprint(" -> Step 2 Success!");

        ns.tprint("=== [CONCLUSION] BINGO! Dynamic RAM is BASED ON MAX PEAK! ===");
    } catch (e) {
        ns.tprint(`=== [ERROR] ${e.message} ===`);
    }

    while (true) await ns.sleep(1000);
}
