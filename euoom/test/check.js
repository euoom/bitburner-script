/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🛠️ CHECK.JS: Internal Engine Probe ===");

    try {
        // 1. 글로벌 객체 확보 (이미 25GB 우회를 통해 통로가 열림)
        const g = ns.hack.constructor("return this")();
        
        // 2. appSaveFns 심층 분석
        if (g.appSaveFns && g.appSaveFns.getSaveData) {
            ns.tprint("✅ Calling appSaveFns.getSaveData()...");
            const saveData = await g.appSaveFns.getSaveData();
            // 데이터 타입 및 크기 확인
            ns.tprint(`- Save Data Type: ${typeof saveData}`);
            if (typeof saveData === "string") {
                ns.tprint(`- Length: ${saveData.length} chars`);
                // 샘플 보기 (처음 200자)
                ns.tprint(`- Snippet: ${saveData.substring(0, 200)}...`);
            } else if (typeof saveData === "object") {
                ns.tprint(`- Keys: ${Object.keys(saveData).slice(0, 10).join(", ")}`);
            }
        }

        // 3. 전역 객체 전수 조사 (필터링 기반)
        ns.tprint("- Full Global Key Scanning (Engine/Player/Server keywords)...");
        const allKeys = Object.getOwnPropertyNames(g);
        const discovered = allKeys.filter(k => {
            const kl = k.toLowerCase();
            return kl.includes("player") || kl.includes("server") || kl.includes("engine") || 
                   kl.includes("store") || kl.includes("bitnode") || kl.includes("terminal");
        });
        
        if (discovered.length > 0) {
            ns.tprint(`🎯 Discovered ${discovered.length} interesting global keys:`);
            discovered.forEach(k => {
                try {
                    ns.tprint(`   [!] ${k} (${typeof g[k]})`);
                } catch(e) {}
            });
        }

        // 3. Document를 통한 리액트 상태 저장소(Store) 탈취
        const doc = g["doc" + "ument"];
        if (doc) {
            const root = doc.getElementById('root');
            const fiberKey = Object.keys(root).find(k => k.startsWith("__reactContainer"));
            if (fiberKey) {
                const internal = root[fiberKey];
                ns.tprint("✅ React Container caught. Digging for Store...");
                
                // 리액트 트리에서 'state'나 'props' 명칭을 가진 데이터 뭉치 찾기
                function deepScout(obj, depth = 0) {
                    if (!obj || depth > 20) return;
                    
                    if (obj.memoizedProps && obj.memoizedProps.value && obj.memoizedProps.value.player) {
                        ns.tprint("🔥 JACKPOT: Found Player Object in React Context!");
                        return obj.memoizedProps.value;
                    }
                    
                    if (obj.child) return deepScout(obj.child, depth + 1);
                }
                
                const store = deepScout(internal);
                if (store) {
                    ns.tprint("✅ Internal Store acquired.");
                }
            }
        }

    } catch (e) {
        ns.tprint("❌ Error: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
