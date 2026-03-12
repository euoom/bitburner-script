import { getHN } from "/euoom/lib/hacknet.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const hn = getHN(ns);
        hn["numNodes"]();
    } catch (e) {}
}
