/** @param {NS} ns **/
export async function main(ns) {
	let server = await ns.read("hackserver.txt");

	if (ns.fileExists("BruteSSH.exe")) ns.brutessh(server);
	if (ns.fileExists("FTPCrack.exe")) ns.ftpcrack(server);
	if (ns.fileExists("relaySMTP.exe")) ns.relaysmtp(server);
	if (ns.fileExists("HTTPWorm.exe")) ns.httpworm(server);
	if (ns.fileExists("SQLInject.exe")) ns.sqlinject(server);
	ns.nuke(server);

	await ns.scp(["grow.js", "weaken.js", "hack.js", "gw.js"], server);
	ns.killall(server);

	let serverRam = ns.getServerMaxRam(server);
	let sleepTime = (ns.fileExists("Formulas.exe")) ? ns.formulas.hacking.hackTime(ns.getServer(server), ns.getPlayer()) : 1200;
	sleepTime = (sleepTime > 30000) ? 30000 : sleepTime;

	let hCount = Math.floor(serverRam / 23.35);
	hCount = (hCount == 0) ? 1 : hCount;
	serverRam -= hCount * 1.75;
	let wCount = Math.floor(serverRam / 10.8);
	serverRam -= wCount * 1.8;
	let gCount = Math.floor(serverRam / 1.8);

	let success = false;

	if (wCount > 0 && gCount > 0) {
		ns.exec("hack.js", server, hCount);
		await ns.sleep(Math.floor(sleepTime / 3));
		ns.exec("weaken.js", server, wCount);
		await ns.sleep(Math.floor(sleepTime / 3));
		ns.exec("grow.js", server, gCount);
		success = true;
	}
	if (!success) {
		let gwCount = Math.floor(serverRam / (1.75 * 1 + 2.15 * 6)) + 1;
		let hCount = Math.floor((serverRam - gwCount * 2.15) / 1.75);

		if (hCount > 0) {
			ns.exec("gw.js", server, gwCount);
			await ns.sleep(Math.floor(sleepTime / 2));
			ns.exec("hack.js", server, hCount);
		}
	}
}