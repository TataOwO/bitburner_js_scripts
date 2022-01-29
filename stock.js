/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("hack");

	let comps = ns.stock.getSymbols();

	for (let i = 0; true; i = (i+1) % comps.length) {
		process(ns, comps[i]);
		await ns.sleep(500);
	}
}

function myMoney (ns) {
	return ns.getServerMoneyAvailable("home");
}

function process(ns, comp) {
	let pos = ns.stock.getPosition(comp);
	let money = myMoney(ns)
	if (pos[0] > 0) sellAll(ns, comp, pos[0]);
	else if (money > 100000000) buyAll(ns, comp, money);
}

function buyAll(ns, comp, money) {
	let shares = Math.floor(money / ns.stock.getAskPrice(comp)) - 10;
	if (shares > ns.stock.getMaxShares(comp)) shares = ns.stock.getMaxShares(comp);
	if (ns.stock.getForecast(comp) > 0.523) ns.stock.buy(comp, shares);
}

function sellAll(ns, comp, shares) {
	if (ns.stock.getForecast(comp) < 0.5) ns.stock.sell(comp, shares);
}