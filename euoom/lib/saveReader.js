/** 
 * euoom/lib/saveReader.js
 * 0GB cost API bypass by reading directly from IndexedDB save data.
 */

// 글로벌 스코프 및 IndexedDB 엑세스
let _g = null;
function getGlobal() {
    if (!_g) {
        _g = "".constructor.constructor("return this")();
    }
    return _g;
}

/**
 * 모듈 레벨의 정적 캐시 (동기 접근용)
 */
let _lastReadTime = 0;
let _cachedGameState = null;
let _serversMap = new Map(); // 고속 동기 조회를 위한 맵
let _playerData = null;

const CACHE_TTL_MS = 1000; 

/**
 * [Async] DB에서 데이터를 비동기로 읽어와 내부 캐시를 갱신합니다.
 * 스크립트의 메인 루프나 초기화 단계에서 반드시 await로 호출해야 합니다.
 */
export async function syncSaveData(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && _cachedGameState && (now - _lastReadTime < CACHE_TTL_MS)) {
        return; // 캐시 유효
    }

    const g = getGlobal();
    const saveNodes = await new Promise((resolve, reject) => {
        const req = g.indexedDB.open("bitburnerSave");
        req.onerror = e => reject("IndexedDB open error: " + e.target.error);
        req.onsuccess = e => {
            const db = e.target.result;
            const tx = db.transaction(["savestring"], "readonly");
            tx.onerror = txErr => reject("Transaction error: " + txErr.target.error);
            const store = tx.objectStore("savestring");
            const getAllReq = store.getAll();
            getAllReq.onsuccess = r => resolve(r.target.result);
            getAllReq.onerror = rErr => reject("getAll error: " + rErr.target.error);
        };
    });

    if (!saveNodes || saveNodes.length === 0) throw new Error("No save data found");

    const bytes = new Uint8Array(Object.values(saveNodes[0]));
    const ds = new g.DecompressionStream("gzip");
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    
    writer.write(bytes);
    writer.close();
    
    const chunks = [];
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    
    const totalLen = chunks.reduce((s, c) => s + c.length, 0);
    const merged = new Uint8Array(totalLen);
    let off = 0;
    for (const c of chunks) { merged.set(c, off); off += c.length; }
    
    const jsonStr = new g.TextDecoder().decode(merged);
    const gameState = JSON.parse(jsonStr);

    // 고속 조회를 위한 데이터 인메모리 파싱 (동기화 용)
    const allServersRaw = JSON.parse(Object.values(gameState.data.AllServersSave).join(""));
    _serversMap.clear();
    for (const s of allServersRaw) {
        _serversMap.set(s.data.hostname, s.data);
    }

    const playerRaw = JSON.parse(Object.values(gameState.data.PlayerSave).join(""));
    _playerData = playerRaw.data;

    _cachedGameState = gameState;
    _lastReadTime = Date.now();
}

/** CORE ENTITY API (동기 호출)
 * 주의: 사용하기 전에 반드시 await syncSaveData() 를 최소 1회 호출해야 합니다.
 */
export function getAllServers() {
    if (_serversMap.size === 0) throw new Error("Data not synced. Call await syncSaveData() first.");
    return Array.from(_serversMap.values());
}

export function getServer(hostname) {
    if (_serversMap.size === 0) throw new Error("Data not synced. Call await syncSaveData() first.");
    const server = _serversMap.get(hostname);
    if (!server) throw new Error(`Server '${hostname}' not found`);
    return server;
}

export function getPlayer() {
    if (!_playerData) throw new Error("Data not synced. Call await syncSaveData() first.");
    return _playerData;
}

export function getHackableServers() {
    const servers = getAllServers();
    const player = getPlayer();
    return servers.filter(s => 
        !s.purchasedByPlayer &&
        s.hostname !== "home" &&
        s.requiredHackingSkill <= player.skills.hacking &&
        s.hasAdminRights
    );
}

/** 
 * COMPATIBILITY WRAPPERS (0GB, Sync)
 * 오리지널 NS API 처럼 완전 동기식으로 사용할 수 있습니다.
 * (ns 파라미터도 요구하지 않습니다)
 */
export function getServerMoneyAvailable(hostname) { return getServer(hostname).moneyAvailable; }
export function getServerMaxMoney(hostname) { return getServer(hostname).moneyMax; }
export function getServerMaxRam(hostname) { return getServer(hostname).maxRam; }
export function getServerUsedRam(hostname) { return getServer(hostname).ramUsed || 0; }
export function getServerSecurityLevel(hostname) { return getServer(hostname).hackDifficulty; }
export function getServerMinSecurityLevel(hostname) { return getServer(hostname).minDifficulty; }
export function getServerBaseSecurityLevel(hostname) { return getServer(hostname).baseDifficulty; }
export function getServerRequiredHackingLevel(hostname) { return getServer(hostname).requiredHackingSkill; }
export function getServerNumPortsRequired(hostname) { return getServer(hostname).numOpenPortsRequired; }
export function getServerGrowth(hostname) { return getServer(hostname).serverGrowth; }
