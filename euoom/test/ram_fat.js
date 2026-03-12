/** @param {NS} ns */
export async function main(ns) {
    const scriptName = ns.getScriptName();
    const actualRam = ns.getScriptRam(scriptName);
    
    ns.tprint(`=== Fat Hacknet Version ===`);
    ns.tprint(`[Actual RAM Cost]: ${actualRam.toFixed(2)} GB`);
    
    // 정적 호출로 인해 램 사용량이 높음
    const nodes = ns.hacknet.numNodes();
    ns.tprint(`Hacknet Nodes: ${nodes}`);
    
    while (true) {
        await ns.sleep(1000);
    }
}
