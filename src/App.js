import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';
import './App.css';
import Sidebar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import CreateDrugForm from './Components/CreateDrugForm';
import OrderDrug from './Components/OrderDrug';
import OrderGrid from './Components/OrderGrid';
import TokenMinted from './Components/TokenMinted';
import Roles from './Components/Roles';
import {signOut} from "firebase/auth";
import { auth,db } from "./firebase-config";
import { mintToken , order,accept ,deployClientContract,isClient,deployManufacturerContract,isManu,deployPh,isPharm,DrugNum} from './Web3Client';
import { init } from './Web3Client';
import Unauthorized from "./Components/Unauthorized";
import Notfound from "./Components/Notfound";
import RequireAuth from './Components/RequireAuth';
import {
	getDoc,
	doc
  } from "firebase/firestore";
  import Rolegrid from './Components/Rolegrid';

function App() {
	
  const [user, setUser] = useState();
  const [role, setrole] = useState();
  console.log(role);

	useEffect(() => {init();
	  
	  }, []);
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async(user) => {
        setUser(user);
		const userRef = doc(db, 'users',auth.currentUser.uid);
    const userSnapshot = await getDoc(userRef);
	const role1 =userSnapshot.get('role');
	setrole(role1);
      });
      return unsubscribe; 
      }, []);
	  useEffect(() => {init();
		
		}, []);
		const navigate= useNavigate()	
   const handleLogout = async () => {
    await signOut(auth);
	navigate('/');

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
      
	  
        <Sidebar role={role} auth={auth} logout={handleLogout}/>
        <Routes>
          <Route path="/" >


			   {/* public routes */}
		  <Route index element={<Home />} />
          <Route path="login"  element={<Login setrole={setrole}/>} />
          <Route path="register"  element={<Register setrole={setrole}/>} />
		  <Route path="unauthorized" element={<Unauthorized />} />
		  <Route path="roles"  element={<Roles deployClientContract={deployClientContract} Adress={Adress} handleAdressChange={handleAdressChange} isClient={isClient} deployManufacturerContract={deployManufacturerContract}
           isManu={isManu} deployPh={deployPh} isPharm={isPharm} Getdrug ={Getdrug} /> } />
		   <Route path="admin" element={<Rolegrid user={user} setrole={setrole}/>} />
          
		   {/* ONLY MANUFACTURER */}
		   <Route element={<RequireAuth role={role} allowedRoles={["admin", "manufacturer"]} />}>
		  <Route
            path="create"
            element={<CreateDrugForm name={name} description = {description} price={price} handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange} handlePriceChange={handlePriceChange} handleMintToken={handleMintToken} />}
          />
			<Route path="ordergrid"  element={<OrderGrid/>} />
			</Route>
			{/* ONLY PHARMACY */}
			<Route element={<RequireAuth role={role}  allowedRoles={["admin", "pharmacy"]} />}>
			<Route path="order" element={<OrderDrug/>}/>
			</Route>
			{/* ONLY CLIENT */}
			<Route element={<RequireAuth role={role}  allowedRoles={["admin", "client"]} />}>
			<Route path="buy" element={<></> }/>
			</Route>
		  <Route path="*" element={<Notfound />} />
		  </Route>
        </Routes>
     
    </div>
  );
}

export default App;
