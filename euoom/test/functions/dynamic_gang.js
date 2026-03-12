/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const gang = ns["gang"];
        if (gang) gang["ascendMember"]("Member1");
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
