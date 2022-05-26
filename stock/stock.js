/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog("ALL");

	let comps = ns.stock.getSymbols();
	comps.sort((a, b) => ns.stock.getVolatility(b) - ns.stock.getVolatility(a));
	while (true) {
		for (let comp of comps) {
			process(ns, comp);
		}
		await ns.sleep(3000);
	}
}

function myMoney(ns) {
	return ns.getServerMoneyAvailable("home") - 100000;
}

function process(ns, comp) {
	let pos = ns.stock.getPosition(comp);
	let money = myMoney(ns);
	if (money > 100000000000) buyAll(ns, comp, money, pos);
	if (pos[0] > 0) sellLongS(ns, comp, pos[0]);
	else if (pos[2] > 0) sellShortS(ns, comp, pos[2]);
	else if (money > 10000000) buyAll(ns, comp, money, pos);
}

function buyAll(ns, comp, money, pos) {
	let shares = Math.min(Math.floor(money / ns.stock.getAskPrice(comp)), ns.stock.getMaxShares(comp) - pos[0] - pos[2]);
	let forecast = ns.stock.getForecast(comp);
	if (forecast > 0.523) ns.stock.buy(comp, shares);
	else if (forecast < 0.476) ns.stock.short(comp, shares);
}

function sellLongS(ns, comp, shares) {
	if (ns.stock.getForecast(comp) < 0.523) ns.stock.sell(comp, shares);
}

function sellShortS(ns, comp, shares) {
	if (ns.stock.getForecast(comp) > 0.476) ns.stock.sellShort(comp, shares);
}