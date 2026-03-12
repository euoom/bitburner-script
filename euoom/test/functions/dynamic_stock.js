/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const stk = ns["stock"];
        stk["getSymbols"]();
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
