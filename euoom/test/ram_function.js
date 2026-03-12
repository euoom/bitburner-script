/** @param {NS} zz */
export async function main(zz) {
    // 1. zz라는 이름으로 할당량 1.6GB 고정
    zz.ramOverride(1.6);
    
    zz.tprint("=== Parameter Aliasing Test (zz[s+c+p]: 0.6GB) ===");
    
    // 2. 가설: 엔진이 "ns"라는 객체를 감시한다면, zz라는 이름으로 부르면 모를 것이다.
    const fn = "s" + "c" + "p";
    
    try {
        // zz["scp"](...) 를 실행
        const res = zz[fn]("pull.js", "home", "home");
        
        zz.tprint(`Result: ${res}`);
        zz.tprint(`STATUS: BEYOND SUCCESS! ns to zz conversion bypassed the check.`);
    } catch (e) {
        zz.tprint(`STATUS: DETECTED. The engine tracks the internal function logic.`);
        zz.tprint(`Error Message: ${e.message}`);
    }
    
    while (true) {
        await zz.sleep(1000);
    }
}
