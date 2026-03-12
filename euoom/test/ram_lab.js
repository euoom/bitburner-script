/** @param {NS} ns */
export async function main(ns) {
    const costsPath = "/euoom/test/ns_api_costs.txt";
    if (!ns.fileExists(costsPath)) {
        ns.tprint(`FAIL: ${costsPath} not found. Please run ls_ns.js first.`);
        return;
    }

    const data = ns.read(costsPath);
    const lines = data.split("\n");
    const tests = [];

    // 1. 실측 데이터 파싱
    for (const line of lines) {
        if (!line.includes("|") || line.includes("Function Path") || line.includes("---")) continue;
        const parts = line.split("|").map(p => p.trim());
        if (parts.length < 3) continue;

        const path = parts[1];
        const cost = parseFloat(parts[2]);

        if (isNaN(cost) || cost === 0) continue;
        if (path.startsWith("[")) continue; 

        tests.push({ name: path, staticRam: cost });
    }

    ns.tprint(`=== RAM LAB: Automated Deep Stress Test (Target: ${tests.length} APIs) ===`);
    ns.tprint("| API Path                       | Static(GB) | Result          | Status      |");
    ns.tprint("|--------------------------------|------------|-----------------|-------------|");

    const testerScript = "/euoom/test/dynamic_tester.js";
    
    for (const test of tests) {
        // 이전 테스트 잔해 제거
        ns.scriptKill(testerScript, "home");
        
        // 범용 테스트 워커 실행
        const pid = ns.exec(testerScript, "home", 1, test.name);

        if (pid === 0) {
            ns.printf("| %-30s | %10.2f | ❌ FAIL          | Build Block |", test.name, test.staticRam);
            continue;
        }

        // 실행 직후 및 잠시 후 상태 체크 (엔진 차단 대기)
        await ns.sleep(100);
        let isLive = ns.isRunning(pid);
        
        if (isLive) {
            // 한번 더 확답 (고비용일수록 체크 시간이 걸릴 수 있음)
            await ns.sleep(200);
            isLive = ns.isRunning(pid);
        }

        const resultStr = isLive ? "✅ LIVE" : "❓ CRASH";
        const statusStr = isLive ? "Bypassed!" : "Terminated";
        ns.tprint(`| ${test.name.padEnd(30)} | ${test.staticRam.toFixed(2).padStart(10)} | ${resultStr.padEnd(15)} | ${statusStr.padEnd(11)} |`);

        ns.kill(pid);
    }

    ns.tprint("=== Deep Stress Test Complete ===");
}
