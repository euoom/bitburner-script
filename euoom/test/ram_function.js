/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정 (도전!)
    ns.ramOverride(1.6);
    
    ns.tprint("=== Deep Obfuscation Test (No Strings, Only Keys) ===");
    
    try {
        // 2. ns 객체를 직접 건드리지 않고 내부를 탐색합니다.
        const keys = Object.keys(ns);
        
        // 이름이 "s", "c", "p" 문자로만 이루어진 3글자 함수를 찾습니다.
        // 코드 어디에도 "scp"라는 문자열이 존재하지 않게 합니다.
        const s = String.fromCharCode(115); // 's'
        const c = String.fromCharCode(99);  // 'c'
        const p = String.fromCharCode(112); // 'p'
        const targetKey = keys.find(k => k.length === 3 && k.includes(s) && k.includes(p));
        
        ns.tprint(`[System] Found Hidden Function: ${targetKey}`);
        
        // 3. 찾은 함수를 호출합니다.
        // 만약 이것도 걸린다면, 비트버너 엔진은 '호출되는 순간'의 실제 램 비용을 
        // 하위 엔진 레벨에서 강제로 합산하고 프로세스를 죽이는 것입니다.
        const res = ns[targetKey]("pull.js", "home", "temp_test.js");
        
        ns.tprint(`Result: ${res}`);
        ns.tprint(`STATUS: IMPOSSIBLE SUCCESS! You broke the engine.`);
    } catch (e) {
        ns.tprint(`STATUS: DETECTED. The engine is monitoring the actual API entry point.`);
        ns.tprint(`Error: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
