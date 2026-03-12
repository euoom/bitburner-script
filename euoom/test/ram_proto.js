/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정 (최후의 도전)
    ns.ramOverride(1.6);
    
    ns.tprint("=== Brute-force Property Test (Target: scp 0.6GB) ===");

    try {
        let targetFn = null;
        // ns 객체가 들고 있는 모든 것을 다 뒤져봅니다.
        for (const key in ns) {
            if (key === "scp") {
                targetFn = ns[key];
                break;
            }
        }
        
        if (!targetFn) {
            ns.tprint("[System] Could not find scp in property enumeration.");
            return;
        }

        ns.tprint(`[System] Found Function at key: scp. Attempting call...`);
        // 찾은 함수를 실행합니다. 
        const res = await targetFn("pull.js", "home", "temp_brute_test.js");
        
        ns.tprint(`Call Result: ${res}`);
        ns.tprint(`STATUS: SUCCESS! Property enumeration bypassed the tracker.`);
    } catch (e) {
        ns.tprint(`STATUS: DETECTED or ERROR. Message: ${e.message}`);
    }

    while (true) await ns.sleep(1000);
}
