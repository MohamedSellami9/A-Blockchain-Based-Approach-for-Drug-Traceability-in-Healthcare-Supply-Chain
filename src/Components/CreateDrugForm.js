import React from 'react';
import '../App.css';
import Button from 'react-bootstrap/Button';
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
        <Button variant='dark' onClick={handleMintToken}>Create Drug</Button>
      </form>
      <br />
    </div>
  );
}

export default CreateDrugForm;
