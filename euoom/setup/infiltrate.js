/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0] || "foodnstuff";
    const hackScript = "/scripts/hack/engine.js"; // 배포할 기본 해킹 스크립트

    /** 서버 침투 및 루트 획득 (Nuke) */
    function nuke(server) {
        let portsOpen = 0;
        if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); portsOpen++; }
        if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); portsOpen++; }
        if (ns.fileExists("RelaySMTP.exe", "home")) { ns.relaysmtp(server); portsOpen++; }
        if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); portsOpen++; }
        if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); portsOpen++; }

        if (ns.getServerNumPortsRequired(server) <= portsOpen) {
            ns.nuke(server);
            return true;
        }
        return false;
    }

    if (nuke(target)) {
        ns.tprint(`✅ Successfully Nuked: ${target}`);
        
        // 스크립트 배포
        await ns.scp(hackScript, target, "home");
        ns.tprint(`📦 Script copied to ${target}: ${hackScript}`);
        
        // 백도어 안내
        if (ns.getServerMaxMoney(target) > 0 && !ns.getServer(target).backdoorInstalled) {
            ns.tprint(`💡 Recommendation: Install backdoor manually if needed (Home -> Connect ${target} -> Backdoor)`);
        }
    } else {
        ns.tprint(`❌ Failed to Nuke ${target}. Not enough ports open or hacking level too low.`);
    }
}
