import { getHN } from "/euoom/lib/hacknet.js";

/** @param {NS} ns */
export async function main(ns) {
    const hn = getHN(ns);
    hn["numNodes"]();
}
