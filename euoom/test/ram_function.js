/** @param {NS} ns */
export async function main(ns) {
    // 타겟: getScriptRam (0.1GB)
    // ns와 아무 상관 없는 가짜 객체에 이 이름을 붙여봅니다.
    const fake = {
        getScriptRam: function() { return 0; }
    };

    ns.tprint("=== Function Pattern Test ===");
    
    // 이 구문이 램을 0.1GB 높여서 1.7GB로 만든다면, 함수도 텍스트 패턴 매칭입니다.
    const res = fake.getScriptRam();
    
    ns.tprint(`Result: ${res}`);
    
    while (true) {
        await ns.sleep(1000);
    }
}
