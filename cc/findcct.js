/** @param {NS} ns **/
export async function main(ns) {
	var servers = await ns.read("AllServers.txt").split(",");

	for (let i in servers) {
		let s = servers[i];
		let files = ns.ls(s, "\.cct");
		if (files.length) ns.tprint(s, " ", files);
	}
}