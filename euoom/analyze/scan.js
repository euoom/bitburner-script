/** @param {NS} ns */
export async function main(ns) {
    let hostName
    if (ns.args.length > 0) {
        hostName = ns.args[0]
    } else {
        hostName = ns.getHostname()
    }
    const scanData = {}
    const treeData = {}

    const q = [[hostName, treeData]]
    const visited = new Set()
    while (q.length > 0){
        let [parent, parentTree] = q.pop()
        if (parentTree[parent] == undefined){
            parentTree[parent] = {}
        }
        let currentTree = parentTree[parent]

        visited.add(parent)
        ns.tprint('scanning: ', parent)
        for (let child of ns.scan(parent)) {
            if (!visited.has(child)) {
                q.push([child, currentTree])
                if (scanData[parent] === undefined){
                    scanData[parent] = [child]
                } else {
                    scanData[parent].push(child)
                }
            }

        }
    }

    let resultList = '/euoom/server/list.txt'
    let resultScan = '/euoom/server/scan.txt'
    let resultTree = '/euoom/server/tree.txt'
    
    ns.write(resultList, JSON.stringify([...visited], null, 4), "w")
    ns.tprint(`list result saved at ${resultList}`)
    ns.write(resultScan, JSON.stringify(scanData, null, 4), "w")
    ns.tprint(`scan result saved at ${resultScan}`)
    ns.write(resultTree, JSON.stringify(treeData, null, 4), "w")
    ns.tprint(`tree result saved at ${resultTree}`)
}
