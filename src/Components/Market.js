import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { buyDrug,getAllListedDrugs,priceChanger, selectedAccount, subscribeToDrugAdded,getDrug } from '../Web3Client.js';
import { AgGridReact } from 'ag-grid-react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import "ag-grid-community";
import '../App.css';
import './CSS/Market.css';
function Market() {
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
    {
      headerName: 'Buy',
      width: 120,
      cellRenderer: 'actionsRenderer',
      cellRendererParams: {
        onClick: async (row) => {
          console.log("Accepted order:", row);
          const drugInfo = await buyDrug(row.id);
          const Drug = await getDrug(row.id)
          console.log(row.id);
                
          // Create a new PDF document
          const pdfDoc = await PDFDocument.create();
                
          // Add a new page to the document
          const page = pdfDoc.addPage();
                
          // Get the font used for text
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica, { subset: true });
          font.encodeText('UTF-8');
                          
          // Add text to the page
          const fontSize = 12;
          const headerText = `Drug Invoice for Order ID: ${row.id}`;
          const headerTextWidth = font.widthOfTextAtSize(headerText, fontSize);
          const headerTextHeight = font.heightAtSize(fontSize);
          const drugText = `Drug Name: ${Drug.name} Price: ${Drug.price}`;
          const drugText1 = `Manufacturer: ${Drug.manufacturer}`;
          const drugText2=`Pharmacy: ${Drug.ownerID}`;
          const drugText3 = `Creation Date: ${Drug.date}` ;
          const drugTextLines = drugText.split('\n');
          const drugTextWidth = font.widthOfTextAtSize(drugText, fontSize);
          const drugTextHeight = font.heightAtSize(fontSize);
          page.drawText(headerText, {
            x: page.getWidth() / 2 - headerTextWidth / 2,
            y: page.getHeight() - 50,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          page.drawText(drugText, {
            x: drugTextWidth / 2,
            y: page.getHeight() / 2 - drugTextHeight / 2,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          page.drawText(drugText1, {
            x:  drugTextWidth / 2,
            y: page.getHeight() / 2 - drugTextHeight / 2-20,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          page.drawText(drugText2, {
            x:  drugTextWidth / 2,
            y: page.getHeight() / 2 - drugTextHeight / 2 -40,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          page.drawText(drugText3, {
            x:  drugTextWidth / 2,
            y: page.getHeight() / 2 - drugTextHeight / 2-30,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
                
          // Get the PDF document as a blob
          const pdfBytes = await pdfDoc.save();
                
          // Convert the blob to a data URL
          const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
                
          // Open a new window with the PDF document
          const printWindow = window.open(pdfUrl);
                
          // Wait for the print window to load
          printWindow.onload = () => {
            // Print the document
            printWindow.print();
                
            // Revoke the data URL to free up memory
            URL.revokeObjectURL(pdfUrl);
          };
                
          // Refresh the UI grid
          gridRef.current.api.refreshCells({ rowNodes: [row] });
        }
        
      }
    },
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'price', headerName: 'Price', width: 120,},
    {field:'manufacturer',headerName: 'Manufacturer', width:200},
    {field:'ownerID',headerName: 'Pharmacy', width:200},
    {field:'quantity',headerName: 'Q', width:90},
    {field:'tempC',headerName: 'T°', width:90,},
    {field:'date',headerName: 'date', width:200},
    

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

export default Market;
