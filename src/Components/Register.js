import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { selectedAccount } from '../Web3Client';
import {
  collection,
  getDocs,
  doc,
  setDoc, query, where
} from "firebase/firestore";

import { auth,db } from "../firebase-config";
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
function Register(props) {
  const [formdata, setformdata] = useState({email:'',
                                            password:'',
                                          role:'client'});
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonstatus, setbuttonstatus] = useState(true)
  const usersCollectionRef = collection(db, "users");
  
  function handleChange(event){
    setformdata(old => {
        return {
            ...old,
            [event.target.name]: event.target.value
        }
    })
}
  const navigate= useNavigate()
  const handleRegister = async(e) => {
    
        e.preventDefault()
        setbuttonstatus(false)
        const q=query(usersCollectionRef, where("wallet", "==",selectedAccount));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setErrorMessage("This wallet address is already registered!");
        setbuttonstatus(true);
        return;
      }
        const user = await createUserWithEmailAndPassword(
        auth,
        formdata.email,
        formdata.password
        );
        
         const docRef = doc(db, "users", auth.currentUser.uid );
        setDoc(docRef, {
          useruid : auth.currentUser.uid,
          wallet : selectedAccount,
          role:formdata.role
        }).then(() => {
            navigate('/');
        })
        .catch(error => {
            console.log(error);
})  
    } catch (error) {
        if(error.message == "Firebase: Error (auth/email-already-in-use).")
        setErrorMessage("Email déjà utilisé !");
    }
    };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input name='email' type="email" value={formdata.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input name='password' type="password" value={formdata.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Choose role:
          <select name='role' value={formdata.role} onChange={handleChange}>
          <option value="client">client</option>
            <option value="manufacturer">manufacturer</option>
            <option value="pharmacy">pharmacy</option>
            
          </select>
        </label>
        {errorMessage && <p>{errorMessage}</p>}
        <Button variant='dark' disabled={!buttonstatus} type="submit">Register</Button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
