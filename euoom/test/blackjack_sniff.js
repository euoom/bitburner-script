import { doc } from "/euoom/lib/document.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🃏 Blackjack Data Sniffer (React Fiber Probe) ===");
    
    const root = doc.getElementById("root");
    if (!root) {
        ns.tprint("❌ root element not found.");
        return;
    }

    const fiberKey = Object.keys(root).find(k => k.startsWith("__reactContainer"));
    const rootFiber = root[fiberKey];

    const seen = new Set();
    let foundStates = [];

    function crawl(node, depth = 0) {
        if (!node || depth > 500 || seen.has(node)) return;
        seen.add(node);

        const props = node.memoizedProps;
        const state = node.memoizedState;

        // 블랙잭 관련 키워드 검색
        const keywords = ["blackjack", "dealer", "player", "cards", "hand", "bet"];
        
        const check = (obj) => {
            if (!obj || typeof obj !== 'object') return false;
            const keys = Object.keys(obj).map(k => k.toLowerCase());
            return keywords.some(kw => keys.some(k => k.includes(kw)));
        };

        if (check(props) || check(state)) {
            foundStates.push({
                type: node.type?.name || node.type || "Unknown",
                props: props,
                state: state
            });
        }

        if (node.child) crawl(node.child, depth + 1);
        if (node.sibling) crawl(node.sibling, depth + 1);
    }

    ns.tprint("🔍 Crawling React tree for Blackjack state...");
    crawl(rootFiber);

    if (foundStates.length === 0) {
        ns.tprint("❌ No blackjack-related states found. Are you currently in the Blackjack screen?");
    } else {
        ns.tprint(`✅ Found ${foundStates.length} potential state nodes!`);
        foundStates.forEach((node, i) => {
            ns.tprint(`\n[Node ${i}]: ${node.type}`);
            // 객체 구조를 간단히 출력하여 딜러의 숨겨진 카드를 찾을 수 있는지 확인
            try {
                const summary = JSON.stringify(node.state, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                        if (seen.has(value)) return "[Circular]";
                        // 텍스트가 너무 길어지는 걸 방지
                        if (Object.keys(value).length > 20) return "{...many keys}";
                    }
                    return value;
                }, 2);
                ns.tprint(summary.substring(0, 1000));
            } catch(e) {
                ns.tprint("   (Unable to stringify state)");
            }
        });
    }
}
