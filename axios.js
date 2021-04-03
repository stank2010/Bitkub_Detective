const axios = require('axios');

let address = "0xEcA19B1a87442b0c25801B809bf567A6ca87B1da";
//let url = "https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=0xEcA19B1a87442b0c25801B809bf567A6ca87B1da&startblock=0&endblock=999999999&sort=asc&apikey=K7ST5DC6VP2Z5ZVWWD1IB3JDB5AHIEV274";


let TxDict = {};
let Addr = {};

let Goto = {};


async function Req(address,TxDict,Addr,Goto){
	let url = "https://api-ropsten.etherscan.io/api?module=account&action=tokentx&address="+address+"&startblock=0&endblock=999999999&sort=asc&apikey=K7ST5DC6VP2Z5ZVWWD1IB3JDB5AHIEV274";

	let res = await axios.get(url);

	let data = res.data.result;

	let Arr = data;

	BKTC_addr = "0x38e26c68bdef7c6e7f1aea94b7ceb8d95b11bd69";

	Goto[address] = 1;
	//Addr[Arr[i].from] = 0;
	for(var i=0;i<Arr.length;i++){
		if(Arr[i].contractAddress == BKTC_addr /*&& TxDict[Arr[i].hash] == undefined */&& Goto[Arr[i].to] == undefined){
			//console.log(i,Arr[i]);
			let Val = parseInt(Arr[i].value)/Math.pow(10,18);

			console.log("TX hash :",Arr[i].hash);
			console.log("Sender :",Arr[i].from);
			console.log("Receiver :",Arr[i].to);
			console.log("Value :",Val,"BKTC");
			console.log("----------------------------- ");
			
			TxDict[Arr[i].hash] = 1;

			let Ret = await Req(Arr[i].to,TxDict,Addr,Goto);
			TxDict = Ret[0];
			Goto = Ret[2];

			if(Addr[ Arr[i].from ] == undefined){
				Addr[ Arr[i].from ] = -Val;
			}
			else {
				Addr[ Arr[i].from ] -= Val;
			}

			if(Addr[ Arr[i].to ] == undefined){
				Addr[ Arr[i].to ] = Val;
			}
			else {
				Addr[ Arr[i].to ] += Val;
			}
		}

	}

	if(address == "0xEcA19B1a87442b0c25801B809bf567A6ca87B1da"){
			//console.log(Object.keys(Addr),Addr);
		let key = Object.keys(Addr);
		for(let i=0 ;i<key.length;i++){
			if(key[i] == "0x70462d3278dac620a4d2c7ae674bc46c6916974e") //Creator
				continue;
			console.log("Who :",key[i]);
			console.log("Total :",Addr[key[i]]);
			console.log("============");
		}
	}

  	return [TxDict,Addr,Goto]; //Array
}


Req("0xEcA19B1a87442b0c25801B809bf567A6ca87B1da",TxDict,Addr,Goto);



/*
Req(address,TxDict).then(data=>{
	
	Arr = data;
	BKTC_addr = "0x38e26c68bdef7c6e7f1aea94b7ceb8d95b11bd69";

	for(var i=0;i<Arr.length;i++){
		if(Arr[i].contractAddress == BKTC_addr && TxDict[Arr[i].from] == undefined){
			//console.log(i,Arr[i]);
			console.log(Arr[i].hash,Arr[i].from,Arr[i].to,Arr[i].value);
			//TxDict[Arr[i].from] = 1;
			//Req(url,TxDict);
		}
	}
});
*/

//console.log(Arr);