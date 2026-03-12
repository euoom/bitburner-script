import { getHN } from "/euoom/lib/hacknet.js";

/** @param {NS} ns */
/** @ramOverride 2.7 */
export async function main(ns) {
    ns.tprint("🚀 Starting Distributed Network Analysis...");

    // 1. Crawler (Network Discovery)
    ns.tprint("Step 1: Discovering network...");
    let pid = ns.run("/euoom/analyze/crawler.js");
    while (ns.isRunning(pid)) await ns.sleep(100);
    await ns.sleep(200); // RAM 쿨다운

    // 2. Enricher (Heavy API Gathering)
    ns.tprint("Step 2: Gathering raw metrics (Heavy API)...");
    pid = ns.run("/euoom/analyze/enricher.js");
    while (ns.isRunning(pid)) await ns.sleep(100);
    await ns.sleep(200); // RAM 쿨다운

    // 3. Refiner (Logic & Optimization)
    ns.tprint("Step 3: Processing data & Finalizing report...");
    pid = ns.run("/euoom/analyze/refiner.js");
    while (ns.isRunning(pid)) await ns.sleep(100);
    await ns.sleep(200); // RAM 쿨다운

    ns.tprint("✅ Global Analysis Complete! Check /euoom/analyze/analysis.json");
}
