/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');

    const MAX_PAYBACK_TIME_SECONDS = 3600 * 2;
    const statsFile = "/euoom/hacknet/stats.json";
    const host = ns.getHostname();

    let totalInvested = 0;
    let history = [];

    // 저장된 데이터 불러오기
    if (ns.fileExists(statsFile)) {
        try {
            const savedData = JSON.parse(ns.read(statsFile));
            totalInvested = savedData.totalInvested || 0;
            history = savedData.history || [];
        } catch (e) {
            // 파일 읽기 실패 시 초기화
        }
    }

    /** 데이터 저장 및 터미널 출력 함수 */
    function saveStats(newRecord, avgPayback, nextPayback) {
        if (newRecord) {
            const record = {
                time: new Date().toLocaleString(),
                avgPaybackBefore: avgPayback,
                nextItemPayback: nextPayback,
                ...newRecord
            };
            history.push(record);
            
            // 효율성 지표 계산 (차이)
            const diff = nextPayback - avgPayback;
            const diffText = diff > 0 
                ? `📈 Efficiency Drop: +${Math.floor(diff/60)}m` 
                : `📉 Efficiency Gain: ${Math.floor(diff/60)}m`;

            // 메인 터미널 출력 최적화
            ns.tprint(`[${host}] 💸 Purchased: ${newRecord.target} ($${ns.formatNumber(newRecord.cost, 2)})`);
            ns.tprint(`[${host}] 📊 Avg Payback: ${Math.floor(avgPayback/60)}m -> Next Item: ${Math.floor(nextPayback/60)}m (${diffText})`);
            
            if (history.length > 100) history.shift();
        }
        
        const data = { 
            totalInvested: totalInvested,
            history: history
        };
        ns.write(statsFile, JSON.stringify(data, null, 2), "w");
    }

    /** 수입 증가량 계산 함수 */
    function getProdIncrease(level, ram, cores, newLevel, newRam, newCores) {
        const mult = ns.getHacknetMultipliers().production;
        const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
        const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
        return nextProd - currentProd;
    }

    ns.tprint(`[${host}] 🚀 Hacknet Manager started in background.`);

    while (true) {
        let bestOption = null;
        let minPaybackTime = Infinity;
        const numNodes = ns.hacknet.numNodes();

        // 1. 새로운 노드 구입 검토
        const newNodeCost = ns.hacknet.getPurchaseNodeCost();
        const newNodeProd = getProdIncrease(0, 0, 0, 1, 1, 1);
        const newNodePayback = newNodeCost / newNodeProd;

        if (newNodePayback < minPaybackTime) {
            minPaybackTime = newNodePayback;
            bestOption = { type: 'node', cost: newNodeCost, prod: newNodeProd, text: "New Node" };
        }

        // 2. 기존 노드 업그레이드 검토
        for (let i = 0; i < numNodes; i++) {
            const stats = ns.hacknet.getNodeStats(i);

            const lvlCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            const lvlProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level + 1, stats.ram, stats.cores);
            if (lvlCost / lvlProd < minPaybackTime) {
                minPaybackTime = lvlCost / lvlProd;
                bestOption = { type: 'level', index: i, cost: lvlCost, prod: lvlProd, text: `Node ${i} Level` };
            }

            const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            const ramProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram * 2, stats.cores);
            if (ramCost / ramProd < minPaybackTime) {
                minPaybackTime = ramCost / ramProd;
                bestOption = { type: 'ram', index: i, cost: ramCost, prod: ramProd, text: `Node ${i} RAM` };
            }

            const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const coreProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram, stats.cores + 1);
            if (coreCost / coreProd < minPaybackTime) {
                minPaybackTime = coreCost / coreProd;
                bestOption = { type: 'core', index: i, cost: coreCost, prod: coreProd, text: `Node ${i} Core` };
            }
        }

        // 3. 최적의 옵션 실행
        if (bestOption && (minPaybackTime < MAX_PAYBACK_TIME_SECONDS || numNodes === 0)) {
            if (ns.getServerMoneyAvailable("home") >= bestOption.cost) {
                let success = false;
                if (bestOption.type === 'node') success = ns.hacknet.purchaseNode() !== -1;
                if (bestOption.type === 'level') success = ns.hacknet.upgradeLevel(bestOption.index, 1);
                if (bestOption.type === 'ram') success = ns.hacknet.upgradeRam(bestOption.index, 1);
                if (bestOption.type === 'core') success = ns.hacknet.upgradeCore(bestOption.index, 1);
                
                if (success) {
                    // 현재 생산량 합산
                    let currentTotalProd = 0;
                    for (let j = 0; j < ns.hacknet.numNodes(); j++) {
                        currentTotalProd += ns.hacknet.getNodeStats(j).production;
                    }
                    
                    const avgPayback = currentTotalProd > 0 ? (totalInvested / currentTotalProd) : 0;
                    const nextPayback = bestOption.cost / bestOption.prod;

                    totalInvested += bestOption.cost;
                    saveStats({
                        type: bestOption.type,
                        target: bestOption.text,
                        cost: bestOption.cost
                    }, avgPayback, nextPayback);
                }
            }
        }

        await ns.sleep(1000);
    }
}
