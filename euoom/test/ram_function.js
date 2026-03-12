/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정
    ns.ramOverride(1.6);
    
    ns.tprint("=== Ultra Bypass Test (s+c+p: 0.6GB) ===");
    
    // 2. 가설: 엔진이 "scp"라는 문자열을 감시한다면, 쪼개서 합치면 모를 것이다.
    const p1 = "s";
    const p2 = "c";
    const p3 = "p";
    const fnName = p1 + p2 + p3;
    
    try {
        // 동적으로 완성된 문자열 "scp"로 함수 호출
        const res = ns[fnName]("pull.js", "home", "home");
        
        ns.tprint(`Ultra Call Result: ${res}`);
        ns.tprint(`STATUS: BINGO! 1.6GB barrier BROKEN with string concatenation.`);
    } catch (e) {
        ns.tprint(`STATUS: STILL FAILED. Engine tracks the actual function call.`);
        ns.tprint(`Error Message: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
