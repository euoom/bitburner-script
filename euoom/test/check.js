/** @param {NS} ns */
export async function main(ns) {
    const self = ns.pid;
    ns.ps("home").forEach(p => { if (p.pid !== self) ns.kill(p.pid); });
    ns.tprint("=== 🔬 Live React State Sniper (n00dles Object) ===");

    try {
        const g = ns.hack.constructor("return this")();
        const doc = g["doc" + "ument"];
        const root = doc.getElementById("root");
        if (!root) {
            ns.tprint("❌ root element not found.");
            return;
        }

        const fiberKey = Object.keys(root).find(k => k.startsWith("__reactContainer"));
        const rootFiber = root[fiberKey];

        ns.tprint("\n[Step 1] Crawling React Fiber for Server ('n00dles') objects...");

        const candidates = new Set();
        const seen = new Set();
        
        let targetProps = null;

        function crawl(node, depth = 0) {
            if (!node || depth > 300 || seen.has(node)) return;
            seen.add(node);

            // React 컴포넌트의 props 또는 state 를 탐색
            const props = node.memoizedProps;
            const state = node.memoizedState;

            // props 에 n00dles 객체나 서버 리스트(servers)가 존재하는지 스니핑
            if (props) {
                // 단일 서버 객체를 들고 있을 경우 (ex: Server UI)
                if (props.server && props.server.hostname === "n00dles") {
                    candidates.add(props.server);
                }
                
                // 서버 배열을 통째로 들고 있을 경우 (ex: Active Scripts list, Map UI)
                if (props.servers && Array.isArray(props.servers) && props.servers.length > 0) {
                    const n00d = props.servers.find(s => s && s.hostname === "n00dles");
                    if (n00d) candidates.add(n00d);
                }
                
                // 게임 엔진 코어 객체(Engine, Player, AllServers)를 통째로 들고 있는 경우 (루트 프로바이더)
                if (props.value) {
                    const val = props.value;
                    if (typeof val === 'object' && val !== null) {
                        // value 내부에 맵(Map)이나 Record 형태로 서버 정보가 있는지 확인
                        for (const k in val) {
                            try {
                                const subVal = val[k];
                                // Map 구조
                                if (subVal instanceof Map && subVal.has("n00dles")) {
                                    candidates.add(subVal.get("n00dles"));
                                }
                                // Record/Array 구조
                                else if (subVal && typeof subVal === 'object' && subVal["n00dles"] && subVal["n00dles"].moneyAvailable !== undefined) {
                                    candidates.add(subVal["n00dles"]);
                                }
                                else if (Array.isArray(subVal) && subVal.some(s => s && s.hostname === "n00dles")) {
                                    candidates.add(subVal.find(s => s.hostname === "n00dles"));
                                }
                            } catch(e) {}
                        }
                    }
                }
            }

            if (node.child) crawl(node.child, depth + 1);
            if (node.sibling) crawl(node.sibling, depth + 1);
        }

        crawl(rootFiber);

        if (candidates.size === 0) {
            ns.tprint("❌ Failed to locate 'n00dles' or any Server objects in the React tree.");
        } else {
            ns.tprint(`\n[Step 2] Found ${candidates.size} Server object references!`);
            
            let bestCandidate = null;
            // 가장 실시간으로 업데이트될 것 같은(가장 메서드가 많이 달린) 객체 채택
            for (const c of candidates) {
                if (!bestCandidate) bestCandidate = c;
                if (Object.keys(c).length > Object.keys(bestCandidate).length) {
                    bestCandidate = c;
                }
            }
            
            ns.tprint("\n[Target Data Dissection]");
            ns.tprint(`   - Hostname: ${bestCandidate.hostname}`);
            ns.tprint(`   - Money: $${bestCandidate.moneyAvailable} / $${bestCandidate.moneyMax}`);
            ns.tprint(`   - Security: ${bestCandidate.hackDifficulty} (min: ${bestCandidate.minDifficulty})`);
            ns.tprint(`   - Has Admin: ${bestCandidate.hasAdminRights}`);
            ns.tprint(`   - Memory: ${bestCandidate.maxRam} GB`);
            ns.tprint(`   - Object Keys: ${Object.keys(bestCandidate).slice(0, 15).join(", ")}...`);
            
            // 실시간 객체인지 검증하기 위해 잠시 대기 후 값 변동 확인 (이건 플레이어가 다른 액션 중일 때 유효함)
            ns.tprint("\n💡 Tips: 만약 이 객체가 진짜 '엔진 Live 데이터'라면, 게임 내에서 n00dles의 돈이나 난이도가 바뀔 때 즉시 반영됩니다.");
        }

    } catch (e) {
        ns.tprint("❌ Fatal Error: " + (e.stack || e.message));
    }
}
