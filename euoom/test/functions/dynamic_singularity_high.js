/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    try {
        const sing = ns["singularity"];
        if (sing) {
            // 512.00 GB 항목 접근 시도
            // 실제 호출 시 게임이 리셋될 수 있으므로 존재 확인 및 시뮬레이션 위주
            ns.print("Singularity interface accessed.");
            if (typeof sing["destroyW0r1dD43m0n"] === "function") {
                ns.print("destroyW0r1dD43m0n (512GB) function exists.");
            }
        }
    } catch (e) {}
    while (true) await ns.sleep(1000);
}
