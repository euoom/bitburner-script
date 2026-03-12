/** @param {NS} ns */
/** 
 * 핵넷 관리 시스템 (Library Version)
 * 램 효율을 위해 동적 프로퍼티 접근(ns["hacknet"]) 방식을 사용합니다.
 */

export const getHN = (ns) => ns["hacknet"];

function getProdIncrease(ns, level, ram, cores, newLevel, newRam, newCores) {
    const hn = getHN(ns);
    const mult = hn["getHacknetMultipliers"]().production;
    const currentProd = level * 1.5 * Math.pow(1.035, ram - 1) * ((cores + 5) / 6) * mult;
    const nextProd = newLevel * 1.5 * Math.pow(1.035, newRam - 1) * ((newCores + 5) / 6) * mult;
    return nextProd - currentProd;
}

/**
 * 핵넷의 1개 지표를 검토하고 필요 시 업그레이드합니다.
 * @param {NS} ns 
 * @param {Object} state - 현재 상태 객체 { totalInvested, lastWaitTarget }
 * @param {Object} config - 설정 객체 { maxPayback, logFile, quiet }
 */
export function tickHacknet(ns, state, config = {}) {
    const hn = getHN(ns);
    const quiet = config.quiet || false;
    const logFile = config.logFile || "/euoom/hacknet/hacknet.txt";

    // [Step 1] 현재 포트폴리오 효율 분석
    let currentTotalProd = 0;
    for (let j = 0; j < hn["numNodes"](); j++) currentTotalProd += hn["getNodeStats"](j).production;
    
    // 현재 평균 회수 시간 (초)
    const avgPayback = (currentTotalProd > 0 && state.totalInvested > 0) ? (state.totalInvested / currentTotalProd) : 0;
    
    // [Step 2] 동적 임계치 결정 (사용자 전략: 평균의 2배)
    // - 데이터가 없는 초반에는 config.maxPayback(기본 2시간)을 사용
    const DYNAMIC_MAX_PAYBACK = avgPayback > 0 ? (avgPayback * 2) : (config.maxPayback || 3600 * 2);

    let bestOption = null;
    let minPaybackTime = Infinity;
    const numNodes = hn["numNodes"]();

    // 1. 새 노드 구매 비용/효율 계산
    const newNodeCost = hn["getPurchaseNodeCost"]();
    const newNodeProd = getProdIncrease(ns, 0, 0, 0, 1, 1, 1);
    if (newNodeCost / newNodeProd < minPaybackTime) {
        minPaybackTime = newNodeCost / newNodeProd;
        bestOption = { type: 'node', cost: newNodeCost, prod: newNodeProd, text: "New Node" };
    }

    // 2. 기존 노드 업그레이드 효율 계산
    for (let i = 0; i < numNodes; i++) {
        const stats = hn["getNodeStats"](i);
        
        // Level
        const lvlCost = hn["getLevelUpgradeCost"](i, 1);
        const lvlProd = getProdIncrease(ns, stats.level, stats.ram, stats.cores, stats.level + 1, stats.ram, stats.cores);
        if (lvlCost / lvlProd < minPaybackTime) {
            minPaybackTime = lvlCost / lvlProd;
            bestOption = { type: 'level', index: i, cost: lvlCost, prod: lvlProd, text: `Node ${i} Level` };
        }
        
        // RAM
        const ramCost = hn["getRamUpgradeCost"](i, 1);
        const ramProd = getProdIncrease(ns, stats.level, stats.ram, stats.cores, stats.level, stats.ram * 2, stats.cores);
        if (ramCost / ramProd < minPaybackTime) {
            minPaybackTime = ramCost / ramProd;
            bestOption = { type: 'ram', index: i, cost: ramCost, prod: ramProd, text: `Node ${i} RAM` };
        }
        
        // Cores
        const coreCost = hn["getCoreUpgradeCost"](i, 1);
        const coreProd = getProdIncrease(ns, stats.level, stats.ram, stats.cores, stats.level, stats.ram, stats.cores + 1);
        if (coreCost / coreProd < minPaybackTime) {
            minPaybackTime = coreCost / coreProd;
            bestOption = { type: 'core', index: i, cost: coreCost, prod: coreProd, text: `Node ${i} Core` };
        }
    }

    // 3. 실행 판단
    if (bestOption && (minPaybackTime < DYNAMIC_MAX_PAYBACK || numNodes === 0)) {
        const myMoney = ns["getServerMoneyAvailable"]("home");
        if (myMoney >= bestOption.cost) {
            let success = false;
            if (bestOption.type === 'node') success = hn["purchaseNode"]() !== -1;
            if (bestOption.type === 'level') success = hn["upgradeLevel"](bestOption.index, 1);
            if (bestOption.type === 'ram') success = hn["upgradeRam"](bestOption.index, 1);
            if (bestOption.type === 'core') success = hn["upgradeCore"](bestOption.index, 1);
            
            if (success) {
                // 상단에서 계산한 avgPayback 재사용
                const nextPayback = bestOption.cost / bestOption.prod;
                
                let efficiencyDesc = "Initial";
                if (avgPayback > 0) {
                    const diff = nextPayback - avgPayback;
                    const absDiff = Math.abs(diff);
                    
                    if (absDiff < 0.1) {
                        efficiencyDesc = "Stable";
                    } else {
                        const sign = diff > 0 ? "Drop +" : "Gain ";
                        const val = absDiff >= 60 
                            ? `${(absDiff / 60).toFixed(1)}m` 
                            : `${absDiff.toFixed(1)}s`;
                        efficiencyDesc = sign + val;
                    }
                }

                const logEntry = {
                    ts: new Date().toISOString(),
                    type: bestOption.type,
                    name: bestOption.text,
                    cost: bestOption.cost,
                    desc: efficiencyDesc
                };

                state.totalInvested += bestOption.cost;
                state.lastWaitTarget = "";
                
                if (!quiet) ns.tprint(`[Hacknet] Purchased ${bestOption.text} ($${ns.formatNumber(bestOption.cost, 2)}) -> ${efficiencyDesc}`);
                
                // JSONL 방식으로 한 줄씩 추가 (Append)
                ns["write"](logFile, JSON.stringify(logEntry) + "\n", "a");
            }
        } else {
            if (state.lastWaitTarget !== bestOption.text && !quiet) {
                const need = bestOption.cost - myMoney;
                ns.print(`⏳ Waiting for ${bestOption.text} ($${ns.formatNumber(bestOption.cost, 2)}). Need $${ns.formatNumber(need, 2)} more...`);
                state.lastWaitTarget = bestOption.text;
            }
        }
    }
    
    return state;
}
