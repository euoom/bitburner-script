/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const stanek = ns["stanek"];
        if (stanek) stanek["activeFragments"]();
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
