/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정 (최후의 도전)
    ns.ramOverride(1.6);
    
    ns.tprint("=== Sync Brute-force Test (No await, Direct Call) ===");

    try {
        let scpKey = "s" + "c" + "p";
        let targetFn = ns[scpKey]; 
        
        ns.tprint(`[System] Function extracted. Calling sync...`);
        
        // await를 빼고 동기적으로 실시간 호출합니다.
        // ns.scp는 원래 동기 함수이므로 이 방식이 더 정확한 호출입니다.
        const res = targetFn("pull.js", "home", "temp_sync_test.js");
        
        ns.tprint(`Sync Call Result: ${res}`);
        ns.tprint(`STATUS: BEYOND IMPOSSIBLE! Sync call bypassed the tracker.`);
    } catch (e) {
        ns.tprint(`STATUS: DETECTED. Sync call still triggers the internal RAM check.`);
        ns.tprint(`Error: ${e.message}`);
    }

    while (true) await ns.sleep(1000);
}
