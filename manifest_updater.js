const fs = require('fs');
const path = require('path');

/**
 * scripts 디렉토리 내의 .js 파일들을 찾아 manifest.json을 생성합니다.
 */
function generateManifest() {
    const scriptDir = path.join(__dirname, 'scripts');
    const outputFile = path.join(__dirname, 'manifest.json');

const manifestPath = path.join(__dirname, 'manifest.json');

// euoom 폴더 내부의 모든 .js 파일을 재귀적으로 찾음
function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            scanDirectory(filePath, fileList);
        } else if (file.endsWith('.js')) {
            // 프로젝트 루트 기준의 경로로 변환 (예: euoom/analyze/scan.js)
            const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
            fileList.push(relativePath);
        }
    });
    return fileList;
}

try {
    const scriptsDir = path.join(__dirname, 'euoom');
    
    // euoom 디렉토리가 없으면 생성
    if (!fs.existsSync(scriptsDir)) {
        console.log(`📁 Creating euoom directory...`);
        fs.mkdirSync(scriptsDir, { recursive: true });
        // 기본 템플릿 파일 생성
        const templatePath = path.join(scriptsDir, 'template.js');
        if (!fs.existsSync(templatePath)) {
            fs.writeFileSync(templatePath, "/** @param {NS} ns */\nexport async function main(ns) {\n    ns.tprint('Hello from Bitburner Assistant!');\n}");
        }
    }

    const scripts = scanDirectory(scriptsDir);
        
        console.log(`✅ Generated manifest.json with ${scripts.length} scripts.`);
    } catch (error) {
        console.error(`❌ Error scanning scripts: ${error.message}`);
    }
}

generateManifest();
