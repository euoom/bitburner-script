/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        ns["getHackTime"]("foodnstuff");
        ns["getGrowTime"]("foodnstuff");
        ns["getWeakenTime"]("foodnstuff");
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
