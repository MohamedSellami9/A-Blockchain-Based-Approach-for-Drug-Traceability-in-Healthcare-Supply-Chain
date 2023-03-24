import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { selectedAccount } from '../Web3Client';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from "firebase/firestore";

import { auth,db } from "../firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [buttonstatus, setbuttonstatus] = useState(true)
  const usersCollectionRef = collection(db, "users");
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate= useNavigate()
  const handleRegister = async(e) => {
    
        e.preventDefault()
        setbuttonstatus(false)
    try {

        const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
        );
         const docRef = doc(db, "users", auth.currentUser.uid );
        setDoc(docRef, {
          useruid : auth.currentUser.uid,
          wallet : selectedAccount,
          role:"costumer"
        }).then(() => {
            navigate('/')
        })
        .catch(error => {
            console.log(error);
})  
        navigate("/");
    } catch (error) {
        if(error.message == "Firebase: Error (auth/email-already-in-use).")
        alert("Email déjà utilisé !");
    }
    };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>
        <br />
        {errorMessage && <p>{errorMessage}</p>}
        <Button variant='dark' disabled={!buttonstatus} type="submit">Register</Button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
