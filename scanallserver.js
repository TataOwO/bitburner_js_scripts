/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"]

	ns.disableLog("scan");

	for (let i = 0; i < servers.length; i++) {
		let scanned = ns.scan(servers[i]);
		for (let j = 0; j < scanned.length; j++) {
			if (servers.indexOf(scanned[j]) === -1) {
				servers.push(scanned[j]);
			}
		}
	}

	servers.shift();

	ns.print(servers);
	await ns.write("AllServers.txt", servers.join(","), "w");
}