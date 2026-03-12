const fs = require('fs');
const path = require('path');

/**
 * euoom 디렉토리 내의 .js 파일들을 찾아 manifest.json을 생성합니다.
 */
function generateManifest() {
    const rootDir = __dirname;
    const targetDir = path.join(rootDir, 'euoom');
    const outputFile = path.join(rootDir, 'manifest.json');

    if (!fs.existsSync(targetDir)) {
        console.log(`📁 Creating euoom directory...`);
        fs.mkdirSync(targetDir, { recursive: true });
    }

    function scanDirectory(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                scanDirectory(filePath, fileList);
            } else if (file.endsWith('.js')) {
                const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
                fileList.push(relativePath);
            }
        });
        return fileList;
    }

    try {
        const scripts = scanDirectory(targetDir);
        
        // 루트의 pull.js 도 존재한다면 목록에 추가
        if (fs.existsSync(path.join(rootDir, 'pull.js'))) {
            scripts.unshift('pull.js');
        }

        const manifest = {
            files: scripts
        };

        fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 4), 'utf8');
        console.log(`✅ Generated manifest.json with ${scripts.length} scripts.`);
        scripts.forEach(s => console.log(`   - ${s}`));
    } catch (error) {
        console.error(`❌ Error scanning scripts: ${error.message}`);
    }
}

generateManifest();
