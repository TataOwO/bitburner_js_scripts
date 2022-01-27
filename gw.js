/** @param {NS} ns **/
export async function main(ns) {
	let server = ns.getHostname();
	let minSecurity = ns.getServerMinSecurityLevel(server) + .1;

	while (true) {
		if (ns.getServerSecurityLevel(server) > minSecurity)
			await ns.weaken(server);
		else
			await ns.grow(server);
	}

}