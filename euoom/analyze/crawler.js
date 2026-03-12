/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(2.2);
    const rawDB = {};
    const visited = new Set();
    const queue = ["home"];

    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current)) continue;
        visited.add(current);

        const neighbors = ns.scan(current);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) queue.push(neighbor);
        }

        if (current === "home") continue;

        rawDB[current] = {
            hostname: current,
            maxMoney: ns.getServerMaxMoney(current),
            requiredHacking: ns.getServerRequiredHackingLevel(current),
            maxRam: ns.getServerMaxRam(current),
            growth: ns.getServerGrowth(current),
            minSecurity: ns.getServerMinSecurityLevel(current),
            moneyAvailable: ns.getServerMoneyAvailable(current)
        };
    }

    const dbPath = "/euoom/analyze/db.json";
    ns.write(dbPath, JSON.stringify(rawDB, null, 4), "w");
    ns.tprint("[Crawler] Basic network structure saved to db.json");
}
