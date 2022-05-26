/** @param {NS} ns **/
export async function main(ns) {
	const server = ns.args[0];
	var time = 40;
	if (ns.args.length > 2) time = Math.floor(ns.args[1]);
	const host = ns.getHostname();

	for (let s of ns.ps(host)) {
		let name = s.filename;
		let pid = s.pid;
		if (name.startsWith("/batch/") && !name.endsWith("batch.js") && !name.endsWith("dep.js")) ns.kill(pid);
	}

	if (!ns.hasRootAccess(server)) ns.exit();

	let sleepTime = Math.floor(time / 2);
	let id, now, ht, wt, gt, he = true;
	let gc = 0, hc = 0, wc = 0;
	let due = Date.now() + ns.getWeakenTime(server);

	while (true) {
		id = createId(10);
		now = Date.now();
		ht = Math.floor(now + ns.getHackTime(server));
		wt = Math.floor(now + ns.getWeakenTime(server));
		gt = Math.floor(now + ns.getGrowTime(server));

		if (he) {
			if (ht > due) he = false;
			gt %= time * 2; wt %= time * 2;
			if (!wc && wt < time) {
				ns.run("/batch/weaken.js", 1, server, id);
				wc = 2;
			} else if (!gc) {
				ns.run("/batch/grow.js", 1, server, id);
				gc = 2;
			}
		} else if (ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server) > 0.9) {
			ht %= time * 4; gt %= time * 4; wt %= time * 4;
			if (!hc && ht >= time && ht < time * 2) {
				ns.run("/batch/hack.js", 1, server, id);
				hc = 2;
			}
			if (!wc && wt < time || wt >= time * 2 && wt < time * 3) {
				ns.run("/batch/weaken.js", 1, server, id);
				wc = 2;
			}
			if (!gc && gt >= time * 3) {
				ns.run("/batch/grow.js", 1, server, id);
				gc = 2;
			}
		} else {
			ht %= time * 6; gt %= time * 6; wt %= time * 6;
			if (!hc && ht >= time && ht < time * 2) {
				ns.run("/batch/hack.js", 1, server, id);
				hc = 2;
			}
			if (!wc && wt < time || wt >= time * 2 && wt < time * 3 || wt >= time * 4 && wt < time * 5) {
				ns.run("/batch/weaken.js", 1, server, id);
				wc = 2;
			}
			if (!gc && gt >= time * 3 && gt < time * 4 || gt >= time * 5) {
				ns.run("/batch/grow.js", 1, server, id);
				gc = 2;
			}
		}
		
		if (wc) --wc;
		if (hc) --hc;
		if (gc) --gc;
		await ns.sleep(sleepTime);
	}
}

function createId(len) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < len; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}