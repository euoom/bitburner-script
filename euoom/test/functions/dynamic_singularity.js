/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const sing = ns["singularity"];
        sing["getUpgradeHomeRamCost"](); // 대표적인 고비용 함수
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
