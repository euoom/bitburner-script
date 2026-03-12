/** @param {NS} ns */
export async function main(ns) {
    const defaultUser = "euoom";
    const defaultRepo = "bitburner-script";
    const defaultBranch = "master";

    // 인자 분석
    const args = ns.args;
    const isForce = args.includes("--force") || args.includes("-f");
    const skipManifest = args.includes("--skip-manifest") || args.includes("-s");
    
    // 위치 기반 인자 추출 (플래그 제외)
    const cleanArgs = args.filter(a => !a.startsWith("-"));
    const user = cleanArgs[0] || defaultUser;
    const repo = cleanArgs[1] || defaultRepo;
    const branch = cleanArgs[2] || defaultBranch;

    const timestamp = isForce ? new Date().getTime() : Math.floor(new Date().getTime() / 60000); 
    const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/`;
    const manifestUrl = `${baseUrl}manifest.json?t=${timestamp}`;

    const host = ns.getHostname();

    ns.tprint(`[${host}] 🚀 Starting Bitburner Pull System...`);
    if (isForce) ns.tprint(`[${host}] ⚠️ Force mode enabled: Bypassing cache.`);
    if (skipManifest) ns.tprint(`[${host}] 📂 Skip manifest update: Using local manifest.json.`);
    ns.tprint(`[${host}] Source: ${user}/${repo} (${branch})`);

    try {
        if (!skipManifest) {
            ns.tprint(`[${host}] Fetching manifest.json...`);
            ns.tprint(`[${host}] URL: ${manifestUrl}`);
            const manifestResult = await ns.wget(manifestUrl, "/manifest.json");

            if (!manifestResult) {
                ns.tprint(`[${host}] ❌ Error: Manifest download failed.`);
                return;
            }
        } else {
            if (!ns.fileExists("/manifest.json")) {
                ns.tprint(`[${host}] ❌ Error: Local /manifest.json not found. Run without -s once.`);
                return;
            }
        }

        const content = ns.read("/manifest.json");
        const manifestContent = JSON.parse(content);
        const files = manifestContent.files || [];
        const version = manifestContent.version || "legacy";
        const total = files.length;

        if (total === 0) {
            ns.tprint(`[${host}] ⚠️ No files found in the download list.`);
            return;
        }

        // 버전 정보를 쿼리 파라미터로 사용하여 캐시 파쇄
        const bustParam = isForce ? `t=${new Date().getTime()}` : `v=${version}`;
        ns.tprint(`[${host}] Found ${total} files (Version: ${version}). Starting synchronization...`);

        for (let i = 0; i < total; i++) {
            const fileName = files[i];
            const percent = Math.round(((i + 1) / total) * 100);
            const barWidth = 20;
            const progress = Math.round((barWidth * (i + 1)) / total);
            const bar = "█".repeat(progress) + "-".repeat(barWidth - progress);
            
            ns.tprint(`[${host}] [${bar}] ${percent}% | ${i + 1}/${total} | Syncing: ${fileName}`);
            
            const fileUrl = `${baseUrl}${fileName}?${bustParam}`;
            const success = await ns.wget(fileUrl, fileName);
            if (!success) {
                ns.tprint(`[${host}]   ❌ Failed: ${fileName}`);
            }
        }

        ns.tprint(`[${host}] ✨ Pull complete! ${total} scripts are up to date.`);

    } catch (error) {
        ns.tprint(`[${host}] ❌ System Error: ${error.message}`);
    }
}
