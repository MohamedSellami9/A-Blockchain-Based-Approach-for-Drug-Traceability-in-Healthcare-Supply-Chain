import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { order,getDrugsAvailable, selectedAccount, subscribeToDrugAdded,getDrug } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community";
import '../App.css';

function OrderDrug({ orderr, acceptt, orderd }) {
  const [drugsAvailable, setDrugsAvailable] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [quantity, setQuantity] = useState('');
  const gridRef = useRef();

  useEffect(() => {
    const fetchDrugs = async () => {
      const drugs = await getDrugsAvailable();
      const filteredDrugs = drugs.filter(order => order.manufacturer !== "0x0000000000000000000000000000000000000000");
      setDrugsAvailable(filteredDrugs);
    };

    fetchDrugs();

    const unsubscribe = subscribeToDrugAdded(() => {
      fetchDrugs();
    });

    return unsubscribe;
  }, []);

  const columnDefs = [
    {
      headerName: "",
      field: "checkbox",
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 50
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120 },
    {field:'manufacturer',headerName: 'Manufacturer', width:200},
    {field:'quantity',headerName: 'Q', width:90},
    {field:'tempC',headerName: 'T°', width:90},
    {field:'date',headerName: 'date', width:200}

  ];

  const rowData = drugsAvailable?.map(drug => ({
    id: drug.id,
    name: drug.name,
    description: drug.description,
    price: drug.price,
    manufacturer: drug.manufacturer,
    quantity : drug.quantity,
    tempC: drug.tempC,
    date: drug.date
  }));

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const selectedRowsElement = document.querySelector('#selectedRows');
    console.log(selectedRows);
    console.log(quantity);
        if (selectedRowsElement) {
      selectedRowsElement.innerHTML =
        selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }
  }, []);
  const handleButtonClick = async () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.id);
    console.log(selectedIds);
    console.log(quantity);
    for (let id in selectedIds){
      let ord = await order(selectedRows[id].id, quantity);
      let drugIndex = ord.drugIndex;
      console.log(drugIndex);
    }
    gridRef.current.api.applyTransaction({ remove: selectedRows });
  }
  
  
  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div>
      <div
        className="ag-theme-material"
        style={{margin:'23%', marginTop:'10px',marginBottom:'10px' , height: '500px', width: '60%' }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReady}
        />
      </div>
      <div>
      <InputGroup className='mb-3'>
          <Form.Control 
            type='string' 
            placeholder='Quantity' 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
          />
        </InputGroup>

        <Button variant='dark' onClick={handleButtonClick}>Order Selected Drugs</Button>
      </div>
    </div>
  );
}

export default OrderDrug;

