import React from 'react';
import '../App.css';

function Roles({ deployClientContract, Adress, handleAdressChange, isClient, deployManufacturerContract, isManu, deployPh, isPharm, Getdrug }) {
  return (
    <div>
      <h4>Roles</h4>
      <button onClick={deployClientContract}>Give client role</button>
      <div>
        <input type="text" value={Adress} onChange={handleAdressChange} />
        <button onClick={isClient}>Is he a Client</button>
      </div>
      <div>
        <button onClick={deployManufacturerContract}>Manufacturer Deploy</button>
      </div>
      <div>
        <button onClick={isManu}>Is he a Manu</button>
      </div>
      <div>
        <button onClick={deployPh}>Ph Deploy</button>
      </div>
      <div>
        <button onClick={isPharm}>Is he a Ph</button>
        <div>
          <button onClick={Getdrug}>Get Drugs Number</button>
        </div>
      </div>
    </div>
  );
}

export default Roles;
