import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { listDrug,getAllDeliveredDrugs,priceChanger, selectedAccount, subscribeToDrugAdded,getDrug } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community";
import '../App.css';

function OwnedDrug(props) {
  const [drugsDelivered, setDrugsDelivered] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [quantity, setQuantity] = useState('');
  const gridRef = useRef();

  useEffect(() => {
    const fetchDrugs = async () => {
      const drugs = await getAllDeliveredDrugs();
      const filteredDrugs = drugs.filter(order => order.manufacturer !== "0x0000000000000000000000000000000000000000");
      setDrugsDelivered(filteredDrugs);
    };
    fetchDrugs();
  }, []);

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120,editable: true },
    {field:'manufacturer',headerName: 'Manufacturer', width:200},
    {field:'ownerID',headerName: 'Pharmacy', width:200},
    {field:'quantity',headerName: 'Q', width:90},
    {field:'tempC',headerName: 'T°', width:90,editable: true},
    {field:'date',headerName: 'date', width:200},
    {
      headerName: 'List',
      width: 120,
      cellRenderer: 'actionsRenderer',
      cellRendererParams: {
        onClick: async (row) => {
          console.log("Accepted order:", row);
          const List = await listDrug(row.id);
          console.log(console.log(row.id));
          console.log(row.id);
          gridRef.current.api.applyTransaction({ remove: [row] });
        }
      },
      hide: !((props.role === "admin")||(props.role === "pharmacy"))
    }
  ];
  const onCellValueChanged = (params) => {
    const { node, colDef, newValue } = params;
    if (colDef.field === "price") {
      node.data.price = newValue;
      priceChanger(node.data.id, newValue);
    }
  };
  const actionsRenderer = useCallback((props) => {
    return (
        <div style={{ marginBottom:'10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant="success" size="sm" onClick={() => props.onClick(props.data)}>List</Button>
    </div>
    );
  }, []);
  const rowData = drugsDelivered?.map(drug => ({
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
          onCellValueChanged={onCellValueChanged}
          frameworkComponents={{ actionsRenderer }}
          onGridReady={onGridReady}
        />
        </div>
      </div>
    </div>
  );
}

export default OwnedDrug;

