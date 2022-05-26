/** @param {NS} ns **/
export async function main(ns) {
	var m = [1, 3, 2, 5, 4];
	m.sort((a, b) => {return a-b;});
	ns.tprint(m);
}