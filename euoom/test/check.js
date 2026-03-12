/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== 🛠️ CHECK.JS: Unified Bypass Lab ===");

    try {
        // 1. 25GB DOM 우회 (문자열 조합 방식)
        const g = ns.hack.constructor("return this")();
        const doc = g["doc" + "ument"];

        if (!doc) {
            ns.tprint("❌ Critical: Document not accessible.");
            return;
        }
        ns.tprint("✅ Document object stolen with 0GB cost!");

        // 2. UI 변조 테스트 (Root Glow)
        const root = doc.getElementById('root');
        if (root) {
            root.style.boxShadow = "inset 0 0 50px #00ff00";
            ns.tprint("✅ Visual hijacking applied (Root Glow).");

            // 3. 리액트 내부 객체 탐색
            const reactKey = Object.keys(root).find(key => key.startsWith('__reactContainer') || key.startsWith('__reactProps'));
            if (reactKey) {
                ns.tprint(`✅ Found React Key: ${reactKey}`);
                const internal = root[reactKey];
                
                // 엔진의 생얼(Naked Engine)을 찾기 위한 심층 탐색
                ns.tprint("- Inspecting React internals for Engine/Player hooks...");
                
                function findInReact(obj, depth = 0, path = "") {
                    if (!obj || depth > 8) return;
                    
                    // 핵심 키워드 검색
                    const keys = Object.keys(obj);
                    for (const key of keys) {
                        if (key.toLowerCase().includes("player") || key.toLowerCase().includes("worker")) {
                            ns.tprint(`[!] Found potential hook: ${path}.${key} (${typeof obj[key]})`);
                        }
                        
                        if (key === "stateNode" && obj[key]) {
                            const sn = obj[key];
                            // stateNode가 실제 돔이나 리액트 인스턴스일 때 유용한 정보가 많음
                            if (sn.props && sn.props.ns) {
                                ns.tprint("🎯 JACKPOT: Found naked 'ns' in stateNode.props!");
                                return sn.props.ns;
                            }
                        }
                    }

                    // 재귀 탐색 (child, sibling, memoizedProps, memoizedState)
                    if (obj.child) findInReact(obj.child, depth + 1, path + ".child");
                    if (obj.sibling) findInReact(obj.sibling, depth + 1, path + ".sibling");
                    if (obj.memoizedProps) {
                        const props = obj.memoizedProps;
                        if (props.router || props.terminal || props.player) {
                            ns.tprint(`[!] Found interesting Props at depth ${depth}`);
                        }
                    }
                }

                const engine = findInReact(internal);
                if (engine) {
                    ns.tprint("✅ Naked Engine acquired. Testing bypass call (getServer)...");
                    // 램 체크 프록시를 거치지 않는 직접 호출 테스트
                    const server = engine.getServer("home");
                    ns.tprint(`✅ Success! Home Max RAM via Naked Engine: ${server.maxRam}GB`);
                }

        // 4. 터미널 하이라이트
        const terminals = doc.querySelectorAll(".MuiTypography-root"); // 비트버너 터미널 클래스 예시
        terminals.forEach(el => {
            if (el.innerText.includes("Unified Bypass Lab")) {
                el.style.color = "#00ff00";
                el.style.fontWeight = "bold";
            }
        });

    } catch (e) {
        ns.tprint("❌ Error: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
