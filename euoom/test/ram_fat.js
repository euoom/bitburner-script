/** @param {NS} ns */
export async function main(ns) {
    const scriptName = ns.getScriptName();
    const actualRam = ns.getScriptRam(scriptName);
    
    ns.tprint(`=== Fat Hacknet Version ===`);
    ns.tprint(`[Actual RAM Cost]: ${actualRam.toFixed(2)} GB`);
    
    const nodes = ns.hacknet.numNodes();
    ns.tprint(`Hacknet Nodes: ${nodes}`);
    
    while (true) {
        await ns.sleep(1000);
    }
}
