import { getHN } from "/euoom/lib/hacknet.js";
/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try { getHN(ns)["purchaseNode"](); } catch (e) {}
    while (true) await ns.sleep(1000);
}
