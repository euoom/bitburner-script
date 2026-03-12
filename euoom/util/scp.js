/** @param {NS} ns */
export async function main(ns) {
    let hostName
    let files
    let resultScp
    if (ns.args.length > 0) {
        hostName = ns.args[0]
    } else {
        ns.tprint('give a arg for hostName')
        ns.exit(0)
    }

    files = ns.ls('home','/analysis')
    resultScp = ns.scp(files, hostName)
    ns.tprint('scp files are success.')
}
