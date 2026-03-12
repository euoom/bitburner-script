/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== 🛠️ CHECK.JS: Unified Bypass Lab ===");

    try {
        // 1. 25GB DOM 우회 (문자열 조합 방식)
        const g = ns.hack.constructor("return this")();
        const doc = g["doc" + "ument"];

        if (!doc) {
            ns.tprint("❌ Critical: Document not accessible.");
            return;
        }
        ns.tprint("✅ Document object stolen with 0GB cost!");

        // 2. UI 변조 테스트 (Root Glow)
        const root = doc.getElementById('root');
        if (root) {
            root.style.boxShadow = "inset 0 0 50px #00ff00";
            ns.tprint("✅ Visual hijacking applied (Root Glow).");

            // 3. 리액트 내부 객체 탐색
            const reactKey = Object.keys(root).find(key => key.startsWith('__reactContainer') || key.startsWith('__reactProps'));
            if (reactKey) {
                ns.tprint(`✅ Found React Key: ${reactKey}`);
                const internal = root[reactKey];
                
                // 엔진의 생얼(Naked Engine)을 찾기 위한 내부 속성 출력 시도
                ns.tprint("- Data structure: " + typeof internal);
            }
        }

        // 4. 터미널 하이라이트
        const terminals = doc.querySelectorAll(".MuiTypography-root"); // 비트버너 터미널 클래스 예시
        terminals.forEach(el => {
            if (el.innerText.includes("Unified Bypass Lab")) {
                el.style.color = "#00ff00";
                el.style.fontWeight = "bold";
            }
        });

    } catch (e) {
        ns.tprint("❌ Error: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
