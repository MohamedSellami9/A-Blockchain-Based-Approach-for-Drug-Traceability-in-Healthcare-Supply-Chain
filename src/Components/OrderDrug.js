import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { getDrugsAvailable, subscribeToDrugAdded } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community";
import '../App.css';

function OrderDrug({ orderr, acceptt, orderd }) {
  const [drugsAvailable, setDrugsAvailable] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  useEffect(() => {
    const fetchDrugs = async () => {
      const drugs = await getDrugsAvailable();
      setDrugsAvailable(drugs);
    };

    fetchDrugs();
    
    const unsubscribe = subscribeToDrugAdded(() => {
      fetchDrugs();
    });

    return unsubscribe;
  }, []);

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120 },
    {field:'manufacturer',headerName: 'Manufacturer', width:200},
  ];

  const rowData = drugsAvailable?.map(drug => ({
    id: drug.id,
    name: drug.name,
    description: drug.description,
    price: drug.price,
    manufacturer: drug.manufacturer,
  }));

  const handleSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    setSelectedDrugs(selectedData);
  }

  const handleButtonClick = () => {
    console.log(selectedDrugs);
  }

  let gridApi;

  const onGridReady = (params) => {
    gridApi = params.api;
  };

  return (
    <div>
      <div
        className="ag-theme-material"
        style={{ margin:'10px', marginLeft:'23%', height: '500px', width: '800px' }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          rowSelection="multiple"
          onSelectionChanged={handleSelectionChanged}
          onGridReady={onGridReady}
        />
      </div>
      {!orderd ? (
        <div>
          <Button variant='dark' onClick={orderr}>Order Drug</Button>
        </div>
      ) : (
        <div>
          <Button variant='dark' onClick={acceptt}>Accept</Button>
        </div>
      )}
      <div>
        <Button variant='dark' onClick={handleButtonClick}>Order Selected Drugs</Button>
      </div>
    </div>
  );
}

export default OrderDrug;