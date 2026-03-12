/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🛠️ CHECK.JS: Internal Engine Probe ===");

    try {
        // 1. 글로벌 객체 확보 (이미 25GB 우회를 통해 통로가 열림)
        const g = ns.hack.constructor("return this")();
        
        // 2. 게임 내부 전역 변수 전수 조사
        ns.tprint("- Searching for naked global variables...");
        const interestingKeys = [
            "Player", "Servers", "AllServers", "engine", "netscript", 
            "appSaveFns", "terminal", "router", "BitNodeMultipliers"
        ];
        
        for (const key of interestingKeys) {
            if (g[key] !== undefined) {
                ns.tprint(`🎯 [FOUND] global.${key} (${typeof g[key]})`);
                // 객체라면 내부 구조 살짝 보기
                if (typeof g[key] === "object" && g[key] !== null) {
                    const subKeys = Object.keys(g[key]).slice(0, 5);
                    ns.tprint(`   ↳ Keys: ${subKeys.join(", ")}...`);
                }
            }
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
