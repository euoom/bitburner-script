/** @param {NS} ns */
export async function main(ns) {
    const visited = new Set();
    const network = [];

    /** 네트워크 전체 스캔 (DFS) */
    function scanNetwork(node) {
        visited.add(node);
        const neighbors = ns.scan(node);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                scanNetwork(neighbor);
            }
        }
        if (node !== "home") network.push(node);
    }

    scanNetwork("home");

    const analysis = network.map(server => {
        const maxMoney = ns.getServerMaxMoney(server);
        const minSec = ns.getServerMinSecurityLevel(server);
        const hackChance = ns.hackAnalyzeChance(server);
        const requiredLevel = ns.getServerRequiredHackingLevel(server);
        
        // 가성비 점수 계산 (단순 예시: 최대자금 / 최소보안 * 성공확률)
        const score = maxMoney > 0 ? (maxMoney / minSec) * hackChance : 0;

        return {
            name: server,
            score: score,
            reqLevel: requiredLevel,
            canHack: ns.getHackingLevel() >= requiredLevel
        };
    });

    // 점수 높은 순으로 정렬
    analysis.sort((a, b) => b.score - a.score);

    ns.tprint("--- Network Analysis (Top 5) ---");
    analysis.filter(s => s.canHack && s.score > 0).slice(0, 5).forEach((s, idx) => {
        ns.tprint(`[${idx + 1}] ${s.name.padEnd(20)} | Score: ${Math.floor(s.score).toLocaleString().padStart(12)} | Req Level: ${s.reqLevel}`);
    });
}
