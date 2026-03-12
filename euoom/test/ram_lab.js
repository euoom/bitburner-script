/** @param {NS} ns */
export async function main(ns) {
    const tests = [
        { name: "Hack Pct", path: "/euoom/test/functions/dynamic_hack.js", staticRam: 1.0 },
        { name: "Network Scan", path: "/euoom/test/functions/dynamic_scan.js", staticRam: 0.2 },
        { name: "Hacknet API", path: "/euoom/test/functions/dynamic_hacknet.js", staticRam: 4.0 }
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
