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

    ns.tprint(`🚀 Starting Bitburner Pull System...`);
    ns.tprint(`Source: ${user}/${repo} (${branch})`);

    try {
        ns.tprint(`Attempting to download manifest.json...`);
        const manifestResult = await ns.wget(manifestUrl, "temp_manifest.json");

        if (!manifestResult) {
            ns.tprint(`❌ Failed to download manifest.json. Ensure the file exists in the repo.`);
            return;
        }

        const manifestContent = JSON.parse(ns.read("temp_manifest.json"));
        const files = manifestContent.files || [];
        const total = files.length;

        if (total === 0) {
            ns.tprint(`⚠️ No files found in manifest.json`);
            return;
        }

        ns.tprint(`Found ${total} files to download.`);

        for (let i = 0; i < total; i++) {
            const file = files[i];
            const percent = Math.round(((i + 1) / total) * 100);
            const barWidth = 20;
            const progress = Math.round((barWidth * (i + 1)) / total);
            const bar = "█".repeat(progress) + "-".repeat(barWidth - progress);
            
            // tqdm 스타일의 진행률 표시
            ns.tprint(`[${bar}] ${percent}% | ${i + 1}/${total} | Syncing: ${file}`);
            
            const success = await ns.wget(`${baseUrl}${file}`, file);
            if (!success) {
                ns.tprint(`   ❌ Failed to download ${file}.`);
            }
        }

        ns.rm("temp_manifest.json");
        ns.tprint(`✨ Pull complete! All scripts synchronized.`);

    } catch (error) {
        ns.tprint(`❌ Error during pull: ${error.message}`);
    }
}
