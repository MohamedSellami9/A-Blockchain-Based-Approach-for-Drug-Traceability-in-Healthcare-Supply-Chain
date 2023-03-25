import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { order,getDrugsAvailable, selectedAccount, subscribeToDrugAdded } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community";
import '../App.css';

function OrderDrug({ orderr, acceptt, orderd }) {
  const [drugsAvailable, setDrugsAvailable] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const gridRef = useRef();

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
  ];

  const rowData = drugsAvailable?.map(drug => ({
    id: drug.id,
    name: drug.name,
    description: drug.description,
    price: drug.price,
    manufacturer: drug.manufacturer,
  }));

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const selectedRowsElement = document.querySelector('#selectedRows');
    console.log(selectedRows);
    if (selectedRowsElement) {
      selectedRowsElement.innerHTML =
        selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }
  }, []);
  const handleButtonClick = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    const selectedIds = selectedRows.map(row => row.id);
    console.log(selectedIds);
    for (let id in selectedIds){
      order(id,selectedAccount);
      console.log(order(id,selectedAccount));
    }
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

