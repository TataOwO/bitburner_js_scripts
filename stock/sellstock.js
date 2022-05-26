/** @param {NS} ns **/
export async function main(ns) {
	let corps = ns.stock.getSymbols();
	let len = corps.length;
	for (let i = 0; i < len; i++) {
		let pos = ns.stock.getPosition(corps[i]);
		if (pos[0] > 0) ns.stock.sell(corps[i], pos[0]);
		if (pos[2] > 0) ns.stock.sellShort(corps[i], pos[2]);
	}
	if (ns.isRunning("/stock/stock.js")) ns.kill("/stock/stock.js", "home");
	if (ns.isRunning("/stock/no4s.js")) ns.kill("/stock/no4s.js", "home");
}