/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		moveCity(ns);
		while (buySkill(ns)) continue;
		await ns.sleep(await doTask(ns));
	}
}

function moveCity(ns) {
	let max = 0;
	let ct = "";
	let cities = ["Sector-12","Aevum","Volhaven","Chongqing","New Tokyo","Ishima"];
	for (let c of cities) {
		let ppl = ns.bladeburner.getCityEstimatedPopulation(c);
		if (ppl > max) {
			max = ppl;
			ct = c;
		}
	}
	if (ns.bladeburner.getCity() != ct) ns.bladeburner.switchCity(ct);
}

function getCurrentOp(ns) {
	let ops = ns.bladeburner.getBlackOpNames();
	ops.pop();
	for (let t of ops) {
		if (ns.bladeburner.getActionCountRemaining("blackops", t)) return t;
	}
	return 0;
}

async function doTask(ns) {
	var stamina = ns.bladeburner.getStamina();
	var r = stamina[0] / stamina[1];
	if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 50) {
		ns.bladeburner.startAction("general", "Diplomacy");
		return calculateTime(ns, ns.bladeburner.getActionTime("general", "Diplomacy"));
	}
	if (r < 0.55) {
		ns.bladeburner.startAction("general", "Field Analysis");
		return calculateTime(ns, ns.bladeburner.getActionTime("general", "Field Analysis"));
	}
	let remain = false;
	let type = "blackops";
	let tasks = ns.bladeburner.getBlackOpNames();
	if (getCurrentOp(ns)) {
		let t = getCurrentOp(ns);
		let s = ns.bladeburner.getActionEstimatedSuccessChance(type, t);
		let rankReq = ns.bladeburner.getBlackOpRank(t);
		if (s[0] + s[1] > 1.6 && ns.bladeburner.getRank() >= rankReq) {
			ns.bladeburner.startAction(type, t);
			return calculateTime(ns, ns.bladeburner.getActionTime(type, t));
		}
	}
	type = "operations";
	tasks = ns.bladeburner.getOperationNames().reverse();
	if (ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity()) < 1000000000) {
		let t = "Investigation"; 
		ns.bladeburner.startAction(type, t);
		return calculateTime(ns, ns.bladeburner.getActionTime(type, t))
	}
	for (let t of tasks) {
		let s = ns.bladeburner.getActionEstimatedSuccessChance(type, t);
		let count = ns.bladeburner.getActionCountRemaining(type, t);
		remain |= count;
		if (s[0] + s[1] > 1.6 && count) {
			ns.bladeburner.startAction(type, t);
			return calculateTime(ns, ns.bladeburner.getActionTime(type, t));
		}
	}
	type = "contracts";
	tasks = ns.bladeburner.getContractNames().reverse();
	for (let t of tasks) {
		let s = ns.bladeburner.getActionEstimatedSuccessChance(type, t);
		let count = ns.bladeburner.getActionCountRemaining(type, t);
		remain |= count;
		if (s[0] + s[1] > 1.6 && count) {
			ns.bladeburner.startAction(type, t);
			return calculateTime(ns, ns.bladeburner.getActionTime(type, t));
		}
	}
	if (remain) {
		let t = "Tracking";
		let s = ns.bladeburner.getActionEstimatedSuccessChance(type, t);
		let count = ns.bladeburner.getActionCountRemaining(type, t);
		remain |= count;
		if (s[0] + s[1] > 1 && count) {
			ns.bladeburner.startAction(type, t);
			return calculateTime(ns, ns.bladeburner.getActionTime(type, t));
		} else {
			ns.bladeburner.startAction("general", "Field Analysis");
			return calculateTime(ns, ns.bladeburner.getActionTime("general", "Field Analysis"));
		}
	} else {
		ns.bladeburner.startAction("general", "Incite Violence");
		return calculateTime(ns, ns.bladeburner.getActionTime("general", "Incite Violence"));
	}
}

function calculateTime(ns, time) {
	let bonus = ns.bladeburner.getBonusTime();
	if (bonus / 5 * 4 > time) {
		time /= 5;
		return time - (time % 1000) + 1000;
	}
	let t = bonus / 5;
	return time - bonus + t - (t % 1000) + 1000;
}

function buySkill(ns) {
	const skill = ns.bladeburner.getSkillNames();
	const skillPoints = [];
	for (let s of skill) {
		let skillLevel = ns.bladeburner.getSkillLevel(s);
		let req = ns.bladeburner.getSkillUpgradeCost(s);
		switch (s) {
			case "Blade's Intuition": case "Evasive System":
				skillPoints.push(req * skillLevel / (skillLevel + 1));
				break;
			case "Cloak": case "Short-Circuit":
				skillPoints.push(req * skillLevel / (skillLevel + 1) / 5.5 * 3);
				break;
			case "Digital Observer":
				skillPoints.push(req * skillLevel / (skillLevel + 1) / 4 * 3);
				break;
			case "Tracer":
				let c = ns.bladeburner.getContractNames();
				let p = false;
				for (let n of c) { if (ns.bladeburner.getActionEstimatedSuccessChance("contracts", n)[0] < 1) p = true; };
				skillPoints.push(req * skillLevel / (skillLevel + 1) / 4 * 3 * ((p) ? 100 : 1));
				break;
			case "Overclock":
				skillPoints.push((skillLevel == 90) ? req * 10000: req);
				break;
			case "Reaper":
				skillPoints.push(req * skillLevel / (skillLevel + 1) * 2);
				break;
			case "Datamancer":
				skillPoints.push(req * 3);
				break;
			 case "Cyber's Edge": case "Hands of Midas": case "Hyperdrive":
			 	skillPoints.push((ns.bladeburner.getStamina()[1] < 2000) ? req * 2 : 10000);
		}
	}
	return ns.bladeburner.upgradeSkill(skill[skillPoints.indexOf(Math.min.apply(null, skillPoints))]);
}