/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 2.9GB 설정 (기본 1.6 + ns.exec 1.3)
    // 누적제라면 scp(0.6)를 부르는 순간 3.5GB가 되어 죽어야 합니다.
    ns.ramOverride(2.9);
    
    ns.tprint("=== The Grand Final: Maximum Peak Test (Target: 2.90GB) ===");

    try {
        // Step 1: exec 호출 (1.3GB 소모)
        // 현재: 1.6 + 1.3 = 2.9GB (세이프)
        ns.tprint("[Step 1] Calling ns.exec (1.30GB)...");
        // 실제 실행은 안 되더라도 호출 자체가 램을 소모함
        ns["exec"]("pull.js", "home", 1, "dummy_arg"); 
        ns.tprint(" -> Step 1 Success!");

        // Step 2: scp 호출 (0.60GB 소모)
        // 누적제라면: 2.9 + 0.6 = 3.5GB (사망)
        // 최대치제라면: Max(1.3, 0.6) = 1.3이므로 여전히 2.9GB (생존)
        ns.tprint("[Step 2] Calling ns.scp (0.60GB)...");
        ns["scp"]("pull.js", "home", "temp_final_test.js");
        ns.tprint(" -> Step 2 Success!");

        ns.tprint("=== [CONCLUSION] BINGO! Dynamic RAM is BASED ON MAX PEAK, NOT TOTAL SUM! ===");
        ns.tprint("Now you can run EVERY API in one script for just (1.6 + MaxCost) GB!");
    } catch (e) {
        ns.tprint(`=== [CONCLUSION] Still Cumulative. Error: ${e.message} ===`);
    }

    while (true) await ns.sleep(1000);
}
