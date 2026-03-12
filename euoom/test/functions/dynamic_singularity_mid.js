/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const sing = ns["singularity"];
        if (sing) {
            // 48.00 GB 항목 호출 시도
            sing["applyToCompany"]("MegaCorp", "Software Engineering");
        }
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
