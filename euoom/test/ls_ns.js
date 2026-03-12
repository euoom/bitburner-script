/** @param {NS} ns */
export async function main(ns) {
    const keys = new Set();
    let obj = ns;
    
    // Prototype 체인을 따라가며 모든 접근 가능한 키를 수집
    while (obj && obj !== Object.prototype) {
        Object.getOwnPropertyNames(obj).forEach(key => keys.add(key));
        obj = Object.getPrototypeOf(obj);
    }

    const sortedKeys = Array.from(keys).sort();
    const result = {
        functions: [],
        properties: []
    };

    for (const key of sortedKeys) {
        if (key === "main") continue; // 자기 자신 제외
        try {
            // 램 체크를 피하기 위해 대괄호 접근 시도
            if (typeof ns[key] === 'function') {
                result.functions.push(key);
            } else {
                result.properties.push(key);
            }
        } catch (e) {
            result.properties.push(`${key} (Protected)`);
        }
    }

    const outPath = "/euoom/test/ns_inspection.json";
    ns.write(outPath, JSON.stringify(result, null, 4), "w");
    ns.tprint(`🎯 Inspection complete!`);
    ns.tprint(`- Functions: ${result.functions.length}`);
    ns.tprint(`- Properties: ${result.properties.length}`);
    ns.tprint(`👉 Please check the result at: ${outPath}`);
}
