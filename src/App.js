import React, { useState } from 'react';
import './App.css';
import { mintToken , order,accept ,deployClientContract,isClient,deployManufacturerContract,isManu,deployPh,isPharm,DrugNum} from './Web3Client';
import CreateDrugForm from './Components/CreateDrugForm';
import OrderDrug from './Components/OrderDrug';
import TokenMinted from './Components/TokenMinted';
import Roles from './Components/Roles';

function App() {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [minted, setMinted] = useState(false);
	const [orderd, setOrderd] = useState(false);
	const [Adress, setAdress] = useState('');
	const handleNameChange = (event) => {
		setName(event.target.value);
	  };
	  const handleAdressChange = (event) => {
		setAdress(event.target.value);
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
		<h1>Drug Marketplace</h1>
		<CreateDrugForm 
		  name={name} 
		  description={description} 
		  price={price} 
		  handleNameChange={handleNameChange} 
		  handleDescriptionChange={handleDescriptionChange} 
		  handlePriceChange={handlePriceChange} 
		  handleMintToken={handleMintToken} 
		/>
		<TokenMinted minted={minted} />
		<OrderDrug 
		  orderr={orderr} 
		  acceptt={acceptt} 
		  orderd={orderd} 
		/>
		<Roles 
		  deployClientContract={deployClientContract} 
		  Adress={Adress} 
		  handleAdressChange={handleAdressChange} 
		  isClient={isClient} 
		  deployManufacturerContract={deployManufacturerContract} 
		  isManu={isManu} 
		  deployPh={deployPh} 
		  isPharm={isPharm} 
		  Getdrug={Getdrug} 
		/>
	  </div>
	);
  }
  
  export default App;