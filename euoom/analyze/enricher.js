/** @param {NS} ns */
/** @ramOverride 2.7 */
export async function main(ns) {
    ns["tprint"]("[Enricher] Starting atomic worker chain...");

    const workers = [
        "/euoom/util/run_hackAnalyze.js",
        "/euoom/util/run_growthAnalyze.js",
        "/euoom/util/run_weakenAnalyze.js",
        "/euoom/util/run_getMetadata.js"
    ];

    for (const worker of workers) {
        ns["print"](`Running ${worker}...`);
        let pid = ns["run"](worker);
        if (pid === 0) {
            ns["tprint"](`[Error] Failed to run ${worker}. Check RAM.`);
            continue;
        }
        while (ns["isRunning"](pid)) await ns["sleep"](50);
    }

    ns["tprint"]("[Enricher] All atomic workers finished. db.json is ready.");
}
