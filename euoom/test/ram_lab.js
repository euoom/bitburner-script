/** @param {NS} ns */
export async function main(ns) {
    const tests = [
        { name: "Hack Pct", path: "/euoom/test/functions/dynamic_hack.js", original: "/euoom/test/functions/static_hack.js" },
        { name: "Network Scan", path: "/euoom/test/functions/dynamic_scan.js", original: "/euoom/test/functions/static_scan.js" },
        { name: "Hacknet API", path: "/euoom/test/functions/dynamic_hacknet.js", original: null }
    ];

    ns.tprint("=== RAM LAB: Integrated Security & Performance Test ===");
    ns.tprint("| Test Case       | Static(GB) | runtime (1.6GB) | Result      |");
    ns.tprint("|-----------------|------------|-----------------|-------------|");

    for (const test of tests) {
        // 1. 정적 램 체크
        let sRam = 0;
        if (test.original) {
            try { sRam = ns.getScriptRam(test.original); } catch(e) {}
        } else {
            sRam = 4.0; // Hacknet 대략치
        }

        // 2. 실전 런타임 테스트 (ramOverride 1.6 강제 주입)
        const pid = ns.exec(test.path, "home", { threads: 1, ramOverride: 1.6 });
        
        let result = "";
        let note = "";

        if (pid === 0) {
            result = "❌ REJECT";
            note = "Engine Blocked";
        } else {
            await ns.sleep(500);
            const isAlive = ns.isRunning(pid);
            result = isAlive ? "✅ LIVE" : "❓ CRASH";
            note = isAlive ? "Bypassed!" : "Runtime Error";
            if (isAlive) ns.kill(pid);
        }

        ns.tprint(`| ${test.name.padEnd(15)} | ${sRam.toFixed(2).padStart(10)} | ${result.padEnd(15)} | ${note.padEnd(11)} |`);
    }

    ns.tprint("--------------------------------------------------------------");
    ns.tprint("Conclusion: 'LIVE' means the dynamic bypass is 100% working.");
}
