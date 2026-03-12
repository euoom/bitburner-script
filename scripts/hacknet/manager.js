/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    const MAX_PAYBACK_TIME_SECONDS = 3600 * 2; // 본전 뽑는 시간이 2시간 이내일 때만 자동 구매

    /** 수입 증가량 계산 함수 (Hacknet 수입 공식 기반) */
    function getProdIncrease(level, ram, cores, newLevel, newRam, newCores) {
        const mult = ns.getHacknetMultipliers().production;
        const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
        const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
        return nextProd - currentProd;
    }

    while (true) {
        let bestOption = null;
        let minPaybackTime = Infinity;

        // 1. 새로운 노드 구입 검토
        const newNodeCost = ns.hacknet.getPurchaseNodeCost();
        const newNodeProd = getProdIncrease(0, 0, 0, 1, 1, 1); // 1레벨 노드 수입
        const newNodePayback = newNodeCost / newNodeProd;
        
        if (newNodePayback < minPaybackTime) {
            minPaybackTime = newNodePayback;
            bestOption = { type: 'node', cost: newNodeCost, text: "New Node" };
        }

        // 2. 기존 노드 업그레이드 검토
        const numNodes = ns.hacknet.numNodes();
        for (let i = 0; i < numNodes; i++) {
            const stats = ns.hacknet.getNodeStats(i);

            // Level 업그레이드
            const lvlCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            const lvlProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level + 1, stats.ram, stats.cores);
            if (lvlCost / lvlProd < minPaybackTime) {
                minPaybackTime = lvlCost / lvlProd;
                bestOption = { type: 'level', index: i, cost: lvlCost, text: `Node ${i} Level` };
            }

            // RAM 업그레이드
            const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            const ramProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram * 2, stats.cores);
            if (ramCost / ramProd < minPaybackTime) {
                minPaybackTime = ramCost / ramProd;
                bestOption = { type: 'ram', index: i, cost: ramCost, text: `Node ${i} RAM` };
            }

            // Core 업그레이드
            const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const coreProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram, stats.cores + 1);
            if (coreCost / coreProd < minPaybackTime) {
                minPaybackTime = coreCost / coreProd;
                bestOption = { type: 'core', index: i, cost: coreCost, text: `Node ${i} Core` };
            }
        }

        // 3. 최적의 옵션 실행 여부 결정
        ns.clearLog();
        ns.print(`--- Hacknet Investment Manager ---`);
        if (bestOption && minPaybackTime < MAX_PAYBACK_TIME_SECONDS) {
            const timeLeft = Math.floor(minPaybackTime);
            ns.print(`Next Best: ${bestOption.text}`);
            ns.print(`Cost: $${bestOption.cost.toLocaleString()}`);
            ns.print(`Payback: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`);

            if (ns.getServerMoneyAvailable("home") >= bestOption.cost) {
                ns.print(`💰 Purchasing upgrade...`);
                if (bestOption.type === 'node') ns.hacknet.purchaseNode();
                if (bestOption.type === 'level') ns.hacknet.upgradeLevel(bestOption.index, 1);
                if (bestOption.type === 'ram') ns.hacknet.upgradeRam(bestOption.index, 1);
                if (bestOption.type === 'core') ns.hacknet.upgradeCore(bestOption.index, 1);
            } else {
                ns.print(`⏳ Waiting for money...`);
            }
        } else {
            ns.print(`✅ Hacknet is optimal for now (Payback > 2h)`);
        }

        await ns.sleep(1000);
    }
}
