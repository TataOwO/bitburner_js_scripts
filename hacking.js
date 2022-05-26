/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");

	var server = scanServers(ns);

	for (let index = 0; server.length > 0; index = (++index) % server.length) {
		let hackingLevel = ns.getPlayer().hacking;
		let serverStat = ns.getServer(server[index]);
		if (serverStat.requiredHackingSkill <= hackingLevel && serverStat.numOpenPortsRequired <= myPorts(ns) && serverStat.minDifficulty + 0.1 > serverStat.hackDifficulty) {
			ns.print("hacking ", server[index]);
			ns.run("hack-server.js", 1, server[index]);
			server.splice(index, 1);
			index--;
		} else if (serverStat.requiredHackingSkill <= hackingLevel && serverStat.numOpenPortsRequired <= myPorts(ns) && !ns.isRunning("weaken.js", server[index])) {
			ns.print("gw ", server[index]);
			ns.run("gw-server.js", 1, server[index]);
			if (ns.getServerMaxRam(server[index]) == 0) server.splice(index, 1);
		}
		await ns.sleep(500);
	}
}

function myPorts(ns) {
	var count = 0;
	if (ns.fileExists("BruteSSH.exe")) count++;
	if (ns.fileExists("FTPCrack.exe")) count++;
	if (ns.fileExists("relaySMTP.exe")) count++;
	if (ns.fileExists("HTTPWorm.exe")) count++;
	if (ns.fileExists("SQLInject.exe")) count++;
	return count;
}

function scanServers(ns) {
	let servers = ["home"]

	ns.disableLog("scan");

	for (let i = 0; i < servers.length; i++) {
		let scanned = ns.scan(servers[i]);
		for (let each of scanned) {
			if (servers.indexOf(each) === -1 && !each.startsWith("hacknet")) servers.push(each);
		}
	}

	servers.shift();

	return servers;
}