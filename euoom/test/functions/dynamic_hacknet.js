import { getHN } from "/euoom/lib/hacknet.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    const hn = getHN(ns);
    hn["numNodes"]();
}
