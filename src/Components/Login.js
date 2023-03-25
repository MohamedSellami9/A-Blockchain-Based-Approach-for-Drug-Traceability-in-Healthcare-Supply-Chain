import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { selectedAccount } from '../Web3Client';
import {
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc, query, where
} from "firebase/firestore";
import { auth ,db} from "../firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formdata, setformdata] = useState({email:'',
                                            password:''
                                          });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  function handleChange(event){
    setformdata(old => {
        return {
            ...old,
            [event.target.name]: event.target.value
        }
    })
}

  const navigate= useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
         

    try {
     await signInWithEmailAndPassword(
        auth,
        formdata.email,
        formdata.password
    );
    const userRef = doc(db, 'users',auth.currentUser.uid);
    const userSnapshot = await getDoc(userRef);
    const wallet =userSnapshot.get('wallet');
    if (wallet !== selectedAccount) {
      await signOut(auth);
      setErrorMessage('Selected account does not match user wallet.');
    } else {
      navigate('/');
    }
 } catch (error) {
    setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        {errorMessage && <p>{errorMessage}</p>}
        <Button type="submit">Login</Button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
