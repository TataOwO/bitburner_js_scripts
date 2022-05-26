/** @param {NS} ns **/
export async function main(ns) {
	var taskName;
	ns.disableLog("ALL");
	ns.args.forEach((a) => {taskName += a; taskName += " "});
	if (taskName) taskName = taskName.slice(9, taskName.length-1);
	ns.tprint(taskName);
	var equipments = await ns.read("/gang/equipments.txt").split(",");
	var memberNames = ns.gang.getMemberNames();
	
	var myGang = ns.gang.getGangInformation();
    var possibleTasks = ns.gang.getTaskNames();
    var unassignedTask = possibleTasks.shift();
	
	var territoryTask = possibleTasks.pop();
    var trainingTasks = possibleTasks.splice(possibleTasks.length-3, 3);
    var wantedLevelLowerTask = possibleTasks.pop();
	
	var desirableAugs = [];
	
	if(myGang.isHacking)
	{
		wantedLevelLowerTask = possibleTasks.pop();
		
		// replace combat with hacking
		trainingTasks.splice(0,1, trainingTasks[1]);
		
		desirableAugs.push("BitWire");
		desirableAugs.push("Neuralstimulator");
		desirableAugs.push("DataJack");
	}
	else
	{
		// replace hacking with combat
		trainingTasks.splice(1,1, trainingTasks[0]);
		
		desirableAugs.push("Bionic Arms");
		desirableAugs.push("Bionic Legs");
		desirableAugs.push("Bionic Spine");
		desirableAugs.push("BrachiBlades");
		desirableAugs.push("Nanofiber Weave");
		desirableAugs.push("Synthetic Heart");
		desirableAugs.push("Synfibril Muscle");
		desirableAugs.push("Graphene Bone Lacings");
	}

	var buyableEquipment = ns.gang.getEquipmentNames().filter(e => {
		return ns.gang.getEquipmentType(e) != "Augmentation" || desirableAugs.includes(e);
	});
	buyableEquipment.sort((a, b) => {
		return ns.gang.getEquipmentCost(a) - ns.gang.getEquipmentCost(b);
	});
	
	while (true) {
		memberNames = ns.gang.getMemberNames();
		memberNames.sort((a, b) => Math.random()*2-1);
		if (ns.gang.canRecruitMember()) await recruit(ns);
		for (let member of memberNames) {
			await buyEQ(ns, member, buyableEquipment);
			await doAscend(ns, member);
			if (taskName) await assignTask(ns, member, taskName);
			// await assignTask(ns, member, ns.gang.getMemberInformation(member));
		}
		// controlWanted(ns, memberNames);
		await ns.sleep(100);
	}
}

async function recruit(ns) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   await ns.gang.recruitMember(result);
}

async function assignTask(ns, name, taskName) {
	let stat = ns.gang.getMemberInformation(name);
	// ns.print(info.task);
	let info = ns.gang.getGangInformation();
	if (info.wantedLevel > 10) {
		ns.gang.setMemberTask(name, "Vigilante Justice");	
	} else if (taskName == "Mug People" && (stat.str < 30 || stat.def < 30 || stat.dex < 30 || stat.agi < 30)) {
		ns.gang.setMemberTask(name, "Train Combat");
	} else if (taskName == "Terrorism" && (stat.str < 500 || stat.def < 500 || stat.dex < 100 || stat.agi < 150)) {
		ns.gang.setMemberTask(name, "Train Combat");
	} else if (taskName == "Train Combat" && info.respect < 500  && !(stat.str < 30 || stat.def < 30 || stat.dex < 30 || stat.agi < 30)) {
		ns.gang.setMemberTask(name, "Mug People");
	}
	else ns.gang.setMemberTask(name, taskName);
}

function checkStat(stat, num) {
	if (stat.str < num * stat.str_mult * stat.str_asc_mult &&
		stat.def < num * stat.def_mult * stat.def_asc_mult &&
		stat.dex < num * stat.dex_mult * stat.dex_asc_mult &&
		stat.agi < num * stat.agi_mult * stat.agi_asc_mult) {
		return true;
	}
	return false;
}

async function controlWanted(ns, members) {
	let gangInfo = ns.gang.getGangInformation();

	if (gangInfo.wantedLevel > 10000 && gangInfo.wantedLevelGainRate > 0) {
		for (i in members) {
			m = members[i];
			ns.gang.setMemberTask(m, "Vigilante Justice");
		}
	} if (gangInfo.wantedLevel == 1 && gangInfo.wantedLevelGainRate < 0) {
		for (let i = 0; i < members.length; i++) {
			if (ns.gang.getMemberInformation(members[i]).task == "Vigilante Justice")
				await ns.gang.setMemberTask(members[i], "Train Combat");
		}
	}
}

async function buyEQ(ns, member, equipments) {
	let money = myMoney(ns);
	let upg = ns.gang.getMemberInformation(member).upgrades;
	let count = 0;
	for (let i in equipments) {
		money = myMoney(ns);
		let eq = equipments[i];
		if (ns.gang.getEquipmentCost(eq) > money) break;
		if (upg.indexOf(eq) === -1) {
			ns.gang.purchaseEquipment(member, eq);
			count++;
			if (count > 9) break;
		}
	}
}

function myMoney(ns) {
	return ns.getServerMoneyAvailable("home");
}

async function doAscend(ns, member) {
	let res = await ns.gang.getAscensionResult(member);
	let info = await ns.gang.getMemberInformation(member);
	if (res === undefined) return;
	ns.print(res);
	if (res.str >= 1.3 && res.def >= 1.3 && res.dex >= 1.3 && res.agi >= 1.3) {
		await ns.gang.ascendMember(member);
	}
}