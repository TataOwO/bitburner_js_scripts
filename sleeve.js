/** @param {NS} ns **/
export async function main(ns) {
	let stat, num;
	num = ns.sleeve.getNumSleeves();
	while (true) {
		for (let t = 0; t < num; ++t) {
			stat = ns.sleeve.getSleeveStats(t);
			if (stat.shock > 85) ns.sleeve.setToShockRecovery(t);
			else if (stat.strength < 75 && stat.defense < 75 && stat.dexterity < 75 && stat.agility < 75) ns.sleeve.setToCommitCrime(t, "Mug Someone");
			else ns.sleeve.setToCommitCrime(t, "Homicide");
		}
		await ns.sleep(1e4);
	}
}