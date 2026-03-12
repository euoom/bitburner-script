/** @param {NS} ns */
export async function main(ns) {
    const host = ns.getHostname();
    const targets = [];
    const allFiles = ns.ls(host);
    const backupData = {
        timestamp: new Date().toLocaleString(),
        folders: targets,
        files: {}
    };

    if (targets.length > 0) {
        ns.tprint(`[${host}] 🔍 Scanning specified folders: ${targets.join(", ")}...`);
    } else {
        ns.tprint(`[${host}] 🔍 No target specified. Scanning ALL files...`);
    }

    let count = 0;
    for (const file of allFiles) {
        // targets가 비어있으면 전체 백업, 아니면 지정된 폴더로 시작하는 파일만 필터링
        if (targets.length === 0 || targets.some(folder => file.startsWith(folder + "/"))) {
            backupData.files[file] = ns.read(file);
            count++;
        }
    }

    if (count === 0) {
        ns.tprint(`[${host}] ⚠️ No files found in the specified folders.`);
        return;
    }

    ns.tprint(`[${host}] 📦 Bundling ${count} files...`);

    try {
        const json = JSON.stringify(backupData, null, 2);
        const fileName = `bitburner_backup_${new Date().getTime()}.json`;

        // 브라우저의 전역 document 객체를 활용하여 다운로드 트리거
        const doc = eval("document");
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = doc.createElement('a');
        
        a.href = url;
        a.download = fileName;
        doc.body.appendChild(a);
        a.click();
        doc.body.removeChild(a);
        URL.revokeObjectURL(url);

        ns.tprint(`[${host}] ✨ Backup success! Check your browser's download folder.`);
        ns.tprint(`[${host}] 📄 File saved as: ${fileName}`);
        
    } catch (error) {
        ns.tprint(`[${host}] ❌ Backup failed: ${error.message}`);
    }
}
