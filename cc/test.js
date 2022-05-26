/** @param {NS} ns */
export async function main(ns) {
	var attempt = ns.codingcontract.attempt;
	var getContractType = ns.codingcontract.getContractType;
	var getData = ns.codingcontract.getData;
	var getNumTriesRemaining = ns.codingcontract.getNumTriesRemaining;
	let filename = "contract-803711.cct";
	let host = "joesguns";
	let type = getContractType(filename, host);
	let data = getData(filename, host);
	if (type === "Minimum Path Sum in a Triangle") {
		let arr = process();
		let min = 200000000;
		while (arr) {
			
		}
	}
}

function process(arg) {
	if (typeof(arg) == "number") {
		let arr = [];
		for (let i = 0; i < arg; i++) {
			arr.push([0]);
		}
		return arr;
	}
	
}