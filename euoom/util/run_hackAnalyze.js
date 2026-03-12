/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(2.6);
    const dbPath = "/euoom/analyze/db.json";
    if (!ns.fileExists(dbPath)) return;
    const db = JSON.parse(ns.read(dbPath));
    for (const host in db) {
        if (db[host].maxMoney > 0) db[host].hPct = ns.hackAnalyze(host);
    }
    ns.write(dbPath, JSON.stringify(db, null, 4), "w");
}
