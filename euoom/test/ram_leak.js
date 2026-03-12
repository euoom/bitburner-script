/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== Internal API Security Audit (Target: ctx Leak) ===");

    // 시도 1: toString() 인젝션을 통한 컨텍스트 탈취 시도
    const injection = {
        toString: function() {
            ns.tprint("[System] toString() executed inside scp engine!");
            // 여기서 ns 객체의 내부를 다시 한 번 뒤지거나 
            // 호출 스택(Caller)을 통해 ctx를 추적할 수 있는지 확인합니다.
            try {
                // arguments.callee 등은 strict mode에서 막히지만 시도는 해볼 가치가 있음
                const stack = new Error().stack;
                ns.tprint(`[Stack Trace] ${stack}`);
            } catch (e) {}
            return "home";
        }
    };

    try {
        ns.tprint("[Test 1] Attempting toString Injection...");
        ns["scp"]("pull.js", "home", injection); 
    } catch (e) {
        ns.tprint("[Test 2] Analyzing Error Object for ctx leak...");
        // 에러 객체 내부에 숨겨진 속성이 있는지 샅샅이 뒤집니다.
        const props = Object.getOwnPropertyNames(e);
        ns.tprint(`Error Props: ${props.join(", ")}`);
        
        for (const p of props) {
            if (typeof e[p] === 'object') {
                ns.tprint(` -> Found Object Prop: ${p}`);
            }
        }
    }

    while (true) await ns.sleep(1000);
}
