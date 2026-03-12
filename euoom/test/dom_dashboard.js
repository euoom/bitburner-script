import { syncSaveData, getAllServers, getServerMoneyAvailable, getServerMaxRam, getServerUsedRam, getServerMaxMoney, getServerSecurityLevel, getServerMinSecurityLevel } from "/euoom/lib/save_data_getter.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("sleep");
    
    // 0GB DOM 획득
    const g = "".constructor.constructor("return this")();
    const doc = g["doc" + "ument"];

    // 기존 대비 삭제
    let existing = doc.getElementById("euoom-dashboard");
    if (existing) existing.remove();

    const dash = doc.createElement("div");
    dash.id = "euoom-dashboard";
    
    // 스타일 설정
    dash.style.position = "fixed";
    dash.style.top = "50px";
    dash.style.right = "20px";
    dash.style.width = "320px";
    dash.style.backgroundColor = "rgba(10, 15, 20, 0.9)";
    dash.style.border = "1px solid #11ff11";
    dash.style.borderRadius = "8px";
    dash.style.padding = "0px";
    dash.style.color = "#11ff11";
    dash.style.fontFamily = "monospace";
    dash.style.zIndex = "9999"; 
    dash.style.backdropFilter = "blur(10px)";
    dash.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
    dash.style.userSelect = "none";

    // ── UI 구조 설계 (Select 박스 추가) ───────────────────────────────────
    dash.innerHTML = `
        <div id="euoom-dash-header" style="
            font-weight: bold; border-bottom: 1px dashed #11ff11; padding: 10px 15px; 
            cursor: grab; display: flex; justify-content: space-between; align-items: center;
            background: rgba(17, 255, 17, 0.1); border-top-left-radius: 7px; border-top-right-radius: 7px;
        ">
            <span>🛡️ SERVER MONITOR</span>
            <span id="euoom-dash-close" style="cursor: pointer; color: #ff4444; font-weight: bold; width: 20px; text-align: right;">X</span>
        </div>
        <div style="padding: 10px 15px; background: rgba(0,0,0,0.3);">
            <select id="euoom-server-select" style="
                width: 100%; background: #000; color: #11ff11; border: 1px solid #11ff11;
                padding: 4px; font-family: monospace; outline: none; cursor: pointer;
            ">
                <option value="home">Loading servers...</option>
            </select>
        </div>
        <div id="euoom-dash-content" style="padding: 15px; font-size: 0.9em; line-height: 1.6;">
            Initializing link...
        </div>
    `;

    doc.body.appendChild(dash);

    // ── 이벤트 및 상태 관리 ───────────────────────────────────────────────
    const header = doc.getElementById("euoom-dash-header");
    const closeBtn = doc.getElementById("euoom-dash-close");
    const serverSelect = doc.getElementById("euoom-server-select");
    const contentDiv = doc.getElementById("euoom-dash-content");
    
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let isRunning = true;
    let currentTarget = "home";

    serverSelect.addEventListener("change", (e) => {
        currentTarget = e.target.value;
    });

    // 드래그 로직
    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - dash.getBoundingClientRect().left;
        offsetY = e.clientY - dash.getBoundingClientRect().top;
    });

    doc.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        dash.style.right = 'auto'; 
        dash.style.left = (e.clientX - offsetX) + "px";
        dash.style.top = (e.clientY - offsetY) + "px";
    });

    doc.addEventListener("mouseup", () => isDragging = false);

    closeBtn.addEventListener("click", () => {
        dash.remove();
        isRunning = false;
    });

    ns.atExit(() => {
        const d = doc.getElementById("euoom-dashboard");
        if (d) d.remove();
    });

    // ── 컴포넌트 업데이트 함수 ─────────────────────────────────────────────
    async function updateUI() {
        await syncSaveData();
        
        // 콤보박스 목록 갱신 (서버가 늘어나거나 싱크될 때 대비)
        const all = getAllServers().map(s => s.hostname).sort();
        if (serverSelect.options.length <= 1) {
            serverSelect.innerHTML = all.map(h => `<option value="${h}" ${h === currentTarget ? 'selected' : ''}>${h}</option>`).join("");
        }

        const money = ns.formatNumber(getServerMoneyAvailable(currentTarget));
        const maxMoney = ns.formatNumber(getServerMaxMoney(currentTarget));
        const maxRam = getServerMaxRam(currentTarget);
        const usedRam = getServerUsedRam(currentTarget);
        const sec = getServerSecurityLevel(currentTarget).toFixed(2);
        const minSec = getServerMinSecurityLevel(currentTarget).toFixed(2);

        contentDiv.innerHTML = `
            <div style="color: #55ff55; margin-bottom: 5px; font-weight: bold;">[ ${currentTarget} ]</div>
            <div style="display: flex; justify-content: space-between;"><span>Money:</span> <span>$${money} / $${maxMoney}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Security:</span> <span>${sec} (min: ${minSec})</span></div>
            <div style="display: flex; justify-content: space-between;"><span>RAM Load:</span> <span>${usedRam.toFixed(1)} / ${maxRam} GB</span></div>
            <div style="width: 100%; height: 4px; background: #222; margin-top: 8px;">
                <div style="width: ${Math.min(100, (usedRam/maxRam)*100)}%; height: 100%; background: #11ff11;"></div>
            </div>
            <div style="margin-top: 15px; font-size: 0.75em; color: #666; text-align: center;">Last Sync: ${new Date().toLocaleTimeString()}</div>
        `;
    }

    // ── 메인 루프 (초기엔 1초, 이후 30초 주기) ───────────────────────────
    await updateUI(); 
    while (isRunning) {
        await updateUI();
        await ns.sleep(30000); 
    }
}
