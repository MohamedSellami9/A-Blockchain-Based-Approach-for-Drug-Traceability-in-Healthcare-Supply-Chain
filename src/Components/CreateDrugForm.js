import React, { useState, useCallback } from 'react';
import { createDrug } from '../Web3Client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './CSS/Create.css';

function CreateDrugForm() {
  const [formdata, setformdata] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    tempC: '',
  });
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setformdata((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handlecreateDrug = useCallback(async () => {
    const d = new Date();
    let text = d.toString();
    const drug = await createDrug(
      formdata.name,
      formdata.description,
      formdata.price,
      formdata.tempC,
      formdata.quantity,
      text
    );
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 6000);
    console.log('created drug:', drug);
  }, [formdata]);

  return (
    <div className="create-drug-form">
      <Form>
        <Form.Group controlId="formDrugName">
          <Form.Label>Drug Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            value={formdata.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDrugDescription">
          <Form.Label>Drug Description:</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Enter description"
            value={formdata.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDrugPrice">
          <Form.Label>Price/U:</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter price"
            value={formdata.price}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDrugQuantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={formdata.quantity}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDrugTempC">
          <Form.Label>Conservation Temperature:</Form.Label>
          <Form.Control
            type="number"
            name="tempC"
            placeholder="Enter temperature"
            value={formdata.tempC}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="dark" onClick={handlecreateDrug}>
          Create Drug
        </Button>
        {showMessage && <p>The drug is created.</p>}
      </Form>
    </div>
  );
}

export default CreateDrugForm;
