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

    // 1. Root NS Functions (Filtered)
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

    // 2. Singularity Dive
    const ns_sing = ns["singularity"];
    if (ns_sing) {
        output += "|--------------------------------|------------|\n";
        output += "| [Namespace: Singularity]       |            |\n";
        const singKeys = Object.getOwnPropertyNames(ns_sing).sort();
        for (const key of singKeys) {
            const target = ns_sing[key];
            if (typeof target === 'function') {
                try {
                    const fullPath = `singularity.${key}`;
                    const cost = ns.getFunctionRamCost(fullPath);
                    if (cost > 0) {
                        output += `| ${fullPath.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
                    }
                } catch (e) {}
            }
        }
    }

    const outPath = "/euoom/test/ns_api_costs.txt";
    ns.write(outPath, output, "w");
    ns.tprint(`🎯 Inspection complete! Results saved to: ${outPath}`);
}
