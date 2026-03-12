import { getHN } from "/euoom/lib/hacknet.js";

/** @param {NS} ns */
/** @ramOverride 2.1 */
export async function main(ns) {
    const hn = getHN(ns);
    const dbPath = "/euoom/analyze/db.json";
    if (!ns.fileExists(dbPath)) return;
    const db = JSON.parse(ns.read(dbPath));
    const marketData = {
        ramPrice8GB: ns.getPurchasedServerCost(8),
        hnMult: hn["getHacknetMultipliers"]().production,
        myHackLevel: ns.getHackingLevel()
    };

    for (const host in db) {
        if (db[host].maxMoney > 0) {
            db[host].hTime = ns.getHackTime(host);
            db[host].gTime = ns.getGrowTime(host);
            db[host].wTime = ns.getWeakenTime(host);
        }
    }
    
    ns.write(dbPath, JSON.stringify({ rawDB: db, marketData }, null, 4), "w");
}
