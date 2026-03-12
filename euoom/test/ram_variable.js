    // 레벨 3: 허위 객체 패턴 매칭 테스트
    // ns와는 아무 상관 없는 일반 객체입니다.
    const fakeObject = {
        hacknet: {
            numNodes: function() { return 999; }
        }
    };

    ns.tprint("=== Fake Object Pattern Test ===");
    
    // 비트버너 API가 아닌 fakeObject를 호출하지만, 가설이 맞다면 4GB가 청구될 것입니다.
    const val = fakeObject.hacknet.numNodes();
    
    ns.tprint(`Fake Value: ${val}`);
    
    while (true) {
        // Active Scripts에서 이 파일의 할당량을 확인해 봅시다.
        await ns.sleep(1000);
    }
}
