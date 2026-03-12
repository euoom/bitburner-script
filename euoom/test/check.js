/** @param {NS} ns */
export async function main(ns) {
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
                
                ns.tprint("- Searching deeper (50 layers) and across all DOM elements...");
                
                let foundEngine = null;
                const seen = new Set();

                function findInFiber(obj, depth = 0) {
                    if (!obj || depth > 50 || foundEngine || seen.has(obj)) return;
                    seen.add(obj);
                    
                    // 핵심 탐색 대상: ns, player, engine, router
                    const targets = ["ns", "player", "engine"];
                    
                    // 1. memoizedProps 탐색
                    if (obj.memoizedProps) {
                        for (const target of targets) {
                            if (obj.memoizedProps[target]) {
                                foundEngine = obj.memoizedProps[target];
                                if (target === "ns") return; // ns를 찾으면 즉시 중단
                            }
                        }
                    }

                    // 2. stateNode 탐색
                    if (obj.stateNode && !obj.stateNode.nodeType) { // DOM 노드가 아닌 경우만
                        for (const target of targets) {
                            if (obj.stateNode.props && obj.stateNode.props[target]) {
                                foundEngine = obj.stateNode.props[target];
                                if (target === "ns") return;
                            }
                        }
                    }

                    if (obj.child) findInFiber(obj.child, depth + 1);
                    if (obj.sibling) findInFiber(obj.sibling, depth + 1);
                }

                // 1) Root Container부터 탐색
                findInFiber(internal);

                // 2) 만약 못 찾았다면 모든 DOM 엘리먼트를 돌며 Fiber 노드 탐색
                if (!foundEngine) {
                    const allElems = doc.getElementsByTagName("*");
                    for (const el of allElems) {
                        const fiberKey = Object.keys(el).find(k => k.startsWith("__reactFiber"));
                        if (fiberKey) {
                            findInFiber(el[fiberKey]);
                            if (foundEngine) break;
                        }
                    }
                }

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
