/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const sleeve = ns["sleeve"];
        if (sleeve) sleeve["getNumSleeves"]();
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
