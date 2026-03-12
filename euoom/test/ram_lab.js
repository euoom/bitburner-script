/** @param {NS} ns */
export async function main(ns) {
    const tests = [
        // --- [Level 1: Daily Hacking Suite (0.1GB ~ 1.0GB)] ---
        { name: "Hack Analyze", path: "/euoom/test/functions/dynamic_hack.js", staticRam: 1.0 },
        { name: "Hack Suite", path: "/euoom/test/functions/dynamic_hackSuite.js", staticRam: 0.3 }, // Chance, Security, Threads
        { name: "Growth Ana", path: "/euoom/test/functions/dynamic_growthAnalyze.js", staticRam: 1.0 },
        { name: "Weaken Ana", path: "/euoom/test/functions/dynamic_weakenAnalyze.js", staticRam: 1.0 },
        { name: "Server Stats", path: "/euoom/test/functions/dynamic_serverStats.js", staticRam: 0.4 }, // Sec, Money, MaxRam, UsedRam
        { name: "Time Stats", path: "/euoom/test/functions/dynamic_timeStats.js", staticRam: 0.15 }, // H, G, W Time
        { name: "Scan", path: "/euoom/test/functions/dynamic_scan.js", staticRam: 0.2 },
        { name: "File Exists", path: "/euoom/test/functions/dynamic_fileExists.js", staticRam: 0.1 },

        // --- [Level 2: Heavy Server & Player (2.0GB ~ 4.0GB)] ---
        { name: "Get Server", path: "/euoom/test/functions/dynamic_getServer.js", staticRam: 2.0 },
        { name: "Get Player", path: "/euoom/test/functions/dynamic_getPlayer.js", staticRam: 0.5 },
        { name: "Hacknet API", path: "/euoom/test/functions/dynamic_hacknet.js", staticRam: 4.0 },
        { name: "Nuke", path: "/euoom/test/functions/dynamic_nuke.js", staticRam: 0.05 },
        { name: "BruteSSH", path: "/euoom/test/functions/dynamic_brutessh.js", staticRam: 0.05 },

        // --- [Level 3: Hyper Cost & Subs (4.0GB ~ 5.0GB+)] ---
        { name: "Singularity", path: "/euoom/test/functions/dynamic_singularity.js", staticRam: 4.0 },
        { name: "Formulas", path: "/euoom/test/functions/dynamic_formulas.js", staticRam: 5.0 },
        { name: "Corporation", path: "/euoom/test/functions/dynamic_corporation.js", staticRam: Infinity },
        { name: "Stock Market", path: "/euoom/test/functions/dynamic_stock.js", staticRam: 2.0 }
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
