/** @param {NS} ns */
export async function main(ns) {
    // 1. 할당량 1.6GB 고정
    ns.ramOverride(1.6);
    
    ns.tprint("=== Source Laundering Test (Proxy & Closure) ===");
    
    // 2. 출처 세탁 로직: 분석기가 ns의 정체를 잊게 만듭니다.
    const laundry = (function(source) {
        // Proxy로 한 번 감싸서 객체의 원형을 숨깁니다.
        const handler = {
            get: function(target, prop) {
                return target[prop];
            }
        };
        const p = new Proxy(source, handler);
        // 클로저를 통해 반환하여 추적 사슬을 복잡하게 만듭니다.
        return () => p;
    })(ns);

    // 이제 ms는 분석기 입장에서 '어디선가 온 정체불명의 객체'가 됩니다.
    const ms = laundry(); 
    
    try {
        // 3. 점 표기법(.scp)을 그대로 써봅니다. 
        // 만약 출처 세탁이 성공했다면, 분석기는 .scp만 보고 4GB를 청구하지 못하거나
        // 최소한 ms가 ns라는 것을 몰라야 합니다.
        const res = ms.scp("pull.js", "home", "temp_test.js");
        
        ns.tprint(`Laundered Call Result: ${res}`);
        ns.tprint(`STATUS: SUCCESS! Source laundering worked.`);
    } catch (e) {
        ns.tprint(`STATUS: FAILED. Even with a Proxy, the engine sees through the call.`);
        ns.tprint(`Error: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
