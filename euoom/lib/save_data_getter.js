/** 
 * euoom/lib/save_data_getter.js
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
let _serversMap = new Map(); 
let _playerData = null;

const CACHE_TTL_MS = 1000; 

/**
 * [Async] DB에서 데이터를 비동기(Async)로 읽어와 내부 캐시를 갱신합니다.
 * 이 함수는 singularity.getSaveData(16GB)를 0GB로 대체하기 위한 핵심 '동기화' 로직입니다.
 */
export async function syncSaveData(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && _cachedGameState && (now - _lastReadTime < CACHE_TTL_MS)) {
        return; 
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

    // 내부 맵 갱신
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

/**
 * [Sync] singularity.getSaveData() (16GB) 의 0GB 대체제.
 * (주의: 이 함수는 파싱된 JSON 객체를 반환하며, 미리 await syncSaveData()가 호출되어 있어야 함)
 */
export function getSaveData() {
    if (!_cachedGameState) throw new Error("Data not synced. Call await syncSaveData() first.");
    return _cachedGameState;
}

/** CORE ENTITY API (동기 호출) */
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

/** COMPATIBILITY WRAPPERS (0GB, Sync) */
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
