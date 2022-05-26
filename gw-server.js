/** @param {NS} ns */
export async function main(ns) {
	var server = ns.args[0];
	ns.print("weakening ", server);

	if (ns.fileExists("BruteSSH.exe")) ns.brutessh(server);
	if (ns.fileExists("FTPCrack.exe")) ns.ftpcrack(server);
	if (ns.fileExists("relaySMTP.exe")) ns.relaysmtp(server);
	if (ns.fileExists("HTTPWorm.exe")) ns.httpworm(server);
	if (ns.fileExists("SQLInject.exe")) ns.sqlinject(server);
	ns.nuke(server);

	await ns.scp(["weaken.js"], server);
	ns.killall(server);

	let serverRam = ns.getServerMaxRam(server);
	let gwcount = Math.floor(serverRam/1.8);

	if (gwcount > 0) ns.exec("weaken.js", server, gwcount);
}