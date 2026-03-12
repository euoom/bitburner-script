/** @param {NS} ns */
export async function main(ns) {
    const keys = new Set();
    let obj = ns;
    while (obj && obj !== Object.prototype) {
        Object.getOwnPropertyNames(obj).forEach(key => keys.add(key));
        obj = Object.getPrototypeOf(obj);
    }

    const sortedKeys = Array.from(keys).sort();
    let output = "=== Bitburner NS API RAM Cost Deep Inspection ===\n";
    output += "| Function Path                   | Cost (GB)  |\n";
    output += "|---------------------------------|------------|\n";

    const namespaces = ["formulas", "singularity", "corporation", "hacknet", "stock", "bladeburner", "gang", "sleeve", "stanek", "ui"];

    function inspectNamespace(path, obj) {
        if (!obj || typeof obj !== 'object') return;
        const subKeys = Object.getOwnPropertyNames(obj).sort();
        for (const key of subKeys) {
            const fullPath = path ? `${path}.${key}` : key;
            const target = obj[key];
            
            if (typeof target === 'function') {
                try {
                    const cost = ns.getFunctionRamCost(target);
                    output += `| ${fullPath.padEnd(31)} | ${cost.toFixed(2).padStart(10)} |\n`;
                } catch (e) {}
            } else if (target && typeof target === 'object' && !Array.isArray(target) && key !== 'ns') {
                // 재귀 탐색 (최대 3단계 정도만)
                if (fullPath.split('.').length < 3) {
                    inspectNamespace(fullPath, target);
                }
            }
        }
    }

    // 기본 메소드 검사
    for (const key of sortedKeys) {
        const target = ns[key];
        if (typeof target === 'function') {
            try {
                const cost = ns.getFunctionRamCost(target);
                output += `| ${key.padEnd(31)} | ${cost.toFixed(2).padStart(10)} |\n`;
            } catch (e) {}
        } else if (namespaces.includes(key)) {
            inspectNamespace(key, target);
        }
    }

    const outPath = "/euoom/test/ns_api_costs.txt";
    ns.write(outPath, output, "w");
    ns.tprint(`🎯 Inspection complete! Results saved to: ${outPath}`);
}
