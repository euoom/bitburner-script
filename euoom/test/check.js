/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🛠️ CHECK.JS: Zero-RAM Data Extraction ===");

    try {
        const g = ns.hack.constructor("return this")();
        
        // 1. LocalStorage 탈취 (16GB getSaveData 우회)
        ns.tprint("- Attempting LocalStorage extraction (0GB)...");
        try {
            const ls = g["local" + "Storage"];
            const saveKey = "bitburnerSave";
            const rawSave = ls.getItem(saveKey);
            
            if (rawSave) {
                ns.tprint(`✅ Success! Found ${saveKey} in LocalStorage.`);
                ns.tprint(`- Raw Size: ${(rawSave.length / 1024 / 1024).toFixed(2)} MB`);
                // 데이터의 정체 확인 (JSON 여부)
                if (rawSave.startsWith("{") || rawSave.startsWith("[")) {
                    ns.tprint("✅ Save data is in JSON format. We can parse it without RAM cost!");
                }
            } else {
                ns.tprint("⚠️ 'bitburnerSave' not found in LocalStorage. Checking alternative keys...");
                const allKeys = [];
                for (let i = 0; i < ls.length; i++) allKeys.push(ls.key(i));
                ns.tprint(`- Available keys: ${allKeys.join(", ")}`);
            }
        } catch (e) {
            ns.tprint("❌ LocalStorage access failed: " + e.message);
        }

        // 2. 전역 인스턴스 전수 조사 (함수 제외 객체만)
        ns.tprint("\n- Searching for Naked Data Instances (0GB Objects)...");
        const allKeys = Object.getOwnPropertyNames(g);
        const engineKeywords = ["player", "server", "engine", "bitnode", "store"];
        
        for (const k of allKeys) {
            try {
                const kl = k.toLowerCase();
                const isMatch = engineKeywords.some(kw => kl.includes(kw));
                
                if (isMatch) {
                    const obj = g[k];
                    const type = typeof obj;
                    
                    // 함수가 아닌 객체라면 "램 체크 없는 노다지"일 확률이 높음
                    if (type === "object" && obj !== null) {
                        ns.tprint(`🎯 [INSTANCE] global.${k} (Object)`);
                        const keys = Object.keys(obj).slice(0, 5);
                        ns.tprint(`   ↳ Sub-keys: ${keys.join(", ")}`);
                    } else if (type === "function") {
                        // 함수는 일단 리스트만 기록 (실행은 안 함)
                        ns.tprint(`   [LOCKED] global.${k} (Function - Cost applies)`);
                    }
                }
            } catch (e) {}
        }

    } catch (e) {
        ns.tprint("❌ Global Error: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
