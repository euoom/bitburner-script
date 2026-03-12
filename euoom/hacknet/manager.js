/** @param {NS} ns */
export async function main(ns) {
    // BUILD_VERSION: 20260312_1245
    ns.disableLog('ALL');

    const MAX_PAYBACK_TIME_SECONDS = 3600 * 2;
    const statsFile = "/euoom/hacknet/stats.json";
    const host = ns.getHostname();

    let totalInvested = 0;
    let history = [];
    let lastWaitTarget = ""; // 같은 대상을 기다릴 때 로그 중복 출력 방지

    if (ns.fileExists(statsFile)) {
        try {
            const savedData = JSON.parse(ns.read(statsFile));
            totalInvested = savedData.totalInvested || 0;
            history = savedData.history || [];
        } catch (e) {}
    }

    function saveStats(newRecord, avgPayback, nextPayback) {
        if (newRecord) {
            let avgText = "N/A";
            let diffText = "🆕 Initial";
            
            // avgPayback이 UINT32_MAX보다 작을 때만 숫자로 표시
            if (avgPayback > 0 && avgPayback < 4000000000) {
                avgText = `${Math.floor(avgPayback / 60)}m`;
                const diff = nextPayback - avgPayback;
                diffText = diff > 0 
                    ? `📈 Efficiency Drop: +${Math.floor(diff/60)}m` 
                    : `📉 Efficiency Gain: ${Math.abs(Math.floor(diff/60))}m`;
            }

            ns.tprint(`[${host}] 💸 Purchased: ${newRecord.target} ($${ns.formatNumber(newRecord.cost, 2)})`);
            ns.tprint(`[${host}] 📊 Avg Payback: ${avgText} -> Item: ${Math.floor(nextPayback / 60)}m (${diffText})`);
            
            totalInvested += newRecord.cost;
            history.push({ time: new Date().toLocaleString(), ...newRecord });
            if (history.length > 100) history.shift();
        }
        ns.write(statsFile, JSON.stringify({ totalInvested, history }, null, 2), "w");
    }

    function getProdIncrease(level, ram, cores, newLevel, newRam, newCores) {
        const mult = ns.getHacknetMultipliers().production;
        const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
        const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
        return nextProd - currentProd;
    }

    ns.tprint(`[${host}] 🚀 Hacknet Manager (v1.2) active in background.`);

    while (true) {
        let bestOption = null;
        let minPaybackTime = Infinity;
        const numNodes = ns.hacknet.numNodes();

        // ROI 분석 로직
        const newNodeCost = ns.hacknet.getPurchaseNodeCost();
        const newNodeProd = getProdIncrease(0, 0, 0, 1, 1, 1);
        if (newNodeCost / newNodeProd < minPaybackTime) {
            minPaybackTime = newNodeCost / newNodeProd;
            bestOption = { type: 'node', cost: newNodeCost, prod: newNodeProd, text: "New Node" };
        }

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

        // 실행
        if (bestOption && (minPaybackTime < MAX_PAYBACK_TIME_SECONDS || numNodes === 0)) {
            const myMoney = ns.getServerMoneyAvailable("home");
            if (myMoney >= bestOption.cost) {
                let currentTotalProd = 0;
                for (let j = 0; j < ns.hacknet.numNodes(); j++) currentTotalProd += ns.hacknet.getNodeStats(j).production;
                
                const avgPayback = (currentTotalProd > 0 && totalInvested > 0) ? (totalInvested / currentTotalProd) : 4294967295;
                const nextPayback = bestOption.cost / bestOption.prod;

                let success = false;
                if (bestOption.type === 'node') success = ns.hacknet.purchaseNode() !== -1;
                if (bestOption.type === 'level') success = ns.hacknet.upgradeLevel(bestOption.index, 1);
                if (bestOption.type === 'ram') success = ns.hacknet.upgradeRam(bestOption.index, 1);
                if (bestOption.type === 'core') success = ns.hacknet.upgradeCore(bestOption.index, 1);
                
                if (success) {
                    saveStats({ type: bestOption.type, target: bestOption.text, cost: bestOption.cost }, avgPayback, nextPayback);
                    lastWaitTarget = ""; // 구매 성공 시 대기 로그 리셋
                }
            } else {
                // 돈이 부족할 때 터미널에 "딱 한 번만" 대기 로그 출력 (Silent 유지하되 생존 신고)
                if (lastWaitTarget !== bestOption.text) {
                    const need = bestOption.cost - myMoney;
                    ns.tprint(`[${host}] ⏳ Waiting for funds: ${bestOption.text} ($${ns.formatNumber(bestOption.cost, 2)}). Need $${ns.formatNumber(need, 2)} more...`);
                    lastWaitTarget = bestOption.text;
                }
            }
        }

        await ns.sleep(1000);
    }
}
