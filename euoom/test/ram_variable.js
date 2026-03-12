/** @param {NS} ns */
export async function main(ns) {
    // 사용자님의 가설 테스트: ns를 다른 이름으로 바꾸면 분석기가 속을까?
    const ms = ns; 
    
    ns.tprint("=== Variable Aliasing Test ===");
    
    // 점 표기법을 그대로 사용하지만 변수명은 ms입니다.
    const nodes = ms.hacknet.numNodes();
    
    ns.tprint(`Hacknet Nodes: ${nodes}`);
    
    while (true) {
        // Active Scripts에서 이 파일의 할당량을 확인해 봅시다.
        await ns.sleep(1000);
    }
}
