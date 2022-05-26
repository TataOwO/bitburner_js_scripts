/** @param {NS} ns **/
export async function main(ns) {
	var crimeName = "";
	ns.args.forEach((a) => {crimeName += a; crimeName += " "});
	while (true) {
		ns.commitCrime(crimeName);
		await ns.sleep(500);
		if (!ns.isBusy()) break;
		while (ns.isBusy()) await ns.sleep(10);
	}
}