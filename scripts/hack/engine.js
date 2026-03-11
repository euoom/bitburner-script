/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0] || "foodnstuff";
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    // 무한 루프 시작
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // 보안 레벨이 높으면 낮춥니다.
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // 자금이 부족하면 늘립니다.
            await ns.grow(target);
        } else {
            // 모든 조건이 만족되면 돈을 훔칩니다!
            await ns.hack(target);
        }
    }
}
