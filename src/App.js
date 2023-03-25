import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import CreateDrugForm from './Components/CreateDrugForm';
import OrderDrug from './Components/OrderDrug';
import TokenMinted from './Components/TokenMinted';
import Roles from './Components/Roles';
import {signOut} from "firebase/auth";
import { auth } from "./firebase-config";
import { mintToken , order,accept ,deployClientContract,isClient,deployManufacturerContract,isManu,deployPh,isPharm,DrugNum} from './Web3Client';
import { init } from './Web3Client';


function App() {
  const [user, setUser] = useState();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });
      return unsubscribe; 
      }, []);
	  useEffect(() => {init();
		
		}, []);
		
   const handleLogout = async () => {
    await signOut(auth);
    };
  const [minted, setMinted] = useState(false);
	const [orderd, setOrder] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [orderNum, setOrderNum] = useState('');
	const [Adress, setAd] = useState('');
const handleNameChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
};

const handleDescriptionChange = (event) => {
    event.preventDefault();
    setDescription(event.target.value);
};

const handlePriceChange = (event) => {
    event.preventDefault();
    setPrice(event.target.value);
};
  const handleAdressChange = (event) => {
    event.preventDefault();
      setAd(event.target.value);
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
      <Router>
        <Sidebar auth={auth} logout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route
            path="/create"
            element={<CreateDrugForm name={name} description = {description} price={price} handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange} handlePriceChange={handlePriceChange} handleMintToken={handleMintToken} />}
          />
          <Route
            path="/order"
            element={<OrderDrug />}
          />
          <Route path="/roles"  element={<Roles deployClientContract={deployClientContract} Adress={Adress} handleAdressChange={handleAdressChange} isClient={isClient} deployManufacturerContract={deployManufacturerContract}
           isManu={isManu} deployPh={deployPh} isPharm={isPharm} Getdrug ={Getdrug} /> } />
          <Route path="/login"  element={<Login/>} />
          <Route path="/register"  element={<Register/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
