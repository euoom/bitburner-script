/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🛠️ Stack & Handle Deep Inspection ===");

    // 1. ns.ps() 객체 심층 조사
    const ps = ns.ps();
    if (ps.length > 0) {
        ns.tprint("\n[1] ns.ps() Object Insight:");
        const p = ps[0];
        ns.tprint(`- Prototype: ${Object.getPrototypeOf(p)}`);
        ns.tprint(`- Constructor: ${p.constructor.name}`);
        // 숨겨진 링크 확인
        const keys = Object.getOwnPropertyNames(p);
        ns.tprint(`- All Properties: ${keys.join(", ")}`);
    }

    // 2. RunningScript 핸들 조사
    ns.tprint("\n[2] getRunningScript() Insight:");
    const self = ns.getRunningScript();
    if (self) {
        ns.tprint(`- Keys: ${Object.keys(self).join(", ")}`);
        if (self.ns) {
            ns.tprint("- Found self.ns reference!");
            ns.tprint(`- Is it the same proxy? ${self.ns === ns}`);
        }
    }

    // 3. JS Stack Trace 분석 (엔진 내부 경로 추적)
    ns.tprint("\n[3] Stack Trace Analysis:");
    try {
        throw new Error("StackProbe");
    } catch (e) {
        ns.tprint("- Current Stack:");
        ns.tprint(e.stack);
    }

    // 4. Constructor Breakout (글로벌 스코프 침투)
    ns.tprint("\n[4] Global Scope Breakout Test:");
    try {
        const globalHandle = ns.hack.constructor("return this")();
        ns.tprint("- Global Object detected.");
        const globalKeys = Object.keys(globalHandle).filter(k => 
            k.toLowerCase().includes("ns") || 
            k.toLowerCase().includes("engine") ||
            k.toLowerCase().includes("netscript")
        );
        ns.tprint(`- Interesting Global Keys: ${globalKeys.join(", ") || "None found"}`);
    } catch (e) {
        ns.tprint("- Global breakout failed: " + e.message);
    }

    ns.tprint("\n=== Inspection Complete ===");
}
