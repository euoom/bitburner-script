/** @param {NS} ns */
export async function main(ns) {
    const keys = new Set();
    let obj = ns;
    while (obj && obj !== Object.prototype) {
        Object.getOwnPropertyNames(obj).forEach(key => keys.add(key));
        obj = Object.getPrototypeOf(obj);
    }

    const sortedKeys = Array.from(keys).sort();
    let output = "=== Bitburner NS API RAM Cost Auto-Inspection ===\n";
    output += "| Function Name                  | Cost (GB)  |\n";
    output += "|--------------------------------|------------|\n";

    for (const key of sortedKeys) {
        if (typeof ns[key] === 'function') {
            try {
                const cost = ns.getFunctionRamCost(key);
                output += `| ${key.padEnd(30)} | ${cost.toFixed(2).padStart(10)} |\n`;
            } catch (e) {
                // 특정 네임스페이스나 보호된 함수 무시
            }
        }
    }

    const outPath = "/euoom/test/ns_api_costs.txt";
    ns.write(outPath, output, "w");
    ns.tprint(`🎯 Inspection complete! Results saved to: ${outPath}`);
}
