/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(2.7);
    ns.tprint("[Enricher] Starting atomic worker chain...");

    const workers = [
        "/euoom/util/run_hackAnalyze.js",
        "/euoom/util/run_growthAnalyze.js",
        "/euoom/util/run_weakenAnalyze.js",
        "/euoom/util/run_getMetadata.js"
    ];

    for (const worker of workers) {
        ns.print(`Running ${worker}...`);
        let pid = ns.run(worker);
        if (pid === 0) {
            ns.tprint(`[Error] Failed to run ${worker}. Check RAM.`);
            continue;
        }
        while (ns.isRunning(pid)) await ns.sleep(50);
        await ns.sleep(150); // 개별 워커 간 RAM 회수 대기 시간
    }

    ns.tprint("[Enricher] All atomic workers finished. db.json is ready.");
}
