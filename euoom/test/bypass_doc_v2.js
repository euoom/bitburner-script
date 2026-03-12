/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== 🔓 25GB DOM Hijacking Lab (v2) ===");

    try {
        const g = ns.hack.constructor("return this")();
        const dKey = "doc" + "ument";
        const doc = g[dKey];

        if (!doc) {
            ns.tprint("❌ Critical: Document still not accessible.");
            return;
        }

        // 1. 시각적 증명: 게임 배경색을 약간 녹색으로 변조 (하이재킹 느낌)
        const wrapper = doc.getElementById("root");
        if (wrapper) {
            wrapper.style.boxShadow = "inset 0 0 50px #00ff00";
            ns.tprint("✅ Game UI 'Glow' effect applied!");
        }

        // 2. 리액트 내부 '진짜 엔진' 추적
        ns.tprint("- Searching for React internals...");
        const root = doc.getElementById('root');
        const reactKey = Object.keys(root).find(key => key.startsWith('__reactContainer') || key.startsWith('__reactProps'));
        
        if (reactKey) {
            ns.tprint(`✅ Found React Key: ${reactKey}`);
            const internal = root[reactKey];
            
            // 트리 깊숙이 있는 'NS' 실체나 'Store' 탐색
            // 여기서 만약 'ns' 객체를 찾아낸다면, 그 ns는 '램 체크 프록시'가 없는 알몸 상태일 수 있음
            ns.tprint("✅ Engine internals exposed to inspection.");
        }

        // 3. 터미널 다시 찾기 (더 넓은 범위 탐색)
        const allElements = doc.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
            if (allElements[i].innerText && allElements[i].innerText.includes("=== RAM LAB")) {
                allElements[i].style.color = "#00ff00";
                allElements[i].style.textShadow = "0 0 5px #00ff00";
                ns.tprint("✅ Found Terminal lines by content and highlighted!");
                break;
            }
        }

    } catch (e) {
        ns.tprint("❌ Error during hijacking: " + e.message);
    }

    while (true) await ns.sleep(1000);
}
