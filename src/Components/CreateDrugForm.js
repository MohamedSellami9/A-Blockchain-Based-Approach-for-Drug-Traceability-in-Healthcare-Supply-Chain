import React from 'react';
import '../App.css';

function CreateDrugForm({ name, description, price, handleNameChange, handleDescriptionChange, handlePriceChange, handleMintToken }) {
  return (
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
  );
}

export default CreateDrugForm;
