/** @param {NS} ns */
export async function main(ns) {
    const keys = new Set();
    Object.getOwnPropertyNames(ns).forEach(key => keys.add(key));
    const proto = Object.getPrototypeOf(ns);
    if (proto) Object.getOwnPropertyNames(proto).forEach(key => keys.add(key));

    const sortedKeys = Array.from(keys).sort();
    let output = "=== Bitburner NS API RAM Cost Inspection (Filtered > 0GB) ===\n";
    output += "| Function Path                  | Cost (GB)  |\n";
    output += "|--------------------------------|------------|\n";

    // 1. Root NS Functions
    for (const key of sortedKeys) {
        if (key === "main") continue;
        try {
            const target = ns[key];
            if (typeof target === 'function') {
                const cost = ns.getFunctionRamCost(key);
                if (cost > 0) {
                    output += `| ${key.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
                }
            }
        } catch (e) {}
    }

    // 2. Deep Dive Namespaces
    const namespaces = ["formulas", "singularity", "corporation", "hacknet", "stock", "bladeburner", "gang", "sleeve", "stanek", "ui"];
    
    for (const nsName of namespaces) {
        const subObj = ns[nsName];
        if (!subObj || typeof subObj !== 'object') continue;

        output += "|--------------------------------|------------|\n";
        output += `| [Namespace: ${nsName.padEnd(16)}] |            |\n`;

        // 2단계 탐색 수행 (예: formulas.hacking.getWeakenTime 등)
        const subKeys = Object.getOwnPropertyNames(subObj).sort();
        for (const key of subKeys) {
            const target = subObj[key];
            const fullPath = `${nsName}.${key}`;

            if (typeof target === 'function') {
                try {
                    const cost = ns.getFunctionRamCost(fullPath);
                    if (cost > 0) {
                        output += `| ${fullPath.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
                    }
                } catch (e) {}
            } else if (target && typeof target === 'object' && !Array.isArray(target)) {
                // 3단계 탐색 (예: formulas.hacking.XXX)
                const subSubKeys = Object.getOwnPropertyNames(target).sort();
                for (const subKey of subSubKeys) {
                    if (typeof target[subKey] === 'function') {
                        try {
                            const subFullPath = `${fullPath}.${subKey}`;
                            const cost = ns.getFunctionRamCost(subFullPath);
                            if (cost > 0) {
                                output += `| ${subFullPath.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
                            }
                        } catch (e) {}
                    }
                }
            }
        }
    }

    const outPath = "/euoom/test/ns_api_costs.txt";
    ns.write(outPath, output, "w");
    ns.tprint(`🎯 Inspection complete! Results saved to: ${outPath}`);
}
