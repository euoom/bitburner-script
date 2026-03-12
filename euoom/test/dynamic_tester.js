/** @param {NS} ns */
export async function main(ns) {
    ns.tprint("=== 🔬 NS Proxy Bypass Test ===");

    // 1. 단순 문자열 우회 테스트 (이건 아마 Dynamic RAM Error 로 죽을 것임)
    ns.tprint("\n[Test 1] Obfuscated Property Access...");
    try {
        const h = "ha" + "ck";
        // 비트버너 엔진이 이 호출을 런타임에 감지하고 에러를 뱉는지 확인
        // 주의: 이 테스트가 실패하면 스크립트가 죽을 수 있으므로 Promise.race 같은 걸로 보호하지 않고 바로 시도
        // ns.tprint(`   Calling ns["${h}"]...`);
        // await ns[h]("n00dles"); 
        ns.tprint("   -> (주석 처리됨. 실행하면 스크립트가 뻗으므로 Test 2로 넘아감)");
    } catch(e) {
        ns.tprint(`   ❌ Test 1 failed: ${e.message}`);
    }

    // 2. valueOf() 로 순정 함수 꺼내보기
    ns.tprint("\n[Test 2] Extracting raw function via valueOf()...");
    try {
        const raw_ns = ns.valueOf();
        const raw_hack = raw_ns.hack;

        ns.tprint(`   raw_ns.hack type: ${typeof raw_hack}`);
        
        // 함수 소스코드를 찍어서 래퍼(Wrapper)인지 실제 엔진 로직인지 판단
        const src = raw_hack.toString();
        ns.tprint(`   raw_hack source (len=${src.length}):`);
        ns.tprint(`   ${src.substring(0, 150)}...`);

        if (src.includes("dynamic") || src.includes("RAM")) {
            ns.tprint("   ⚠️ raw_ns.hack inside still seems to have dynamic RAM checks.");
        } else {
            ns.tprint("   ✅ Looks like a pure function! Let's try calling it natively...");
            // 여기서 실제로 해킹 시도 (0GB RAM 우회 성공 여부)
            // const result = await raw_hack("n00dles");
            // ns.tprint(`   🎉 Hack execution result: ${result}`);
        }
    } catch(e) {
        ns.tprint(`   ❌ Test 2 failed: ${e.message}`);
    }

    // 3. Object.getPrototypeOf 혹은 {...ns} 를 통한 파괴적 해체
    ns.tprint("\n[Test 3] Deconstructing NS Object...");
    try {
        const spread = {...ns};
        const src2 = spread.hack.toString();
        ns.tprint(`   spread.hack snippet: ${src2.substring(0, 100)}`);
    } catch(e) {
        ns.tprint(`   ❌ Test 3 failed: ${e.message}`);
    }
}
