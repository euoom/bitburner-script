/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try { ns["formatPercent"](0.5); } catch (e) {}
    while (true) await ns.sleep(1000);
}
