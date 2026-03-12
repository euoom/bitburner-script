/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0]
    let src = ns.args[1]
    let dest = ns.args[2]

    let src_files = ns.ls(host, src)
    for (let src_file of src_files) {
        // let name = src_file.split(src).at(-1)
        let name = src_file.split('/').at(-1)
        let dest_file = dest + name
        ns.mv(host, src_file, dest_file)
    }
}
