/** @param {NS} ns */
export async function main(ns) {
    // 해킹할 대상 서버 (초반 가장 만만한 서버)
    const target = ns.args[0] || "foodnstuff";

    // 기준 설정: 최대 자금의 75% 이상 유지, 보안 레벨은 최소치의 +5 이하 유지
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    ns.tprint(`🚀 Starting basic hack on ${target}...`);

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
