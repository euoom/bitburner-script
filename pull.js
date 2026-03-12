/** @param {NS} ns */
export async function main(ns) {
    const defaultUser = "euoom";
    const defaultRepo = "bitburner-script";
    const defaultBranch = "master";

    // 인자 분석
    const args = ns.args;
    const isForce = args.includes("--force") || args.includes("-f");
    
    // 위치 기반 인자 추출 (플래그 제외)
    const cleanArgs = args.filter(a => !a.startsWith("-"));
    const user = cleanArgs[0] || defaultUser;
    const repo = cleanArgs[1] || defaultRepo;
    const branch = cleanArgs[2] || defaultBranch;

    const timestamp = isForce ? new Date().getTime() : Math.floor(new Date().getTime() / 60000); // force면 ms 단위, 아니면 분 단위 캐시
    const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/`;
    const manifestUrl = `${baseUrl}manifest.json?t=${timestamp}`;

    const host = ns.getHostname();

    ns.tprint(`[${host}] 🚀 Starting Bitburner Pull System...`);
    if (isForce) ns.tprint(`[${host}] ⚠️ Force mode enabled: Bypassing cache.`);
    ns.tprint(`[${host}] Source: ${user}/${repo} (${branch})`);

    try {
        ns.tprint(`[${host}] Fetching manifest.json...`);
        ns.tprint(`[${host}] URL: ${manifestUrl}`); // 디버깅용 URL 출력
        const manifestResult = await ns.wget(manifestUrl, "/temp_manifest.json");

        if (!manifestResult) {
            ns.tprint(`[${host}] ❌ Error: Manifest download failed.`);
            return;
        }

        const content = ns.read("/temp_manifest.json");
        const manifestContent = JSON.parse(content);
        const files = manifestContent.files || [];
        const total = files.length;

        if (total === 0) {
            ns.tprint(`[${host}] ⚠️ No files found in the download list.`);
            ns.rm("/temp_manifest.json");
            return;
        }

        ns.tprint(`[${host}] Found ${total} files. Starting synchronization...`);

        for (let i = 0; i < total; i++) {
            const fileName = files[i];
            const percent = Math.round(((i + 1) / total) * 100);
            const barWidth = 20;
            const progress = Math.round((barWidth * (i + 1)) / total);
            const bar = "█".repeat(progress) + "-".repeat(barWidth - progress);
            
            ns.tprint(`[${host}] [${bar}] ${percent}% | ${i + 1}/${total} | Syncing: ${fileName}`);
            
            const fileUrl = `${baseUrl}${fileName}?t=${timestamp}`;
            const success = await ns.wget(fileUrl, fileName);
            if (!success) {
                ns.tprint(`[${host}]   ❌ Failed: ${fileName}`);
            }
        }

        ns.rm("/temp_manifest.json");
        ns.tprint(`[${host}] ✨ Pull complete! ${total} scripts are up to date.`);

    } catch (error) {
        ns.tprint(`[${host}] ❌ System Error: ${error.message}`);
    }
}
