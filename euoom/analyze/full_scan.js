/** @param {NS} ns */
export async function main(ns) {
    const startTime = Date.now();
    const rawDB = {};     // API 순수 데이터 (db.json)
    const analysisDB = {}; // 계산된 가공 데이터 (analysis.json)
    
    const visited = new Set();
    const queue = ["home"];

    ns.tprint("=== Starting Dual-Layer Network Scan ===");

    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current)) continue;
        visited.add(current);

        const neighbors = ns.scan(current);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) queue.push(neighbor);
        }

        if (current === "home") continue;

        try {
            // 1. 순수 데이터 수집 (Raw API Data)
            const cMoney = ns.getServerMoneyAvailable(current);
            const mMoney = ns.getServerMaxMoney(current);
            const mRam = ns.getServerMaxRam(current);
            const reqHack = ns.getServerRequiredHackingLevel(current);
            const reqPorts = ns.getServerNumPortsRequired(current);
            const growth = ns.getServerGrowth(current);
            const minSec = ns.getServerMinSecurityLevel(current);
            const baseSec = ns.getServerBaseSecurityLevel(current);
            
            const hTime = ns.getHackTime(current);
            const gTime = ns.getGrowTime(current);
            const wTime = ns.getWeakenTime(current);
            
            const hPercent = ns.hackAnalyze(current);
            const wAmount = ns.weakenAnalyze(1);

            rawDB[current] = {
                hostname: current,
                maxRam: mRam,
                numPortsRequired: reqPorts,
                maxMoney: mMoney,
                currentMoney: cMoney,
                requiredHacking: reqHack,
                growth: growth,
                minSecurity: minSec,
                baseSecurity: baseSec,
                hackTime: hTime,
                growTime: gTime,
                weakenTime: wTime,
                hackPercent: hPercent,
                weakenAmount: wAmount
            };

            // 2. 가공 데이터 계산 (Processed Metrics)
            const hTimeSec = hTime / 1000;
            const gTimeSec = gTime / 1000;
            const wTimeSec = wTime / 1000;
            
            const hAmount = cMoney * hPercent;
            const hMaxAmount = mMoney * hPercent;
            const gRatio = mMoney > cMoney ? mMoney / Math.max(cMoney, 1) : 1;
            const gThreadsToMax = ns.growthAnalyze(current, gRatio);
            
            // 성장 화력(Power) 계산: 1스레드당 늘어나는 배율
            const gThreads2x = ns.growthAnalyze(current, 2);
            const gPower = (Math.pow(2, 1 / Math.max(gThreads2x, 1)) - 1);

            // [HGW Minimum Integer Ratio Analysis] - 가장 작은 단위를 1로 맞춘 정수 비율
            const targetPct = 0.01; 
            const tH_raw = targetPct / Math.max(hPercent, 0.000001);
            const tG_raw = ns.growthAnalyze(current, 1 / (1 - (tH_raw * hPercent)));
            const tW_raw = (tH_raw * 0.002 + tG_raw * 0.004) / wAmount;
            
            // 비율 정규화: 최솟값을 찾아 전체를 나눔 (0 제외)
            const minT = Math.min(tH_raw, tG_raw > 0 ? tG_raw : 999, tW_raw > 0 ? tW_raw : 999);
            const rH = Math.max(Math.floor(tH_raw / minT), 1);
            const rG = Math.max(Math.ceil(tG_raw / minT), 1);
            const rW = Math.max(Math.ceil(tW_raw / minT), 1);
            
            // [Batch Performance Analysis] - 최소 단위 유닛 성능 측정
            const batchMoney = (rH * hPercent) * mMoney;
            const batchRam = (rH * 1.70) + (rG * 1.75) + (rW * 1.75);
            const efficiency = batchMoney / (batchRam * wTimeSec);

            analysisDB[current] = {
                hostname: current,
                // [Hacking Speed]
                hackAmount: hAmount,
                hackSpeed: hAmount / hTimeSec,
                maxHackSpeed: hMaxAmount / hTimeSec,
                hackSecSpeed: 0.002 / hTimeSec,
                
                // [Growth Speed]
                growthThreadsToMax: gThreadsToMax,
                curGrowSpeed: (cMoney * gPower) / gTimeSec,
                maxGrowSpeed: (mMoney * gPower) / gTimeSec,
                growSecSpeed: 0.004 / gTimeSec,
                
                // [Security Speed]
                weakenSpeed: wAmount / wTimeSec,
                
                // [Batch Ratios] - Smallest Integer Ratio (e.g., 10:2:1)
                ratioH: rH,
                ratioG: rG,
                ratioW: rW,

                // [Batch Tactics] - Unit Performance
                batchMoney: batchMoney,
                batchRam: batchRam,
                efficiency: efficiency, 
                
                // [Status]
                moneyPercent: (cMoney / Math.max(mMoney, 1)) * 100
            };

        } catch (e) {
            ns.tprint(`[Warning] Error scanning ${current}: ${e}`);
        }
    }

    // 3. 파일 저장
    const dbPath = "/euoom/analyze/db.json";
    const anaPath = "/euoom/analyze/analysis.json";
    
    ns.write(dbPath, JSON.stringify(rawDB, null, 4), "w");
    ns.write(anaPath, JSON.stringify(analysisDB, null, 4), "w");

    ns.tprint(`------------------------------------------`);
    ns.tprint(`Scan Complete. Data separated!`);
    ns.tprint(`- Pure API Data: ${dbPath}`);
    ns.tprint(`- Processed Metrics: ${anaPath}`);
    ns.tprint(`Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
    ns.tprint(`------------------------------------------`);
}
