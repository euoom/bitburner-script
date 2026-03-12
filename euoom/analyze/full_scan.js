/** @param {NS} ns */
export async function main(ns) {
    const startTime = Date.now();
    const rawDB = {};     // API 순수 데이터 (db.json)
    
    const visited = new Set();
    const queue = ["home"];
    const myHackLevel = ns.getHackingLevel();
    const targets = {};  // 실시간 공격 가능 서버 (정밀 분석)
    const others = {};   // 현재 공격 불가능/무의미한 서버 (기초 정보)

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
            const cMoney = ns.getServerMoneyAvailable(current);
            const mMoney = ns.getServerMaxMoney(current);
            const reqHack = ns.getServerRequiredHackingLevel(current);
            
            // 1. 순수 데이터 수집 (db.json용)
            rawDB[current] = {
                hostname: current,
                maxMoney: mMoney,
                requiredHacking: reqHack,
                maxRam: ns.getServerMaxRam(current),
                growth: ns.getServerGrowth(current),
                minSecurity: ns.getServerMinSecurityLevel(current)
            };

            // 2. 가공 데이터 및 그룹화 (analysis.json용)
            const isTargetable = myHackLevel >= reqHack && mMoney > 0;

            if (isTargetable) {
                // [공격 가능군: 정밀 분석 수행]
                const hTime = ns.getHackTime(current);
                const gTime = ns.getGrowTime(current);
                const wTime = ns.getWeakenTime(current);
                const hPercent = ns.hackAnalyze(current);
                const wAmount = ns.weakenAnalyze(1);
                
                const hTimeSec = hTime / 1000;
                const gTimeSec = gTime / 1000;
                const wTimeSec = wTime / 1000;

                const gThreads2x = ns.growthAnalyze(current, 2);
                const gPower = (Math.pow(2, 1 / Math.max(gThreads2x, 1)) - 1);
                
                // [HGW Weaken-Anchored Ratio Analysis]
                const targetPct = 0.01; 
                const tH_raw = targetPct / Math.max(hPercent, 0.000001);
                const tG_raw = ns.growthAnalyze(current, 1 / (1 - (tH_raw * hPercent)));
                const tW_raw = (tH_raw * 0.002 + tG_raw * 0.004) / wAmount;
                const anchor = tW_raw;
                
                const rH = Math.max(Math.floor(tH_raw / anchor), 1);
                const rG = Math.max(Math.ceil(tG_raw / anchor), 1);
                const rW = 1;
                
                const batchMoney = (rH * hPercent) * mMoney;
                const batchRam = (rH * 1.70) + (rG * 1.75) + (rW * 1.75);
                const efficiency = batchMoney / (batchRam * wTimeSec);

                // 시나리오별 사이클 시간 계산 (초)
                const batchTime = wTimeSec;
                const loopTime = (rH * hTimeSec) + (rG * gTimeSec) + (rW * wTimeSec);

                targets[current] = {
                    hostname: current,
                    requiredHacking: reqHack,
                    maxMoney: mMoney,
                    ratioH: rH,
                    ratioG: rG,
                    ratioW: rW,
                    batchMoney: batchMoney,
                    batchRam: batchRam,
                    batchTime: batchTime, // 병렬 배치 시간
                    loopTime: loopTime,   // 순차 반복 시간
                    efficiency: efficiency,
                    moneyPercent: mMoney > 0 ? (cMoney / mMoney) * 100 : 0
                };
            } else {
                // [공격 불가능/무의미군: 최소 정보만 저장]
                others[current] = {
                    hostname: current,
                    requiredHacking: reqHack,
                    maxMoney: mMoney,
                    reason: mMoney === 0 ? "No Money" : `Low Hack Level (Need ${reqHack})`
                };
            }
        } catch (e) {
            ns.tprint(`[Warning] Error scanning ${current}: ${e}`);
        }
    }

    // 3. 파일 저장
    const dbPath = "/euoom/analyze/db.json";
    const anaPath = "/euoom/analyze/analysis.json";
    
    ns.write(dbPath, JSON.stringify(rawDB, null, 4), "w");
    ns.write(anaPath, JSON.stringify({ targets, others }, null, 4), "w");

    ns.tprint(`------------------------------------------`);
    ns.tprint(`Scan Complete. Data separated!`);
    ns.tprint(`- Pure API Data: ${dbPath}`);
    ns.tprint(`- Processed Metrics: ${anaPath}`);
    ns.tprint(`Duration: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
    ns.tprint(`------------------------------------------`);
}
