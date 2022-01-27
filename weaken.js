/** @param {NS} ns **/
export async function main(ns) {
	let server = ns.getHostname();

	while (true) {
		await ns.weaken(server);
	}
}