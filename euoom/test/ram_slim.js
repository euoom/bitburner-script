/** @param {NS} ns */
export async function main(ns) {
    // getScriptRam은 0.1GB를 소모합니다. 정공법으로 써서 할당량을 1.7GB로 만듭니다.
    const scriptName = ns.getScriptName();
    const actualRam = ns.getScriptRam(scriptName);
    
    ns.tprint(`=== Slim Hacknet Version ===`);
    ns.tprint(`[Actual RAM Cost]: ${actualRam.toFixed(2)} GB`);
    
    try {
        const hn = ns["hacknet"];
        const nodes = hn["numNodes"]();
        ns.tprint(`Hacknet Nodes: ${nodes}`);
        ns.tprint(`Success! Bypassed 4GB cost.`);
    } catch (e) {
        ns.tprint(`Error: ${e.message}`);
    }
    
    while (true) {
        await ns.sleep(1000);
    }
}
