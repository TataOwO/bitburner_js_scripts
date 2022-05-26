/** @param {NS} ns */
export async function main(ns) {
    var corp = ns.corporation;
    var upgrades = ["Smart Factories", "Smart Storage", "DreamSense", "Wilson Analytics",
    "Nuoptimal Nootropic Injector Implants", "Speech Processor Implants", "Neural Accelerators",
    "FocusWires", "ABC SalesBots", "Project Insight"];
    let min, item, cost;
    while (true) {
        min = Infinity;
        for (let each of upgrades) {
            cost = corp.getUpgradeLevelCost(each);
            if (cost < min) {
                min = cost;
                item = each;
            }
        }
        if (myMoney(corp) > min) corp.levelUpgrade(item);
        await ns.sleep(1);
    }
}

function myMoney(corp) {
    return corp.getCorporation().funds;
}