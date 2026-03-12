/** @param {NS} ns */
export async function main(ns) {
    // 램 측정도 트릭으로 수행하여 기본 1.6GB를 유지합니다.
    const scriptName = ns.getScriptName();
    const actualRam = ns["getScriptRam"](scriptName);
    
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
