import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import { getOrdersAvailable } from '../Web3Client';
import { createDrug } from '../Web3Client';
import './Create.css';
function CreateDrugForm() {
  const [formdata, setformdata] = useState({
    name: '',
    description: '',
    price: null,
    quantity: null,
    tempC: null,
    text: ''
  });
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = useCallback((event) => {
    setformdata(old => {
      return {
        ...old,
        [event.target.name]: event.target.value
      };
    });
  }, []);

  const handlecreateDrug = useCallback(async () => {
    const d = new Date();
    let text = d.toString();
    const drug = await createDrug(formdata.name, formdata.description,formdata.price,formdata.tempC,formdata.quantity,text);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 6000);
    console.log('created drug:', drug);
  }, [formdata]);

  return (
    <div className="create-drug-form">
      <form>
        <label>
          Name:
          <input type="text" name='name' value={formdata.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name='description' value={formdata.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price/U:
          <input type="number" name='price' value={formdata.price} onChange={handleChange} />
        </label>
        <br />
        <label>
          Quantity:
          <input type="number" name='quantity' value={formdata.quantity} onChange={handleChange} />
        </label>
        <br />
        <label>
          Conservation temperature:
          <input type="number" name='tempC' value={formdata.tempC} onChange={handleChange} />
        </label>
        <br />
        <Button variant='dark' onClick={handlecreateDrug}>Create Drug</Button>
        {showMessage && <p>The drug is created.</p>}
      </form>
    </div>
  );
}

export default CreateDrugForm;

