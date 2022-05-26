/** @param {NS} ns **/
export async function main(ns) {
	let server = ns.args[0];

	while (true) {
		await ns.grow(server);
	}
}