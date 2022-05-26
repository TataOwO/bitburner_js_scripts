/** @param {NS} ns */
export async function main(ns) {
	let cur = ns.getHostname();
	let target = ns.args[0];
	if (cur === target) ns.exit()

	let found = [];
	let path = find(ns, cur, target, found);

	for (let each of path[0]) {
		ns.connect(each);
	}
}

function find(ns, current, target, found) {
	let scanned = ns.scan(current);
	for (let each of scanned) {
		if (each === target) return [[each], found];
		if (found.indexOf(each) === -1) {
			found.push(each);
			let path = find(ns, each, target, found);
			found = path[1];
			if (path[0]) {
				path[0].unshift(each)
				return [path[0], found];
			}
		}
	}
	return [false, found];
}