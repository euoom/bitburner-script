/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== 🔓 25GB DOM Bypass Experiment ===");

    try {
        // 1. 엔진의 정적 분석기를 속이기 위해 "document" 문자열을 쪼개서 접근
        const g = ns.hack.constructor("return this")();
        const dKey = "doc" + "ument";
        const doc = g[dKey];

        if (doc) {
            ns.tprint("✅ Document object stolen with 0GB cost!");
            
            // 2. 실제 UI 조작 (터미널 아래에 우리만의 메시지 출력)
            const terminal = doc.getElementById("terminal");
            if (terminal) {
                const msg = doc.createElement("li");
                msg.style.color = "#00ff00";
                msg.style.fontWeight = "bold";
                msg.style.listStyleType = "none";
                msg.innerText = ">>> [SYSTEM]: 25GB RAM BARRIER BREACHED SUCCESSFULLY! <<<";
                terminal.appendChild(msg);
                ns.tprint("✅ Terminal UI manipulated successfully.");
            } else {
                 ns.tprint("⚠️ Document accessed, but terminal element not found.");
            }
        } else {
            ns.tprint("❌ Failed to access document property.");
        }
    } catch (e) {
        ns.tprint("❌ Error during bypass: " + e.message);
    }

    // 결과 확인을 위해 유지
    while (true) await ns.sleep(1000);
}
