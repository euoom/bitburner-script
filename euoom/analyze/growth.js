/** @param {NS} ns */
export async function main(ns) {
    let hostName
    if (ns.args.length > 0) {
        hostName = ns.args[0]
    } else {
        hostName = ns.getHostname()
    }
    
    let serverRawData = ns.read(`/euoom/server/info/${hostName}.txt`)
    let serverData
    if (serverRawData == '') {
        serverData = {}
    } else {
        serverData = JSON.parse(serverRawData)
    }

    serverData['growth'] = ns.getServerGrowth(hostName)
    ns.write(`/analysis/server/${hostName}.txt`, JSON.stringify(serverData, null, 4), "w")
}
