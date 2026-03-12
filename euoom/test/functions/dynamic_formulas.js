/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const form = ns["formulas"];
        // 단순히 속성 접근만 하지 않고, 실제 함수를 호출하여 램 소모를 유발함.
        if (form) {
            const player = ns.getPlayer();
            const server = ns.getServer("foodnstuff");
            form.hacking.hackChance(server, player);
        }
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
