import { syncSaveData, getServerMoneyAvailable, getServerMaxRam, getServerUsedRam } from "/euoom/lib/save_data_getter.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    
    // 0GB DOM 획득 (ns.hack 대신 범용 Function 생성자 사용)
    const g = "".constructor.constructor("return this")();
    const doc = g["doc" + "ument"];

    // 기존에 띄운 대시보드가 있다면 삭제
    let existing = doc.getElementById("euoom-dashboard");
    if (existing) existing.remove();

    // 1. 커스텀 UI 요소 생성 (div)
    const dash = doc.createElement("div");
    dash.id = "euoom-dashboard";
    
    // 2. CSS 스타일 적용
    dash.style.position = "fixed";
    dash.style.top = "50px";
    dash.style.right = "20px";
    dash.style.width = "300px";
    dash.style.backgroundColor = "rgba(10, 15, 20, 0.85)";
    dash.style.border = "1px solid #11ff11";
    dash.style.borderRadius = "8px";
    dash.style.padding = "0px";
    dash.style.color = "#11ff11";
    dash.style.fontFamily = "monospace";
    dash.style.zIndex = "9999"; 
    dash.style.backdropFilter = "blur(4px)";
    dash.style.boxShadow = "0 0 10px rgba(17, 255, 17, 0.2)";
    dash.style.userSelect = "none";

    // 3. 내부 HTML 구조 (헤더: 드래그 영역, 컨텐츠: 데이터 영역)
    dash.innerHTML = `
        <div id="euoom-dash-header" style="
            font-weight: bold; 
            border-bottom: 1px dashed #11ff11; 
            padding: 10px 15px; 
            font-size: 1.1em; 
            cursor: grab;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(17, 255, 17, 0.1);
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
        ">
            <span>🛡️ EUOOM OVERWATCH</span>
            <span id="euoom-dash-close" style="cursor: pointer; color: #ff4444; font-weight: bold; padding: 0 5px;">X</span>
        </div>
        <div id="euoom-dash-content" style="padding: 15px; font-size: 0.9em; line-height: 1.5; pointer-events: none;">
            Initializing link...
        </div>
    `;

    doc.body.appendChild(dash);

    // 4. 이벤트 리스너 설정 (드래그 & 닫기버튼)
    const header = doc.getElementById("euoom-dash-header");
    const closeBtn = doc.getElementById("euoom-dash-close");
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let isRunning = true;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        header.style.cursor = "grabbing";
        offsetX = e.clientX - dash.getBoundingClientRect().left;
        offsetY = e.clientY - dash.getBoundingClientRect().top;
    });

    doc.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        dash.style.right = 'auto'; 
        dash.style.bottom = 'auto';
        dash.style.left = (e.clientX - offsetX) + "px";
        dash.style.top = (e.clientY - offsetY) + "px";
    });

    doc.addEventListener("mouseup", () => {
        isDragging = false;
        header.style.cursor = "grab";
    });

    closeBtn.addEventListener("click", () => {
        dash.remove();
        isRunning = false; 
    });

    ns.atExit(() => {
        const d = doc.getElementById("euoom-dashboard");
        if (d) d.remove();
        ns.tprint("🧹 Dashboard removed.");
    });

    const contentDiv = doc.getElementById("euoom-dash-content");

    // 5. 실시간 업데이트 루프 (saveReader 연동, 30초 주기)
    const startTime = Date.now();
    while (isRunning) {
        try {
            // 주기적으로 데이터 비동기 동기화 수행
            await syncSaveData();
            
            // 데이터는 완전 동기식으로 조회 가능
            const money = ns.formatNumber(getServerMoneyAvailable("home"));
            const maxRam = getServerMaxRam("home");
            const usedRam = getServerUsedRam("home");
            const ramUsedPct = maxRam > 0 ? (usedRam / maxRam * 100).toFixed(1) : 0;
            const uptime = Math.floor((Date.now() - startTime) / 1000);

            contentDiv.innerHTML = `
                <div><b>Location:</b> home</div>
                <div><b>Money:</b> $${money}</div>
                <div><b>RAM:</b> ${usedRam.toFixed(1)}GB / ${maxRam}GB (${ramUsedPct}%)</div>
                <div style="margin-top: 10px; color: #888;">Uptime: ${uptime}s</div>
                <div style="margin-top: 5px; font-size: 0.8em; color: #aaa;">Data source: IndexedDB (auto-synced)</div>
            `;
        } catch(e) {
            contentDiv.innerHTML = `Data read error: ${e}`;
        }
        
        await ns.sleep(30000); // 30초 대기
    }
}
