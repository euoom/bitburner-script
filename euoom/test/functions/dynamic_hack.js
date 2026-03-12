/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        ns["hackAnalyze"]("foodnstuff");
    } catch (e) {
        // 엔진 로그 억제 시도
    }
}
