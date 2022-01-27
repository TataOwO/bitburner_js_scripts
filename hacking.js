/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("hack");
	ns.disableLog("getHackingLevel");
	ns.disableLog("getServerRequiredHackingLevel");
	ns.disableLog("run");
	ns.disableLog("getServerNumPortsRequired");

	if (!ns.fileExists("AllServers.txt")) ns.run("scanallserver.js");
	while (ns.isRunning("scanallserver.js")) await ns.sleep(1000);
	var server = ns.read("AllServers.txt").split(",");
	
	for (let index = 0; server.length > 0; index = (++index) % server.length) {
		if (ns.getServerRequiredHackingLevel(server[index]) <= ns.getHackingLevel() && ns.getServerNumPortsRequired(server[index]) <= myPorts(ns)) {
			ns.print("hacking ", server[index]);
			await ns.write("hackserver.txt", server[index], "w");
			while (ns.isRunning("hack-server.js", "home")) await ns.hack("n00dles");
			ns.run("hack-server.js");
			server.splice(index, 1);
			index--;
		}
		await ns.hack("n00dles");
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