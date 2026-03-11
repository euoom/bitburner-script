const fs = require('fs');
const path = require('path');

/**
 * scripts 디렉토리 내의 .js 파일들을 찾아 manifest.json을 생성합니다.
 */
function generateManifest() {
    const scriptDir = path.join(__dirname, 'scripts');
    const outputFile = path.join(__dirname, 'manifest.json');

    if (!fs.existsSync(scriptDir)) {
        console.log(`📁 Creating scripts directory...`);
        fs.mkdirSync(scriptDir, { recursive: true });
        // 기본 템플릿 파일 생성
        const templatePath = path.join(scriptDir, 'template.js');
        if (!fs.existsSync(templatePath)) {
            fs.writeFileSync(templatePath, "/** @param {NS} ns */\nexport async function main(ns) {\n    ns.tprint('Hello from Bitburner Assistant!');\n}");
        }
    }

    function getAllFiles(dirPath, arrayOfFiles) {
        const files = fs.readdirSync(dirPath);

        arrayOfFiles = arrayOfFiles || [];

        files.forEach(function(file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else if (file.endsWith('.js')) {
                // 프로젝트 루트 기준의 상대 경로를 추출 (예: scripts/analyze/network_scan.js)
                const relativePath = path.relative(__dirname, path.join(dirPath, file)).replace(/\\/g, '/');
                arrayOfFiles.push(relativePath);
            }
        });

        return arrayOfFiles;
    }

    try {
        const scripts = getAllFiles(scriptDir);
        
        const manifest = {
            files: scripts
        };

        fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 4), 'utf8');
        console.log(`✅ Generated manifest.json with ${scripts.length} scripts.`);
    } catch (error) {
        console.error(`❌ Error scanning scripts: ${error.message}`);
    }
}

generateManifest();
