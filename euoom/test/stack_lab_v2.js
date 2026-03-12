/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🛠️ Deep Engine Hijacking Lab (v2) ===");

    try {
        // 1. 글로벌 객체 및 document 확보
        const global = ns.hack.constructor("return this")();
        const doc = global.document;

        if (!doc) {
            ns.tprint("❌ Failed to escape sandbox (No document found).");
            return;
        }

        ns.tprint("✅ Escaped to Document context.");

        // 2. React 내부 핸들 탐색 (root 컨테이너에서 추출)
        const rootElement = doc.getElementById('root');
        if (!rootElement) {
            ns.tprint("❌ Root element not found.");
            return;
        }

        // React 17+ 의 내부 프로퍼티 키 탐색
        const reactKey = Object.keys(rootElement).find(key => key.startsWith('__reactContainer') || key.startsWith('__reactProps'));
        ns.tprint(`- Found React internal key: ${reactKey}`);

        // 3. 엔진 내부 Store 탐색
        // 이 경로는 비트버너 버전에 따라 다를 수 있지만, 보통 트리를 타고 올라가면 엔진 코어에 도달함
        let engine = null;
        try {
            // 리액트 컨텍스트를 타고 올라가서 램 체크가 없는 '생얼' ns 또는 엔진 객체 탐색
            // 이곳에 성공적으로 도달하면 램 비용 0으로 모든 것이 가능해짐
            ns.tprint("- Searching for naked engine instance...");
            
            // 전역에서 찾을 수 있는 흥미로운 객체들 심층 조사
            const candidates = ["Player", "AllServers", "NetscriptPorts", "Terminal"];
            for (const cand of candidates) {
                if (global[cand]) ns.tprint(`- [Detected] global.${cand} is accessible!`);
            }
        } catch (e) {
            ns.tprint("- Engine mapping failed.");
        }

    } catch (e) {
        ns.tprint("❌ Hijacking error: " + e.message);
    }

    ns.tprint("\n=== End of Investigation ===");
}
