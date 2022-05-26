/** @param {NS} ns **/
export async function main(ns) {
	let server = ns.getHostname();

	for (let s of ns.ps()) {
		if (["h.js", "w.js", "g.js"].indexOf(s.filename) !== -1) ns.kill(s.pid)
	}
	
	let count = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / 1.75) - 10;
	ns.run("w.js", count, ns.args[0]);
}