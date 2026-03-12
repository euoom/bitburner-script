/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6);
    ns.tprint("=== Experimental Trace-Breaking Test ===");

    // 시도 1: Reflect를 이용한 호출 (함수의 실체를 런타임에 결합)
    async function attemptReflect() {
        try {
            const scpFn = Reflect.get(ns, "scp");
            // ns를 'this'로 바인딩하지 않고 호출 시도 (될 수도 있고 안 될 수도 있음)
            const res = await Reflect.apply(scpFn, ns, ["pull.js", "home", "test1.js"]);
            ns.tprint(`[Reflect] Success: ${res}`);
        } catch (e) {
            ns.tprint(`[Reflect] Failed: ${e.message}`);
        }
    }

    // 시도 2: setTimeout으로 스택 분리 (가장 강력한 스택 단절)
    function attemptTimeout() {
        const fn = ns["scp"];
        setTimeout(async () => {
            try {
                // 이 시점에서는 main 함수의 실행 맥락이 종료되었거나 분리된 상태임
                const res = await fn("pull.js", "home", "test2.js");
                // ns.tprint를 쓸 수 없으므로(ns가 사라졌을 수 있음) 로그에 직접 찍거나 결과물로 확인
            } catch (e) { }
        }, 100);
    }

    // 시도 3: Object.assign으로 '새로운 객체'인 척 하기
    async function attemptAssign() {
        const ms = {};
        Object.assign(ms, ns);
        try {
            // 이제 ms는 ns와 똑같은 기능을 갖지만, 'ns' 그 자체는 아님
            const res = await ms.scp("pull.js", "home", "test3.js");
            ns.tprint(`[Assign] Success: ${res}`);
        } catch (e) {
            ns.tprint(`[Assign] Failed: ${e.message}`);
        }
    }

    // 테스트 실행 (하나씩 확인 요망)
    await attemptReflect();
    attemptTimeout(); // 타임아웃은 파일 생성 여부로 확인
    await attemptAssign();

    while (true) await ns.sleep(1000);
}
