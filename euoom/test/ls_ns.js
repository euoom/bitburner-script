/** @param {NS} ns */
export async function main(ns) {
    const keys = new Set();
    
    // 단순하게 현재 ns 객체의 모든 프로퍼티 수집
    Object.getOwnPropertyNames(ns).forEach(key => keys.add(key));
    
    // 혹시 모를 프로토타입 1단계만 추가 수집
    const proto = Object.getPrototypeOf(ns);
    if (proto) {
        Object.getOwnPropertyNames(proto).forEach(key => keys.add(key));
    }

    const sortedKeys = Array.from(keys).sort();
    let output = "=== Bitburner NS API RAM Cost Inspection ===\n";
    output += "| Function Name                  | Cost (GB)  |\n";
    output += "|--------------------------------|------------|\n";

    for (const key of sortedKeys) {
        if (key === "main") continue;
        
        try {
            const target = ns[key];
            if (typeof target === 'function') {
                const cost = ns.getFunctionRamCost(key);
                output += `| ${key.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
            }
        } catch (e) {
            // 접근 불가 항목 무시
        }
    }

    const outPath = "/euoom/test/ns_api_costs.txt";
    ns.write(outPath, output, "w");
    ns.tprint(`🎯 Inspection complete! Results saved to: ${outPath}`);
}
