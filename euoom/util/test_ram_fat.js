/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== Normal Version Testing ===");
    // 대놓고 함수 호출 (정적 분석기가 4GB를 청구함)
    const mults = ns.getHacknetMultipliers();
    ns.tprint(`Production Multiplier: ${mults.production}`);
    ns.tprint("Notice the RAM usage in the File Browser or Active Scripts window.");
}
