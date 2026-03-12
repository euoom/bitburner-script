/** @param {NS} ns */
export async function main(ns) {
// 레벨 2: 더 복잡한 우회 시도
    
    // 시도 1: 배열에 넣었다가 빼기
    const list = [ns];
    const ms1 = list[0];
    
    // 시도 2: 함수 인자로 넘겨서 받기
    function bypass(x) { return x; }
    const ms2 = bypass(ns);
    
    // 시도 3: 객체 속성으로 숨기기
    const container = { api: ns };
    const ms3 = container.api;

    ns.tprint("=== Advanced Variable Aliasing Test ===");
    
    // 아래 중 하나만 살아보고 나머지는 주석처리하며 테스트해볼 수 있습니다.
    const nodes = ms1.hacknet.numNodes(); 
    // const nodes = ms2.hacknet.numNodes();
    // const nodes = ms3.hacknet.numNodes();
    
    ns.tprint(`Hacknet Nodes: ${nodes}`);
    
    while (true) {
        // Active Scripts에서 이 파일의 할당량을 확인해 봅시다.
        await ns.sleep(1000);
    }
}
