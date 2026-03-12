/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        ns["hackAnalyzeChance"]("foodnstuff");
        ns["hackAnalyzeSecurity"](1);
        ns["hackAnalyzeThreads"]("foodnstuff", 1000);
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
