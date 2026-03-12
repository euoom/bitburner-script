/** @param {NS} ns */
export async function main(ns) {
    // 1. 램 할당량을 무조건 1.6GB로 고정합니다. (입장료만 내기)
    ns.ramOverride(1.6);
    
    ns.tprint("=== Real Function Bypass Test (scp: 0.6GB) ===");
    
    try {
        // 2. 평소라면 0.6GB를 먹는 scp를 대괄호 트릭으로 부릅니다.
        // 만약 대괄호 방식이 실제 실행 중에도 램을 청구한다면, 
        // 1.6 + 0.6 = 2.2GB가 되어 할당량(1.6)을 초과하므로 스크립트는 즉시 죽습니다.
        const res = ns["scp"]("pull.js", "home", "home"); // 자가 복사 시도
        
        ns.tprint(`Real scp Call Result: ${res}`);
        ns.tprint(`STATUS: SUCCESS! Bracket notation is REAL 0GB at runtime.`);
    } catch (e) {
        ns.tprint(`STATUS: FAILED! Bracket notation still costs RAM at runtime.`);
        ns.tprint(`Error Message: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
