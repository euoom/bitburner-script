/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try { ns["getPurchasedServerUpgradeCost"]("none", 8); } catch (e) {}
    while (true) await ns.sleep(1000);
}
