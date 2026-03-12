/** @param {NS} ns */
export async function main(ns) {
    const defaultUser = "euoom";
    const defaultRepo = "bitburner-script";
    const defaultBranch = "master";

    const user = ns.args[0] || defaultUser;
    const repo = ns.args[1] || defaultRepo;
    const branch = ns.args[2] || defaultBranch;

    const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/`;
    const manifestUrl = `${baseUrl}manifest.json`;

    const host = ns.getHostname();

    ns.tprint(`[${host}] 🚀 Starting Bitburner Pull System...`);
    ns.tprint(`[${host}] Source: ${user}/${repo} (${branch})`);

    try {
        ns.tprint(`[${host}] Attempting to download manifest.json...`);
        const manifestResult = await ns.wget(manifestUrl, "temp_manifest.json");

        if (!manifestResult) {
            ns.tprint(`[${host}] ❌ Failed to download manifest.json. Ensure the file exists in the repo.`);
            return;
        }

        const manifestContent = JSON.parse(ns.read("temp_manifest.json"));
        const files = manifestContent.files || [];
        const total = files.length;

        if (total === 0) {
            ns.tprint(`[${host}] ⚠️ No files found in manifest.json`);
            return;
        }

        ns.tprint(`[${host}] Found ${total} files to download.`);

        for (let i = 0; i < total; i++) {
            const file = files[i];
            const percent = Math.round(((i + 1) / total) * 100);
            const barWidth = 20;
            const progress = Math.round((barWidth * (i + 1)) / total);
            const bar = "█".repeat(progress) + "-".repeat(barWidth - progress);
            
            // tqdm 스타일의 진행률 표시
            ns.tprint(`[${host}] [${bar}] ${percent}% | ${i + 1}/${total} | Syncing: ${file}`);
            
            const success = await ns.wget(`${baseUrl}${file}`, file);
            if (!success) {
                ns.tprint(`[${host}]   ❌ Failed to download ${file}.`);
            }
        }

        ns.rm("temp_manifest.json");
        ns.tprint(`[${host}] ✨ Pull complete! All scripts synchronized.`);

    } catch (error) {
        ns.tprint(`[${host}] ❌ Error during pull: ${error.message}`);
    }
}
