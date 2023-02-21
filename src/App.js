import React, { useState } from 'react';

import { mintToken , order,accept ,deployClientContract,isClient,deployManufacturerContract,isManu,deployPh,isPharm,DrugNum} from './Web3Client';

function App() {
	const [minted, setMinted] = useState(false);
	const [orderd, setOrder] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [orderNum, setOrderNum] = useState('');

	const handleNameChange = (event) => {
		setName(event.target.value);
	  };
	
	  const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	  };
	  const handlePriceChange = (event) => {
		setPrice(event.target.value);
	  };
	  const handleMintToken = async () => {
		const drug = await mintToken(name, description,price);
		console.log('Minted drug:', drug);
	  };
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
	const Getdrug = () => {
		DrugNum()
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
				    <div>
					<form>
					  <label>
						Name:
						<input type="text" value={name} onChange={handleNameChange} />
					  </label>
					  <br />
					  <label>
						Description:
						<input type="text" value={description} onChange={handleDescriptionChange} />
					  </label>
					  <br />
					  <label>
						Price:
						<input type="text" value={price} onChange={handlePriceChange} />
					  </label>
					  <br />
					  <button type="button" onClick={handleMintToken}>Create Drug</button>
					</form>
					<br />
				  </div>
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
				<h4>Roles</h4>
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
			<div>
              <button onClick={() => deployPh()}>Ph Deploy</button>
            </div> 
			<div>
              <button onClick={() => isPharm()}>is he a Ph</button>
			  <div>
					<button onClick={() => Getdrug()}>getDrugsNumber</button>
					</div>
            </div> 
			
		</div>
	);
}

export default App;