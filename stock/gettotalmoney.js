/** @param {NS} ns **/
export async function main(ns) {
	let comps = ns.stock.getSymbols();
	let money = ns.getServerMoneyAvailable("home");
	let j = 0;
	let a = ["", "k", "m", "b", "t", "q", "Q"];
	for (let i = 0; i < comps.length; i++) {
		let pos = ns.stock.getPosition(comps[i]);
		money += pos[0]*pos[1] + pos[2]*pos[3];
	}
	while (money > 1000000) {
		money /= 1000
		j++;
	}
	money = Math.floor(money);
	money /= 1000
	
	ns.tprint(money.toString(), a[j+1]);
}