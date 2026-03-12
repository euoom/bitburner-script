/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const form = ns["formulas"];
        // 속성 접근만으로도 램 체크가 발생하는지 확인
        if (form) ns.print("Formulas access success");
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
