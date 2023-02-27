import React, { useState } from 'react';


import { auth } from "../firebase-config";
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
        )
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
        <button disabled={!buttonstatus} type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;
