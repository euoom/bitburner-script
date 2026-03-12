/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정 (최후의 도전)
    ns.ramOverride(1.6);
    
    ns.tprint("=== Prototype Bypass Test (Target: scp 0.6GB) ===");

    try {
        // 2. ns 객체의 프로토타입에서 직접 함수를 추출합니다.
        // ns.scp (X) -> ns["scp"] (X)
        // Object.getPrototypeOf(ns)["scp"] (O)
        const proto = Object.getPrototypeOf(ns);
        const rawScp = proto["scp"];
        
        if (!rawScp) {
            // 가끔 프로토타입이 아닌 본체에 있을 수도 있으므로 대안 탐색
            ns.tprint("[System] Prototype access failed, trying different approach...");
        }

        // 3. 추출한 순수 함수를 ns를 this로 바인딩하여 강제 호출합니다.
        // 이 과정에서 ns 객체의 Proxy 'get' 트랩이 호출되지 않는다면 우회 성공입니다.
        const res = await rawScp.apply(ns, ["pull.js", "home", "temp_proto_test.js"]);
        
        ns.tprint(`Proto Call Result: ${res}`);
        ns.tprint(`STATUS: BEYOND IMPOSSIBLE! Prototype bypass worked!`);
    } catch (e) {
        ns.tprint(`STATUS: FAILED. The engine is watching even the prototype or function execution.`);
        ns.tprint(`Error: ${e.message}`);
    }

    while (true) await ns.sleep(1000);
}
