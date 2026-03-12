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
                
                ns.tprint("- Inspecting React internals for Engine/Player hooks...");
                
                let foundEngine = null;
                function findInReact(obj, depth = 0) {
                    if (!obj || depth > 10 || foundEngine) return;
                    
                    if (obj.stateNode && obj.stateNode.props && obj.stateNode.props.ns) {
                        foundEngine = obj.stateNode.props.ns;
                        return;
                    }

                    if (obj.memoizedProps && obj.memoizedProps.ns) {
                        foundEngine = obj.memoizedProps.ns;
                        return;
                    }

                    if (obj.child) findInReact(obj.child, depth + 1);
                    if (obj.sibling) findInReact(obj.sibling, depth + 1);
                }

                findInReact(internal);

                if (foundEngine) {
                    ns.tprint("🎯 JACKPOT: Naked Engine acquired!");
                    try {
                        // 램 체크 프록시를 거치지 않는 직접 호출 테스트
                        const server = foundEngine.getServer("home");
                        ns.tprint(`✅ Success! Home Max RAM: ${server.maxRam}GB`);
                    } catch (e) {
                        ns.tprint("⚠️ Engine found but call failed: " + e.message);
                    }
                } else {
                    ns.tprint("⚠️ Could not find Naked Engine in the first 10 layers.");
                }
            }
        }

        // 4. 터미널 하이라이트
        const terminals = doc.querySelectorAll("p, span, li");
        terminals.forEach(el => {
            if (el.innerText && el.innerText.includes("CHECK.JS")) {
                el.style.color = "#00ff00";
                el.style.fontWeight = "bold";
            }
        });

    } catch (e) {
        ns.tprint("❌ Error: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
