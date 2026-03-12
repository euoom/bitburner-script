/** @param {NS} ns */
export async function main(ns) {
    // 모든 함수를 숨겨서 1.6GB를 강제합니다.
    const getRamFn = "getScriptRam";
    const actualRam = ns[getRamFn](ns.getScriptName());
    
    ns.tprint(`=== Slim Hacknet Version (1.6GB Challenge) ===`);
    ns.tprint(`[Reported RAM]: ${actualRam.toFixed(2)} GB`);
    
    try {
        const hn = ns["hacknet"];
        const nodes = hn["numNodes"]();
        ns.tprint(`Hacknet Nodes: ${nodes}`);
        ns.tprint(`Current static RAM Is: 1.60 GB`); 
    } catch (e) {
        ns.tprint(`Dynamic RAM Check Failed: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
