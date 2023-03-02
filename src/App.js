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


function App() {
  const [user, setUser] = useState();
  auth.onAuthStateChanged(function(user) {
    if (user) {
      setUser(user);
    } else {
      setUser(null);    }
  });
 console.log(user);
  useEffect(() => {
    
  
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    
    };

  return (
    <div className="App">
      <Router>
        <Sidebar auth={auth} logout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route
            path="/create"
            element={<CreateDrugForm user={user} />}
          />
          <Route
            path="/order"
            element={<OrderDrug user={user} />}
          />
          <Route path="/roles"  element={<Roles/>} />
          <Route path="/login"  element={<Login/>} />
          <Route path="/register"  element={<Register/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
