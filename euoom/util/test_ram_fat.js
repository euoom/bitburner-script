/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== Fat Hacknet Version ===");
    // ns.hacknet을 대놓고 호출 (4GB 청구 고지서 발송됨)
    const nodes = ns.hacknet.numNodes();
    ns.tprint(`Hacknet Nodes: ${nodes}`);
    ns.tprint("Notice: This script takes 5.6GB RAM.");
}
