import React, { useState } from 'react';

import { mintToken , order,accept ,deployClientContract,isClient,deployManufacturerContract,isManu} from './Web3Client';

function App() {
	const [minted, setMinted] = useState(false);
	const [orderd, setOrder] = useState(false);


	 const mint = () => {
	 	mintToken()
	 		.then((tx) => {
	 			console.log(tx);
	 		})
	 		.catch((err) => {
	 			console.log(err);
	 		});
	 };

	 const orderr = () => {
		order()
			.then((tx) => {
				console.log(tx);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const acceptt = () => {
		accept()
			.then((tx) => {
				console.log(tx);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div className="App">
			 {!minted ? (
				<button onClick={() => mint()}>CreateDrug</button>
			) : (
				<p>Token minted successfully!</p>
				
			)} 
			{!orderd ?(
			<button onClick={() => orderr()}>OrderDrug</button>
			):
			<p>bien</p>}
			{!orderd ?(
			<button onClick={() => acceptt()}>accept</button>
			):
			<p>bien</p>}
			<div>
              <button onClick={() => deployClientContract()}>Give client role</button>
            </div>
			 <div>
              <button onClick={() => isClient()}>is he a Client</button>
            </div> 
			<div>
              <button onClick={() => deployManufacturerContract()}>Manufacturer Deploy</button>
            </div> 
			<div>
              <button onClick={() => isManu()}>is he a Manu</button>
            </div> 
			
		</div>
	);
}

export default App;