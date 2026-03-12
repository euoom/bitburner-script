/** @param {NS} ns */
export async function main(ns) {
    const dbPath = "/euoom/analyze/db.json";
    if (!ns.fileExists(dbPath)) return;
    const db = JSON.parse(ns.read(dbPath));
    const wAmt = ns.weakenAnalyze(1);
    for (const host in db) {
        db[host].wAmt = wAmt;
    }
    ns.write(dbPath, JSON.stringify(db, null, 4), "w");
}
