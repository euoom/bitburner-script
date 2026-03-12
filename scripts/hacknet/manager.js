/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    
    // 인자로 --debug가 들어오면 분석만 하고 구매는 하지 않습니다.
    const isDebug = ns.args.includes('--debug');
    const MAX_PAYBACK_TIME_SECONDS = 3600 * 2; 

    /** 수입 증가량 계산 함수 (Hacknet 수입 공식 기반) */
    function getProdIncrease(level, ram, cores, newLevel, newRam, newCores) {
        // 정밀 분석을 위해 멀티플라이어를 다시 사용합니다 (4GB RAM 사용)
        const mult = ns.getHacknetMultipliers().production;
        const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
        const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
        return nextProd - currentProd;
    }

    if (isDebug) {
        ns.tprint("[DEBUG MODE] Hacknet Analyzer started. Opening log window...");
        ns.tail(); // 자동으로 로그 창을 띄웁니다.
        ns.resizeTail(450, 250); 
    }

    while (true) {
        let bestOption = null;
        let minPaybackTime = Infinity;

        // 1. 새로운 노드 구입 검토
        const newNodeCost = ns.hacknet.getPurchaseNodeCost();
        const newNodeProd = getProdIncrease(0, 0, 0, 1, 1, 1); 
        const newNodePayback = newNodeCost / newNodeProd;
        
        if (newNodePayback < minPaybackTime) {
            minPaybackTime = newNodePayback;
            bestOption = { type: 'node', cost: newNodeCost, text: "New Node" };
        }

        // 2. 기존 노드 업그레이드 검토
        const numNodes = ns.hacknet.numNodes();
        for (let i = 0; i < numNodes; i++) {
            const stats = ns.hacknet.getNodeStats(i);

            const lvlCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            const lvlProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level + 1, stats.ram, stats.cores);
            if (lvlCost / lvlProd < minPaybackTime) {
                minPaybackTime = lvlCost / lvlProd;
                bestOption = { type: 'level', index: i, cost: lvlCost, text: `Node ${i} Level` };
            }

            const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            const ramProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram * 2, stats.cores);
            if (ramCost / ramProd < minPaybackTime) {
                minPaybackTime = ramCost / ramProd;
                bestOption = { type: 'ram', index: i, cost: ramCost, text: `Node ${i} RAM` };
            }

            const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const coreProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram, stats.cores + 1);
            if (coreCost / coreProd < minPaybackTime) {
                minPaybackTime = coreCost / coreProd;
                bestOption = { type: 'core', index: i, cost: coreCost, text: `Node ${i} Core` };
            }
        }

        // 3. 최적의 옵션 보고 및 실행
        ns.clearLog();
        const host = ns.getHostname();
        ns.print(`[${host}] --- Hacknet Investment Analyzer ---`);
        if (isDebug) ns.print(`⚠️ DEBUG MODE: Analysis Only`);

        if (bestOption) {
            const timeLeft = Math.floor(minPaybackTime);
            ns.print(`Next Best: ${bestOption.text}`);
            ns.print(`Cost: $${bestOption.cost.toLocaleString()}`);
            ns.print(`Payback: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`);

            if (minPaybackTime < MAX_PAYBACK_TIME_SECONDS) {
                if (ns.getServerMoneyAvailable("home") >= bestOption.cost) {
                    if (!isDebug) {
                        ns.print(`💰 Purchasing upgrade...`);
                        if (bestOption.type === 'node') ns.hacknet.purchaseNode();
                        if (bestOption.type === 'level') ns.hacknet.upgradeLevel(bestOption.index, 1);
                        if (bestOption.type === 'ram') ns.hacknet.upgradeRam(bestOption.index, 1);
                        if (bestOption.type === 'core') ns.hacknet.upgradeCore(bestOption.index, 1);
                    } else {
                        ns.print(`ℹ️ [DEBUG] Afford check passed, but skipping purchase.`);
                    }
                } else {
                    ns.print(`⏳ Waiting for money...`);
                }
            } else {
                ns.print(`✅ Optimal for now (Payback > 2h)`);
            }
        }

        await ns.sleep(isDebug ? 5000 : 1000); // 디버그 모드일 때는 5초마다 갱신
    }
}
