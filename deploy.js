/** @param {NS} ns */
export async function main(ns) {
	let server = ns.getHostname();

	for (let s of ns.ps()) {
		if (["h.js", "w.js", "g.js"].indexOf(s.filename) !== -1) ns.kill(s.pid)
	}
	
	let count = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / 23.95) - 1;

	ns.run("h.js", count, ns.args[0]);
	await ns.sleep(500);
	ns.run("w.js", count * 2, ns.args[0]);
	await ns.sleep(500);
	ns.run("g.js", count * 10, ns.args[0]);
}