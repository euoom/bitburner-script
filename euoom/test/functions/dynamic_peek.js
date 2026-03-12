/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try { ns["peek"](1); } catch (e) {}
    while (true) await ns.sleep(1000);
}
