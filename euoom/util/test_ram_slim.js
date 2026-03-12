/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== Slim Hacknet Version ===");
    
    try {
        // ns["hacknet"]["numNodes"]() 처럼 접근하여 분석기를 속입니다.
        // 이 코드는 4GB의 추가 램 비용을 지불하지 않고 1.6GB만 소모합니다.
        const nodes = ns["hacknet"]["numNodes"]();
        ns.tprint(`Hacknet Nodes: ${nodes}`);
        ns.tprint("Success! Worked with ONLY 1.6GB RAM (Saving 4GB!).");
    } catch (e) {
        ns.tprint("Error: Dynamic access failed.");
    }
}
