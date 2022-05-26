/** @param {NS} ns **/
export async function main(ns) {
	let servers = scanServers(ns).sort((a, b) => {return ns.getServerMaxMoney(b) - ns.getServerMaxMoney(a)});
	for (let i = 0; i < servers.length; i++) {
		if (ns.hasRootAccess(servers[i])) ns.run("/batch/batch.js", 1, servers[i]);
	}
}

function scanServers(ns) {
	let servers = ["home"]

	ns.disableLog("scan");

	for (let i = 0; i < servers.length; i++) {
		let scanned = ns.scan(servers[i]);
		for (let each of scanned) {
			if (servers.indexOf(each) === -1) servers.push(each);
		}
	}

	servers.shift();

	return servers;
}