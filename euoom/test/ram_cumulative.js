/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량을 2.20GB로 잡습니다. (기본 1.6 + scp 0.6)
    // 만약 누적제라면, scp 실행 후 다른 함수를 부르는 순간 2.20을 초과하여 죽을 것입니다.
    ns.ramOverride(2.2);
    
    ns.tprint("=== RAM Accumulation Test (Target: 2.20GB) ===");

    try {
        // Step 1: scp 호출 (0.6GB 소모)
        // 현재 상태: 1.6 + 0.6 = 2.2GB (세이프)
        ns.tprint("[Step 1] Calling scp (0.6GB)...");
        ns["scp"]("pull.js", "home", "temp_cum_1.js");
        ns.tprint(" -> Step 1 Success!");

        // Step 2: scan 호출 (0.2GB 소모)
        // 누적제일 경우: 2.2 + 0.2 = 2.4GB (사망 예상)
        // 최대치제일 경우: Max(0.6, 0.2) = 0.6이므로 2.2GB (생존 예상)
        ns.tprint("[Step 2] Calling scan (0.2GB)...");
        const neighbors = ns["scan"]("home");
        ns.tprint(` -> Step 2 Success! Neighbors: ${neighbors.length}`);

        // Step 3: ls 호출 (0.2GB 소모)
        // 누적제일 경우: 2.4 + 0.2 = 2.6GB (확실한 사망)
        ns.tprint("[Step 3] Calling ls (0.2GB)...");
        ns["ls"]("home");
        ns.tprint(" -> Step 3 Success!");

        ns.tprint("=== RESULT: RAM is NOT cumulative! (Max Peak System) ===");
    } catch (e) {
        ns.tprint(`=== RESULT: RAM is CUMULATIVE! Death at: ${e.message} ===`);
    }

    while (true) await ns.sleep(1000);
}
