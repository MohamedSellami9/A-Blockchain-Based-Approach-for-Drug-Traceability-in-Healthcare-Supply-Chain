import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { buyDrug,getAllListedDrugs,priceChanger, selectedAccount, subscribeToDrugAdded,getDrug } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community";
import '../App.css';

function OwnedDrug() {
  const [drugsListed, setDrugsListed] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [quantity, setQuantity] = useState('');
  const gridRef = useRef();

  useEffect(() => {
    const fetchDrugs = async () => {
      const drugs = await getAllListedDrugs();
      const filteredDrugs = drugs.filter(order => order.manufacturer !== "0x0000000000000000000000000000000000000000");
      setDrugsListed(filteredDrugs);
    };
    fetchDrugs();
  }, []);

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120,},
    {field:'manufacturer',headerName: 'Manufacturer', width:200},
    {field:'ownerID',headerName: 'Pharmacy', width:200},
    {field:'quantity',headerName: 'Q', width:90},
    {field:'tempC',headerName: 'T°', width:90,},
    {field:'date',headerName: 'date', width:200},
    {
        headerName: 'Buy',
        width: 120,
        cellRenderer: 'actionsRenderer',
        cellRendererParams: {
          onClick:async (row) => {
            console.log("Accepted order:", row);
            const List = await buyDrug(row.id);
            console.log(console.log(row.id));
            console.log(row.id);
            gridRef.current.api.applyTransaction({ remove: [row] });
          }
        }
      }

  ];
  const actionsRenderer = useCallback((props) => {
    return (
        <div style={{ marginBottom:'10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant="success" size="sm" onClick={() => props.onClick(props.data)}>Buy</Button>
    </div>
    );
  }, []);
  const rowData = drugsListed?.map(drug => ({
    id: drug.id,
    name: drug.name,
    description: drug.description,
    price: drug.price,
    manufacturer: drug.manufacturer,
    ownerID : drug.ownerID,
    quantity : drug.quantity,
    tempC: drug.tempC,
    date: drug.date
  }));
  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div>
      <div>
      <div
        className="ag-theme-material"
        style={{margin:'23%', marginTop:'10px',marginBottom:'10px' , height: '500px', width: '60%' }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          rowSelection="multiple"
          frameworkComponents={{ actionsRenderer }}
          onGridReady={onGridReady}
        />
        </div>
      </div>
    </div>
  );
}

export default OwnedDrug;
