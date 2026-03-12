/** 
 * euoom/lib/saveReader.js
 * 0GB cost API bypass by reading directly from IndexedDB save data.
 */

// 글로벌 스코프 및 IndexedDB 엑세스 캐싱
let _g = null;
function getGlobal(ns) {
    if (!_g) {
        _g = ns.hack.constructor("return this")();
    }
    return _g;
}

/**
 * 전역 세이브 데이터 캐시 (지연시간을 조절하여 DB 부하 감소)
 */
let _lastReadTime = 0;
let _cachedGameState = null;

// 서버 설정을 통해 오토세이브가 30초마다 발생하므로, 
// 캐시 생존 시간을 1초로 짧게 잡아도 매 저장 주기 직후 새로고침 렌더 시 렉 방지에 유리합니다.
const CACHE_TTL_MS = 1000; 

/**
 * DB에서 savestring을 읽어와 gzip 디코딩 후 JSON 객체로 반환
 * @param {NS} ns
 * @param {boolean} forceRefresh - 캐시를 무시하고 강제 갱신할지 여부
 */
export async function readSaveData(ns, forceRefresh = false) {
    const now = Date.now();
    // 설정된 TTL (현재 1초) 이내의 요청은 캐시 반환
    if (!forceRefresh && _cachedGameState && (now - _lastReadTime < CACHE_TTL_MS)) {
        return _cachedGameState;
    }

    const g = getGlobal(ns);

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

    if (!saveNodes || saveNodes.length === 0) {
        throw new Error("No save data found in IndexedDB");
    }

    // Uint8Array 변환
    const bytes = new Uint8Array(Object.values(saveNodes[0]));
    
    // DecompressionStream ("gzip") 해제
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
    
    // 청크 병합
    const totalLen = chunks.reduce((s, c) => s + c.length, 0);
    const merged = new Uint8Array(totalLen);
    let off = 0;
    for (const c of chunks) {
        merged.set(c, off);
        off += c.length;
    }
    
    // TextDecoder
    const jsonStr = new g.TextDecoder().decode(merged);
    const gameState = JSON.parse(jsonStr);

    _cachedGameState = gameState;
    _lastReadTime = Date.now();

    return gameState;
}

/**
 * 모든 서버 정보 배열 반환 (0GB)
 * @param {NS} ns
 * @returns {Promise<Object[]>}
 */
export async function getAllServers(ns) {
    const state = await readSaveData(ns);
    const allServersRaw = JSON.parse(Object.values(state.data.AllServersSave).join(""));
    return allServersRaw.map(s => s.data);
}

/**
 * 단일 서버 정보 반환 (0GB)
 * @param {NS} ns
 * @param {string} hostname
 * @returns {Promise<Object>}
 */
export async function getServer(ns, hostname) {
    const servers = await getAllServers(ns);
    const server = servers.find(s => s.hostname === hostname);
    if (!server) throw new Error(`Server '${hostname}' not found`);
    return server;
}

/**
 * 플레이어 정보 반환 (0GB)
 * @param {NS} ns
 * @returns {Promise<Object>}
 */
export async function getPlayer(ns) {
    const state = await readSaveData(ns);
    const playerRaw = JSON.parse(Object.values(state.data.PlayerSave).join(""));
    return playerRaw.data;
}

/**
 * 정적 분석에 필요한 모든 해킹 가능 서버들 추출 유틸
 */
export async function getHackableServers(ns) {
    const servers = await getAllServers(ns);
    const player = await getPlayer(ns);
    // 홈 및 플레이어 소유 서버 제외, 루트 권한 필요조건 등
    return servers.filter(s => 
        !s.purchasedByPlayer &&
        s.hostname !== "home" &&
        s.requiredHackingSkill <= player.skills.hacking &&
        s.hasAdminRights
    );
}

