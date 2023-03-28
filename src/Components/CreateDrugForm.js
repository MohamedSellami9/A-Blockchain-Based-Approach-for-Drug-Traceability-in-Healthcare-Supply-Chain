import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import Button from 'react-bootstrap/Button'
import { getOrdersAvailable } from '../Web3Client'
import { createDrug } from '../Web3Client'
function CreateDrugForm() {
  const [formdata, setformdata] = useState({name:'',
  description:'',
  price:null})
  const [showMessage, setShowMessage] = useState(false)
  function handleChange(event){
    setformdata(old => {
        return {
            ...old,
            [event.target.name]: event.target.value
        }
    })
}
const handlecreateDrug = async () => {
  const drug = await createDrug(formdata.name, formdata.description,formdata.price);
  setShowMessage(true);
  setTimeout(() => setShowMessage(false), 6000);
  console.log('created drug:', drug);
  }
  return (
    <div>
      <form>
        <label>
          name:
          <input type="text" name='name' value={formdata.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name='description' value={formdata.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name='price' value={formdata.price} onChange={handleChange} />
        </label>
        <br />
        <Button variant='dark' onClick={handlecreateDrug}>Create Drug</Button>
        {showMessage && <p>the drug is created</p>}
      </form>
      <br />
    </div>
  );
}

export default CreateDrugForm;

