/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try { ns["scriptKill"]("none.js", "home"); } catch (e) {}
    while (true) await ns.sleep(1000);
}
