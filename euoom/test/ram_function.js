/** @param {NS} ns */
export async function main(ns) {
    // 타겟: scp (0.60GB - 덩치가 커서 구분이 확실함)
    const fake = {
        scp: function() { return false; }
    };

    ns.tprint("=== Heavy Function Pattern Test (scp: 0.6GB) ===");
    
    // 가짜 scp 호출. 가설이 맞다면 0.6GB가 추가로 청구됨.
    const res = fake.scp();
    
    // 측정도 트릭으로 수행 (측정 함수 자체의 0.1GB 청구를 피함)
    const getRamFn = "getScriptRam";
    const actualRam = ns[getRamFn](ns.getScriptName());
    
    ns.tprint(`Fake scp Call Result: ${res}`);
    ns.tprint(`[SYSTEM] Current Script RAM Cost: ${actualRam.toFixed(2)} GB`);
    ns.tprint(`(Expected 1.60 if logic-based, 2.20 if pattern-based)`);
    
    while (true) {
        await ns.sleep(1000);
    }
}
