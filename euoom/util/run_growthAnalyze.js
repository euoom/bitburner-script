/** @param {NS} ns */
/** @ramOverride 2.6 */
export async function main(ns) {
    const dbPath = "/euoom/analyze/db.json";
    if (!ns["fileExists"](dbPath)) return;
    const db = JSON.parse(ns["read"](dbPath));
    for (const host in db) {
        if (db[host].maxMoney > 0) db[host].gThreads2x = ns["growthAnalyze"](host, 2);
    }
    ns["write"](dbPath, JSON.stringify(db, null, 4), "w");
}
