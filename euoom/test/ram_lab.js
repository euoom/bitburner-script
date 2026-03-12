/** @param {NS} ns */
export async function main(ns) {
    const tests = [
        // --- [Level 1: Daily Hacking (0.1GB ~ 1.0GB)] ---
        { name: "Hack Analyze", path: "/euoom/test/functions/dynamic_hack.js", staticRam: 1.0 },
        { name: "Hack Chance", path: "/euoom/test/functions/dynamic_hackAnalyzeChance.js", staticRam: 0.1 },
        { name: "Hack Sec", path: "/euoom/test/functions/dynamic_hackAnalyzeSecurity.js", staticRam: 0.1 },
        { name: "Hack Threads", path: "/euoom/test/functions/dynamic_hackAnalyzeThreads.js", staticRam: 0.1 },
        { name: "Growth Ana", path: "/euoom/test/functions/dynamic_growthAnalyze.js", staticRam: 1.0 },
        { name: "Weaken Ana", path: "/euoom/test/functions/dynamic_weakenAnalyze.js", staticRam: 1.0 },
        
        // --- Stats & Info ---
        { name: "Get Sec Lvl", path: "/euoom/test/functions/dynamic_getServerSecurityLevel.js", staticRam: 0.1 },
        { name: "Get Money Avail", path: "/euoom/test/functions/dynamic_getServerMoneyAvailable.js", staticRam: 0.1 },
        { name: "Get Max Ram", path: "/euoom/test/functions/dynamic_getServerMaxRam.js", staticRam: 0.1 },
        { name: "Get Used Ram", path: "/euoom/test/functions/dynamic_getServerUsedRam.js", staticRam: 0.1 },
        { name: "Get Hack Time", path: "/euoom/test/functions/dynamic_getHackTime.js", staticRam: 0.05 },
        { name: "Get Grow Time", path: "/euoom/test/functions/dynamic_getGrowTime.js", staticRam: 0.05 },
        { name: "Get Weaken Time", path: "/euoom/test/functions/dynamic_getWeakenTime.js", staticRam: 0.05 },
        
        { name: "Scan", path: "/euoom/test/functions/dynamic_scan.js", staticRam: 0.2 },
        { name: "File Exists", path: "/euoom/test/functions/dynamic_fileExists.js", staticRam: 0.1 },
        { name: "Delete Srv", path: "/euoom/test/functions/dynamic_deleteServer.js", staticRam: 0.05 },
        { name: "Exec", path: "/euoom/test/functions/dynamic_exec.js", staticRam: 1.3 },
        { name: "FTP Crack", path: "/euoom/test/functions/dynamic_ftpcrack.js", staticRam: 0.05 },
        { name: "BitNode Mult", path: "/euoom/test/functions/dynamic_getBitNodeMultipliers.js", staticRam: 0.1 },
        { name: "Favor Donate", path: "/euoom/test/functions/dynamic_getFavorToDonate.js", staticRam: 0.1 },
        { name: "Hack Lvl", path: "/euoom/test/functions/dynamic_getHackingLevel.js", staticRam: 0.05 },
        { name: "Hack Mult", path: "/euoom/test/functions/dynamic_getHackingMultipliers.js", staticRam: 0.1 },
        { name: "HN Mult", path: "/euoom/test/functions/dynamic_getHacknetMultipliers.js", staticRam: 0.1 },
        { name: "Hostname", path: "/euoom/test/functions/dynamic_getHostname.js", staticRam: 0.05 },
        { name: "Money Src", path: "/euoom/test/functions/dynamic_getMoneySources.js", staticRam: 0.1 },
        
        { name: "PurSrv Cost", path: "/euoom/test/functions/dynamic_getPurchasedServerCost.js", staticRam: 0.05 },
        { name: "PurSrv Limit", path: "/euoom/test/functions/dynamic_getPurchasedServerLimit.js", staticRam: 0.05 },
        { name: "PurSrv MaxRam", path: "/euoom/test/functions/dynamic_getPurchasedServerMaxRam.js", staticRam: 0.05 },
        { name: "PurSrv Upgrade", path: "/euoom/test/functions/dynamic_getPurchasedServerUpgradeCost.js", staticRam: 0.05 },
        { name: "PurSrvs", path: "/euoom/test/functions/dynamic_getPurchasedServers.js", staticRam: 0.05 },
        { name: "Recent Scripts", path: "/euoom/test/functions/dynamic_getRecentScripts.js", staticRam: 0.05 },
        { name: "Reset Info", path: "/euoom/test/functions/dynamic_getResetInfo.js", staticRam: 0.1 },
        { name: "Running Script", path: "/euoom/test/functions/dynamic_getRunningScript.js", staticRam: 0.05 },
        { name: "Exp Gain", path: "/euoom/test/functions/dynamic_getScriptExpGain.js", staticRam: 0.05 },
        { name: "Script Income", path: "/euoom/test/functions/dynamic_getScriptIncome.js", staticRam: 0.1 },
        { name: "Script Ram", path: "/euoom/test/functions/dynamic_getScriptRam.js", staticRam: 0.1 },
        { name: "Base Sec", path: "/euoom/test/functions/dynamic_getServerBaseSecurityLevel.js", staticRam: 0.1 },
        { name: "Req Hack", path: "/euoom/test/functions/dynamic_getServerRequiredHackingLevel.js", staticRam: 0.1 },
        { name: "Share Power", path: "/euoom/test/functions/dynamic_getSharePower.js", staticRam: 0.1 },
        { name: "Last Aug", path: "/euoom/test/functions/dynamic_getTimeSinceLastAug.js", staticRam: 0.1 },
        { name: "Exp Gain Tot", path: "/euoom/test/functions/dynamic_getTotalScriptExpGain.js", staticRam: 0.1 },
        { name: "Income Tot", path: "/euoom/test/functions/dynamic_getTotalScriptIncome.js", staticRam: 0.1 },
        { name: "Grow", path: "/euoom/test/functions/dynamic_grow.js", staticRam: 0.175 },
        { name: "Growth Sec", path: "/euoom/test/functions/dynamic_growthAnalyzeSecurity.js", staticRam: 0.1 },
        { name: "Root Access", path: "/euoom/test/functions/dynamic_hasRootAccess.js", staticRam: 0.05 },
        { name: "Tor Router", path: "/euoom/test/functions/dynamic_hasTorRouter.js", staticRam: 0.05 },
        { name: "HTTP Worm", path: "/euoom/test/functions/dynamic_httpworm.js", staticRam: 0.05 },
        { name: "Running", path: "/euoom/test/functions/dynamic_isRunning.js", staticRam: 0.1 },
        { name: "Kill", path: "/euoom/test/functions/dynamic_kill.js", staticRam: 0.5 },
        { name: "Killall", path: "/euoom/test/functions/dynamic_killall.js", staticRam: 0.5 },
        { name: "LS", path: "/euoom/test/functions/dynamic_ls.js", staticRam: 0.2 },
        { name: "PS", path: "/euoom/test/functions/dynamic_ps.js", staticRam: 0.2 },
        { name: "Purchase Srv", path: "/euoom/test/functions/dynamic_purchaseServer.js", staticRam: 0.25 },
        { name: "RM", path: "/euoom/test/functions/dynamic_rm.js", staticRam: 0.1 },
        { name: "Run", path: "/euoom/test/functions/dynamic_run.js", staticRam: 1.0 },
        { name: "SCP", path: "/euoom/test/functions/dynamic_scp.js", staticRam: 0.6 },
        { name: "Script Kill", path: "/euoom/test/functions/dynamic_scriptKill.js", staticRam: 1.0 },
        { name: "Script Run", path: "/euoom/test/functions/dynamic_scriptRunning.js", staticRam: 1.0 },
        { name: "Server Exists", path: "/euoom/test/functions/dynamic_serverExists.js", staticRam: 0.1 },
        { name: "Share", path: "/euoom/test/functions/dynamic_share.js", staticRam: 0.1 },
        { name: "Spawn", path: "/euoom/test/functions/dynamic_spawn.js", staticRam: 1.0 },
        { name: "Upgrade PurSrv", path: "/euoom/test/functions/dynamic_upgradePurchasedServer.js", staticRam: 0.25 },
        { name: "Weaken", path: "/euoom/test/functions/dynamic_weaken.js", staticRam: 0.175 },

        // --- [Level 2: Heavy Server & Player (2.0GB ~ 4.0GB)] ---
        { name: "Get Server", path: "/euoom/test/functions/dynamic_getServer.js", staticRam: 2.0 },
        { name: "Get Player", path: "/euoom/test/functions/dynamic_getPlayer.js", staticRam: 0.5 },
        { name: "Hacknet API", path: "/euoom/test/functions/dynamic_hacknet.js", staticRam: 4.0 },
        { name: "Nuke", path: "/euoom/test/functions/dynamic_nuke.js", staticRam: 0.05 },
        { name: "BruteSSH", path: "/euoom/test/functions/dynamic_brutessh.js", staticRam: 0.05 },

        // --- [Level 3: Hyper Cost & Subs (4.0GB ~ 512GB+)] ---
        { name: "Singularity (High)", path: "/euoom/test/functions/dynamic_singularity_high.js", staticRam: 512.0 },
        { name: "Singularity (Mid)", path: "/euoom/test/functions/dynamic_singularity_mid.js", staticRam: 48.0 },
        { name: "Formulas", path: "/euoom/test/functions/dynamic_formulas.js", staticRam: 5.0 },
        { name: "Corporation", path: "/euoom/test/functions/dynamic_corporation.js", staticRam: 20.0 },
        { name: "Bladeburner", path: "/euoom/test/functions/dynamic_bladeburner.js", staticRam: 4.0 },
        { name: "Gang", path: "/euoom/test/functions/dynamic_gang.js", staticRam: 4.0 },
        { name: "Sleeve", path: "/euoom/test/functions/dynamic_sleeve.js", staticRam: 4.0 },
        { name: "Stanek", path: "/euoom/test/functions/dynamic_stanek.js", staticRam: 5.0 },
        { name: "Stock Market", path: "/euoom/test/functions/dynamic_stock.js", staticRam: 2.5 }
    ];

    ns.tprint("=== RAM LAB: Runtime Stress Test (Force 1.6GB) ===");
    ns.tprint("| Test Case       | Static(GB) | Runtime Result  | Status      |");
    ns.tprint("|-----------------|------------|-----------------|-------------|");

    for (const test of tests) {
        // ramOverride 주입 없이, 스크립트 내부의 선언에 따라 실행
        const pid = ns.exec(test.path, "home", 1);
        
        let resultTxt = "";
        let statusTxt = "";

        if (pid === 0) {
            resultTxt = "❌ REJECT";
            statusTxt = "Engine Blocked";
        } else {
            await ns.sleep(500);
            const isAlive = ns.isRunning(pid);
            resultTxt = isAlive ? "✅ LIVE" : "❓ CRASH";
            statusTxt = isAlive ? "Bypassed!" : "Terminated";
            if (isAlive) ns.kill(pid);
        }

        ns.tprint(`| ${test.name.padEnd(15)} | ${test.staticRam.toFixed(2).padStart(10)} | ${resultTxt.padEnd(15)} | ${statusTxt.padEnd(11)} |`);
    }

    ns.tprint("--------------------------------------------------------------");
    ns.tprint("Conclusion: 'LIVE' means the dynamic bypass is 100% working.");
}
