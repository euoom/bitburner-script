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

        if (files.length === 0) {
            ns.tprint(`⚠️ No files found in manifest.json`);
            return;
        }

        ns.tprint(`Found ${files.length} files to download.`);

        for (const file of files) {
            ns.tprint(`📥 Downloading ${file}...`);
            const success = await ns.wget(`${baseUrl}${file}`, file);
            if (success) {
                ns.tprint(`✅ ${file} downloaded successfully.`);
            } else {
                ns.tprint(`❌ Failed to download ${file}.`);
            }
        }

        ns.rm("temp_manifest.json");
        ns.tprint(`✨ Pull complete! All scripts synchronized.`);

    } catch (error) {
        ns.tprint(`❌ Error during pull: ${error.message}`);
    }
}
