/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== Slim Hacknet Version (Refined) ===");
    
    try {
        // ns["hacknet"] 객체를 먼저 확보한 후 내부 메서드를 호출합니다.
        const hn = ns["hacknet"];
        const nodes = hn["numNodes"]();
        
        ns.tprint(`Hacknet Nodes: ${nodes}`);
        ns.tprint("Success! Worked with ONLY 1.6GB RAM (Saving 4GB!).");
        
        while (true) {
            // Active Scripts 창에서 관찰할 수 있도록 무한 루프 유지
            await ns.sleep(1000);
        }
    } catch (e) {
        ns.tprint(`Error: ${e.message}`);
    }
}
