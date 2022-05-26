/** @param {NS} ns */
export async function main(ns) {
	var target;
	ns.args.forEach((a) => {target += a; target += " "});
	target = target.slice(9, target.length-1);
	ns.tprint(target)
	while (true) {
		while (ns.hacknet.numHashes() > ns.hacknet.hashCost(target)) ns.hacknet.spendHashes(target);
		await ns.sleep(10000);
	}
}