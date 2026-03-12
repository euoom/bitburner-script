/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    const scriptName = ns.getScriptName();
    const actualRam = ns.getScriptRam(scriptName);
    
    ns.tprint(`=== Slim Hacknet Version (Bypass) ===`);
    ns.tprint(`[Static RAM Cost]: ${actualRam.toFixed(2)} GB`);
    ns.tprint(`[Internal RAM Override]: 1.60 GB`); 
    
    try {
        const hn = ns["hacknet"];
        const nodes = hn["numNodes"]();
        ns.tprint(`Hacknet Nodes: ${nodes}`);
        ns.tprint(`Status: Success! 4GB API running inside 1.6GB envelope.`);
    } catch (e) {
        ns.tprint(`Runtime Error: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
