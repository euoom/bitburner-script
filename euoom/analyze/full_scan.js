/** @param {NS} ns */
export async function main(ns) {
    const startTime = Date.now();
    const networkDB = {};
    const visited = new Set();
    const queue = ["home"];

    ns.tprint("=== Starting Full Network Precision Scan ===");

    // 1. BFS를 이용한 전수 조사 시작
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current)) continue;
        visited.add(current);

        // 인접 서버 큐에 추가
        const neighbors = ns.scan(current);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }

        // 2. 현재 서버의 정밀 데이터 추출 (정공법)
        // home 서버를 제외한 모든 서버의 데이터를 수집합니다.
        if (current !== "home") {
            try {
                // 변수 추출 및 최적화
                const currentMoney = ns.getServerMoneyAvailable(current);
                const maxMoney = ns.getServerMaxMoney(current);
                const growthRatio = maxMoney > currentMoney ? maxMoney / Math.max(currentMoney, 1) : 1;
                
                const hTimeSec = ns.getHackTime(current) / 1000;
                const gTimeSec = ns.getGrowTime(current) / 1000;
                const wTimeSec = ns.getWeakenTime(current) / 1000;

                const hPercent = ns.hackAnalyze(current);
                const hAmount = currentMoney * hPercent;
                const wAmount = ns.weakenAnalyze(1);
                const gThreadsToMax = ns.growthAnalyze(current, growthRatio);

                networkDB[current] = {
                    // [Infrastructure]
                    hostname: current,
                    maxRam: ns.getServerMaxRam(current),
                    numPortsRequired: ns.getServerNumPortsRequired(current),
                    
                    // [Hacking]
                    maxMoney: maxMoney,
                    currentMoney: currentMoney,
                    requiredHacking: ns.getServerRequiredHackingLevel(current),
                    hackTime: ns.getHackTime(current),
                    hackPercent: hPercent, 
                    hackAmount: hAmount,
                    hackSpeed: hAmount / hTimeSec,
                    
                    // [Growth]
                    growth: ns.getServerGrowth(current),
                    growTime: ns.getGrowTime(current),
                    growthThreadsToMax: gThreadsToMax,
                    growSpeed: (maxMoney - currentMoney) / (Math.max(gThreadsToMax, 1) * gTimeSec),
                    
                    // [Security]
                    minSecurity: ns.getServerMinSecurityLevel(current),
                    baseSecurity: ns.getServerBaseSecurityLevel(current),
                    weakenTime: ns.getWeakenTime(current),
                    weakenAmount: wAmount,
                    weakenSpeed: wAmount / wTimeSec
                };
            } catch (e) {
                ns.tprint(`[Warning] Failed to scan stats for ${current}: ${e}`);
            }
        }
    }

    // 3. 수집된 데이터를 JSON 형식으로 저장
    const resultPath = "/euoom/server/network_db.json";
    const jsonData = JSON.stringify(networkDB, null, 4);
    
    ns.write(resultPath, jsonData, "w");

    // 4. 결과 보고
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    ns.tprint(`------------------------------------------`);
    ns.tprint(`Success! Scanned ${visited.size} servers.`);
    ns.tprint(`Data saved at: ${resultPath}`);
    ns.tprint(`Duration: ${duration}s`);
    ns.tprint(`------------------------------------------`);
}
