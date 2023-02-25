import SupplyContractBuild from 'contracts/SupplyChain.json';
import Web3 from 'web3';
import ClientContract from 'contracts/Client.json';
import ManufacturerContract from 'contracts/Manufacturer.json'
import PhContract from 'contracts/Pharmacy.json'

const web3 = new Web3('http://localhost:7545'); 

let selectedAccount;
let supplyContract;
let clientContract;
let Clientrole;
let isInitialized = false;
let manufacturerContract;
let ManuRole;
let phContract;
let PhRole; 

export const init = async () => {
	let provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		provider
			.request({ method: 'eth_requestAccounts' })
			.then((accounts) => {
				console.log(accounts);
				selectedAccount = accounts[0];
				console.log(`Selected account is ${selectedAccount}`);
			})
			.catch((err) => {
				console.log(err);
				return;
			});

		window.ethereum.on('accountsChanged', function (accounts) {
			selectedAccount = accounts[0];
			console.log(`Selected account changed to ${selectedAccount}`);
		});
	}
	const web3 = new Web3(provider);
	const networkId = await web3.eth.net.getId();
	 supplyContract = new web3.eth.Contract(
	 	SupplyContractBuild.abi,
	 	SupplyContractBuild.networks[networkId].address
	 );
	isInitialized = true;
};

export const isClient = async (Adress) => {
	if (!isInitialized) {
		await init();
	}
	const isClient = await Clientrole.methods.isClient(Adress).call();
	console.log('isClient:', isClient);
}
export const isManu = async () => {
	if (!isInitialized) {
		await init();
	}
	const isManufacturer = await ManuRole.methods.isManufacturer(selectedAccount).call();
	console.log('isManu:', isManufacturer);
}
export const isPharm = async () => {
	if (!isInitialized) {
		await init();
	}
	const isPharm = await PhRole.methods.isPharmacie(selectedAccount).call();
	console.log('isPharm:', isPharm);
}

export const deployClientContract = async () => {
	if (!isInitialized) {
		await init();
	}
	const web3 = new Web3(window.ethereum);
	clientContract = new web3.eth.Contract(
		ClientContract.abi,
		{ from: selectedAccount },
	);
	const deployedContract = await clientContract
		.deploy({
			data: ClientContract.bytecode,
			arguments: [],
		})
		.send({
			from: selectedAccount,
			gas: '5000000',
			gasPrice: web3.utils.toWei('20', 'gwei'),
		});
	console.log(`Contract deployed at ${deployedContract.options.address}`);
	
	Clientrole = new web3.eth.Contract(
		ClientContract.abi,
		deployedContract.options.address
	);
	
};
export const deployManufacturerContract = async () => {
	if (!isInitialized) {
		await init();
	}
	const web3 = new Web3(window.ethereum);
	manufacturerContract = new web3.eth.Contract(
		ManufacturerContract.abi,
		{ from: selectedAccount },
	);
	const deployedContract = await manufacturerContract
		.deploy({
			data: ManufacturerContract.bytecode,
			arguments: [],
		})
		.send({
			from: selectedAccount,
			gas: '5000000',
			gasPrice: web3.utils.toWei('20', 'gwei'),
		});
	console.log(`Contract Manu deployed at ${selectedAccount}`);
	
	ManuRole = new web3.eth.Contract(
		ManufacturerContract.abi,
		deployedContract.options.address
	);
	
	await isManu();
};
export const deployPh = async () => {
	if (!isInitialized) {
		await init();
	}
	const web3 = new Web3(window.ethereum);
	phContract = new web3.eth.Contract(
		PhContract.abi,
		{ from: selectedAccount },
	);
	const deployedContract = await phContract
		.deploy({
			data: PhContract.bytecode,
			arguments: [],
		})
		.send({
			from: selectedAccount,
			gas: '5000000',
			gasPrice: web3.utils.toWei('20', 'gwei'),
		});
	console.log(`Contract Manu deployed at ${selectedAccount}`);
	
	PhRole = new web3.eth.Contract(
		PhContract.abi,
		deployedContract.options.address
	);
	
	await isPharm();
};


// export const isClient = async () => {
// 	if (!isInitialized) {
// 		await init();
// 	}
// 	const web3 = new Web3(window.ethereum);
// 	const networkId = await web3.eth.net.getId();
// 	const rolesInstance = new web3.eth.Contract(
// 		ClientContract.abi,
// 		ClientContract.networks[networkId].address
// 	);

// 	return rolesInstance.methods.isClient(selectedAccount).call();
// };
export const mintToken = async (name, description, price) => {
	await init();
    const createTx = await supplyContract.methods
        .drugCreate(name,description,price)
        .send({
            from: selectedAccount,
            gas: '5000000',
            gasPrice: web3.utils.toWei('20', 'gwei'),
        });
	const num = await supplyContract.methods
	.getDrugsNumber()
	 .call();
	const drug = await supplyContract.methods.drugs(num-1).call();
    return drug;
};

//  export const giveClientRole = async () => {
// 	if (!isInitialized) {
// 		 await init();
// 	}
//     return  instance.isClient(selectedAccount).call();

//   };
 export const order = async () => {
	if (!isInitialized) {
		await init();
	}

   return supplyContract.methods
	   .orderDrug(0,selectedAccount)
		.call();
};
export const accept = async () => {
	if (!isInitialized) {
		await init();
	}

   return supplyContract.methods
	   .AcceptOrder(0)
		.call();
};
export const DrugNum = async () => {
	if (!isInitialized) {
		await init();
	}

   return supplyContract.methods
	   .getDrugsNumber()
		.call();
};