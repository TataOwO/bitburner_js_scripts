/** @param {NS} ns **/
export async function main(ns) {
	const fcacheUpg = ns.formulas.hacknetServers.cacheUpgradeCost;
	const flevelUpg = ns.formulas.hacknetServers.levelUpgradeCost;
	const framUpg = ns.formulas.hacknetServers.ramUpgradeCost;
	const fcoreUpg = ns.formulas.hacknetServers.coreUpgradeCost;
	const gainRate = ns.formulas.hacknetServers.hashGainRate;
	const myMoney = (ns) => { return ns.getServerMoneyAvailable("home") };
	let maxRam = 8192, maxLevel = 300, maxCore = 128;
	let stat, level, ram, cores, cache, hash, min;
	let ramCost, levelCost, coreCost, totalCost = 1;

	while (true) {
		for (let i of Array.from(Array(ns.hacknet.numNodes()).keys()).sort((a, b) => {return -1;})) {
			do {
				stat = ns.hacknet.getNodeStats(i);
				level = stat.level;
				ram = stat.ram;
				cores = stat.cores;
				cache = stat.cache;
				hash = stat.hashCapacity;
				ramCost = framUpg(ram) / 1000000 / (gainRate(level, 0, ram * 2, cores) - gainRate(level, 0, ram, cores));
				levelCost = flevelUpg(level) / 1000000 / (gainRate(level + 1, 0, ram, cores) - gainRate(level, 0, ram, cores));
				coreCost = fcoreUpg(cores) / 1000000 / (gainRate(level, 0, ram, cores + 1) - gainRate(level, 0, ram, cores));
				totalCost = (flevelUpg(0, level) + framUpg(0, ram) + fcoreUpg(0, cores) + ns.hacknet.getPurchaseNodeCost()) / 1000000 / gainRate(level, 0, ram, cores);
				min = Math.min(ramCost, levelCost, coreCost, totalCost);
				if (min == ramCost && ram < maxRam && min < totalCost) {
					if (myMoney(ns) > framUpg(ram)) ns.hacknet.upgradeRam(i, 1);
				} else if (min == levelCost && level < maxLevel && min < totalCost) {
					if (myMoney(ns) > flevelUpg(level)) ns.hacknet.upgradeLevel(i, 1);
				} else if (min == coreCost && cores < maxCore && min < totalCost) {
					if (myMoney(ns) > fcoreUpg(cores)) ns.hacknet.upgradeCore(i, 1);
				}
				if (gainRate(level, 0, ram, cores) * ns.hacknet.numNodes() * 50 > hash && myMoney(ns) > fcacheUpg(cache)) ns.hacknet.upgradeCache(i, 1);
				await ns.sleep(1);
			} while (min != totalCost);
		}
		while (myMoney(ns) < ns.hacknet.getPurchaseNodeCost()) await ns.sleep(20000);
		ns.hacknet.purchaseNode();
	}
}