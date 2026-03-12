/** @param {NS} ns */
export async function main(ns) {
    // BUILD_VERSION: 20260312_1320 (Slim v1.4)
    ns.ramOverride(1.6);
    ns.disableLog('ALL');

    const MAX_PAYBACK_TIME_SECONDS = 3600 * 2;
    const statsFile = "/euoom/hacknet/stats.json";
    
    // 램 절약을 위한 동적 객체 확보
    const hn = ns["hacknet"];
    const host = ns["getHostname"]();

    let totalInvested = 0;
    let history = [];
    let lastWaitTarget = "";

    // 램 절약을 위해 파일 읽기/체크도 동적 호출
    if (ns["fileExists"](statsFile)) {
        try {
            const savedData = JSON.parse(ns["read"](statsFile));
            totalInvested = savedData.totalInvested || 0;
            history = savedData.history || [];
        } catch (e) {}
    }

    /** 현재 시간을 [HH:mm:ss] 포맷으로 반환 */
    function getTS() {
        const d = new Date();
        return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}]`;
    }

    function saveStats(newRecord, avgPayback, nextPayback) {
        if (newRecord) {
            let avgText = "N/A";
            let diffText = "🆕 Initial";
            
            if (avgPayback > 0 && avgPayback < 4000000000) {
                avgText = `${Math.floor(avgPayback / 60)}m`;
                const diff = nextPayback - avgPayback;
                diffText = diff > 0 
                    ? `📈 Efficiency Drop: +${Math.floor(diff/60)}m` 
                    : `📉 Efficiency Gain: ${Math.abs(Math.floor(diff/60))}m`;
            }

            ns.tprint(`${getTS()} [${host}] 💸 Purchased: ${newRecord.target} ($${ns.formatNumber(newRecord.cost, 2)})`);
            ns.tprint(`${getTS()} [${host}] 📊 Avg Payback: ${avgText} -> Item: ${Math.floor(nextPayback / 60)}m (${diffText})`);
            
            totalInvested += newRecord.cost;
            history.push({ time: new Date().toLocaleString(), ...newRecord });
            if (history.length > 100) history.shift();
        }
        ns["write"](statsFile, JSON.stringify({ totalInvested, history }, null, 2), "w");
    }

    function getProdIncrease(level, ram, cores, newLevel, newRam, newCores) {
        const mult = ns["getHacknetMultipliers"]().production;
        const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
        const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
        return nextProd - currentProd;
    }

    ns.tprint(`${getTS()} [${host}] 🚀 Hacknet Manager (v1.4 Slim) active in background. [RAM: 1.60GB]`);

    while (true) {
        let bestOption = null;
        let minPaybackTime = Infinity;
        const numNodes = hn["numNodes"]();

        const newNodeCost = hn["getPurchaseNodeCost"]();
        const newNodeProd = getProdIncrease(0, 0, 0, 1, 1, 1);
        if (newNodeCost / newNodeProd < minPaybackTime) {
            minPaybackTime = newNodeCost / newNodeProd;
            bestOption = { type: 'node', cost: newNodeCost, prod: newNodeProd, text: "New Node" };
        }

        for (let i = 0; i < numNodes; i++) {
            const stats = hn["getNodeStats"](i);
            const lvlCost = hn["getLevelUpgradeCost"](i, 1);
            const lvlProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level + 1, stats.ram, stats.cores);
            if (lvlCost / lvlProd < minPaybackTime) {
                minPaybackTime = lvlCost / lvlProd;
                bestOption = { type: 'level', index: i, cost: lvlCost, prod: lvlProd, text: `Node ${i} Level` };
            }
            const ramCost = hn["getRamUpgradeCost"](i, 1);
            const ramProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram * 2, stats.cores);
            if (ramCost / ramProd < minPaybackTime) {
                minPaybackTime = ramCost / ramProd;
                bestOption = { type: 'ram', index: i, cost: ramCost, prod: ramProd, text: `Node ${i} RAM` };
            }
            const coreCost = hn["getCoreUpgradeCost"](i, 1);
            const coreProd = getProdIncrease(stats.level, stats.ram, stats.cores, stats.level, stats.ram, stats.cores + 1);
            if (coreCost / coreProd < minPaybackTime) {
                minPaybackTime = coreCost / coreProd;
                bestOption = { type: 'core', index: i, cost: coreCost, prod: coreProd, text: `Node ${i} Core` };
            }
        }

        if (bestOption && (minPaybackTime < MAX_PAYBACK_TIME_SECONDS || numNodes === 0)) {
            const myMoney = ns["getServerMoneyAvailable"]("home");
            if (myMoney >= bestOption.cost) {
                let currentTotalProd = 0;
                for (let j = 0; j < hn["numNodes"](); j++) currentTotalProd += hn["getNodeStats"](j).production;
                
                const avgPayback = (currentTotalProd > 0 && totalInvested > 0) ? (totalInvested / currentTotalProd) : 4294967295;
                const nextPayback = bestOption.cost / bestOption.prod;

                let success = false;
                if (bestOption.type === 'node') success = hn["purchaseNode"]() !== -1;
                if (bestOption.type === 'level') success = hn["upgradeLevel"](bestOption.index, 1);
                if (bestOption.type === 'ram') success = hn["upgradeRam"](bestOption.index, 1);
                if (bestOption.type === 'core') success = hn["upgradeCore"](bestOption.index, 1);
                
                if (success) {
                    saveStats({ type: bestOption.type, target: bestOption.text, cost: bestOption.cost }, avgPayback, nextPayback);
                    lastWaitTarget = "";
                }
            } else {
                if (lastWaitTarget !== bestOption.text) {
                    const need = bestOption.cost - myMoney;
                    ns.tprint(`${getTS()} [${host}] ⏳ Waiting for funds: ${bestOption.text} ($${ns.formatNumber(bestOption.cost, 2)}). Need $${ns.formatNumber(need, 2)} more...`);
                    lastWaitTarget = bestOption.text;
                }
            }
        }

        await ns.sleep(1000);
    }
}
