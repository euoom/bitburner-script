/** @param {NS} ns */
export async function main(ns) {
    const path = ns.args[0];
    if (!path) return;

    // 1. 램 오버라이드 적용
    ns.ramOverride(1.6);
    
    try {
        // 2. 경로 해석 (예: singularity.travelToCity -> ns.singularity["travelToCity"])
        const parts = path.split(".");
        let obj = ns;
        for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }
        const method = parts[parts.length - 1];
        
        if (typeof obj[method] === "function") {
            // 3. 실제 실행 (인자 없이 호출하여 램 차단 여부 확인)
            // 에러가 나더라도 RAM 차단만 아니면 catch에서 잡힘
            obj[method]();
        }
    } catch (e) {
        // 인자 부족 등의 로직 에러는 무시 (LIVE 유지를 위함)
    }
    
    // 4. 관찰을 위해 프로세스 유지
    while (true) await ns.sleep(1000);
}
