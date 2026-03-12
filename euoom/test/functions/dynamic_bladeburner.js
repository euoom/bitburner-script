/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const bl = ns["bladeburner"];
        if (bl) bl["getActionAutolevel"]("contracts", "Tracking");
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
