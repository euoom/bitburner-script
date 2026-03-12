/** @param {NS} ns */
export async function main(ns) {
    // 1. 모든 함수를 숨겨서 순수 1.6GB 베이스를 만듭니다.
    const overrideFn = "ramOverride";
    const sleepFn = "sleep";
    const tprintFn = "tprint";
    
    ns[overrideFn](2.5); // 임계값 2.5GB 설정
    
    ns[tprintFn]("=== RAM Accumulation Precise Test (Target: 2.50GB) ===");

    try {
        // Step 1: scp (0.6) -> 계: 2.2
        ns[tprintFn]("[Step 1] Calling scp (0.6GB)...");
        const res1 = ns["scp"]("pull.js", "home", "temp_cum_test.js");
        ns[tprintFn](` -> Step 1 Success! (Return: ${res1})`);

        // Step 2: scan (0.2) -> 계: 2.4 (누적제라면 아슬아슬하게 생존)
        ns[tprintFn]("[Step 2] Calling scan (0.2GB)...");
        const res2 = ns["scan"]("home");
        ns[tprintFn](` -> Step 2 Success! (Neighbors: ${res2.length})`);

        // Step 3: ls (0.2) -> 계: 2.6 (누적제라면 여기서 반드시 사망)
        ns[tprintFn]("[Step 3] Calling ls (0.2GB)...");
        const res3 = ns["ls"]("home");
        ns[tprintFn](` -> Step 3 Success! (Files: ${res3.length})`);

        ns[tprintFn]("=== [FINAL RESULT] RAM is NOT cumulative! Max Peak used. ===");
    } catch (e) {
        ns[tprintFn](`=== [FINAL RESULT] RAM is CUMULATIVE! Error: ${JSON.stringify(e)} ===`);
    }

    while (true) await ns[sleepFn](1000);
}
