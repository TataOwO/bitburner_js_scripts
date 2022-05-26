/** @param {NS} ns */
export async function main(ns) {
	for (let s of ns.ps(ns.getHostname())) {
		if (s.filename.startsWith("/batch")) ns.kill(s.pid);
	}
}