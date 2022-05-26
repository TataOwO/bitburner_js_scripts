/** @param {NS} ns **/

var augmentations = {};
const check = (name) => {if (augmentations[name] === undefined) augmentations[name] = {factions:[],stat:{}};}

export async function main(ns) {
	const factions = (await ns.read("/singularity/factionList.txt")).split(",");
	if (ns.length === 0) throw "Must pass an argument";
	const name = ns.args[0];
	const owned = ns.getOwnedAugmentations(true);
	
	for (let f of factions) {
		let aug = ns.getAugmentationsFromFaction(f);
		for (let a of aug) {
			if (owned.indexOf(a) !== -1) continue;
			let stat = ns.getAugmentationStats(a);
			for (let kn of Object.keys(stat)) {
				if (kn.startsWith(name)) {
					check(a);
					if (augmentations[a].factions.indexOf(f) === -1) augmentations[a].factions.push(f);
					if (factions.indexOf(f) === -1) factions.push(f);
					(augmentations[a].stat)[kn] = stat[kn];
				}
			}
		}
	}
	for (let kn of Object.keys(augmentations)) {
		ns.tprint(kn, ": ", augmentations[kn]);
	}
}