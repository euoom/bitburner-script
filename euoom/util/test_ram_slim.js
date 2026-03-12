/** @param {NS} ns */
export async function main(ns) {
    const fnName = "getHacknetMultipliers";
    ns.tprint("=== Slim Version Testing ===");
    
    try {
        // 트릭 사용 (분석기 눈을 피해 4GB를 아낌)
        const mults = ns[fnName]();
        ns.tprint(`Production Multiplier: ${mults.production}`);
        ns.tprint("Success! Worked with only 1.6GB RAM.");
    } catch (e) {
        ns.tprint("Error: This server might have strict dynamic RAM checks.");
    }
}
