/** @param {NS} ns */
export async function main(ns) {
    const dbPath = "/euoom/analyze/db.json";
    const anaPath = "/euoom/analyze/analysis.json";
    if (!ns.fileExists(dbPath)) return ns.tprint("[Error] db.json not found!");

    const dataPack = JSON.parse(ns.read(dbPath));
    const { rawDB, marketData } = dataPack;
    
    const targets = {};
    const others = {};
    let maxEfficiency = 0;

    for (const host in rawDB) {
        const data = rawDB[host];
        if (data.hPct) { // Enricher가 데이터를 채운 경우
            const hTimeSec = data.hTime / 1000;
            const gTimeSec = data.gTime / 1000;
            const wTimeSec = data.wTime / 1000;

            // HGW Ratios (Weaken-Anchored)
            const targetPct = 0.01;
            const tH_raw = targetPct / Math.max(data.hPct, 0.000001);
            // Growth estimation (Approximated math since growthAnalyze is heavy)
            // Growth = 1/(1 - hackAmount)
            const growthReq = 1 / (1 - (tH_raw * data.hPct));
            // rough growth threads estimate to avoid re-calling API
            const tG_raw = Math.log(growthReq) / Math.log(Math.pow(2, 1/Math.max(data.gThreads2x, 1)));
            const tW_raw = (tH_raw * 0.002 + tG_raw * 0.004) / data.wAmt;
            
            const anchor = tW_raw;
            const rH = Math.max(Math.floor(tH_raw / anchor), 1);
            const rG = Math.max(Math.ceil(tG_raw / anchor), 1);
            const rW = 1;

            const batchMoney = (rH * data.hPct) * data.maxMoney;
            const batchRam = (rH * 1.70) + (rG * 1.75) + (rW * 1.75);
            const efficiency = batchMoney / (batchRam * wTimeSec);

            if (efficiency > maxEfficiency) maxEfficiency = efficiency;

            targets[host] = {
                hostname: host,
                requiredHacking: data.requiredHacking,
                maxMoney: data.maxMoney,
                ratioH: rH,
                ratioG: rG,
                ratioW: rW,
                batchMoney,
                batchRam,
                batchTime: wTimeSec,
                loopTime: (rH * hTimeSec) + (rG * gTimeSec) + (rW * wTimeSec),
                efficiency,
                moneyPercent: (data.moneyAvailable / data.maxMoney) * 100
            };
        } else {
            others[host] = {
                hostname: host,
                requiredHacking: data.requiredHacking,
                maxMoney: data.maxMoney,
                reason: data.maxMoney === 0 ? "No Money" : `Low Hack Level (Need ${data.requiredHacking})`
            };
        }
    }

    // Market Analysis (ROI)
    const ramPricePerGB = marketData.ramPrice8GB / 8;
    const hackingROI = maxEfficiency / ramPricePerGB;
    
    // Hacknet ROI Sample (using stats from db.json if available, or base)
    const bestHnROI = 1.5 / 1215000; // Placeholder ROI based on base Node cost

    const summary = {
        maxHackingEfficiency: maxEfficiency,
        ramPricePerGB: ramPricePerGB,
        hackingROI,
        hacknetROI: bestHnROI,
        recommendation: bestHnROI > hackingROI ? "INVEST_HACKNET" : "INVEST_RAM_FOR_HACKING"
    };

    ns.write(anaPath, JSON.stringify({ summary, targets, others }, null, 4), "w");
    ns.tprint("[Refiner] Logic processing complete. analysis.json updated.");
}
