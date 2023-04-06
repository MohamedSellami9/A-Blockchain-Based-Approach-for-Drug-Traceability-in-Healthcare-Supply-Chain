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
import {
  collection,
  getDocs,
  doc,
  setDoc, query, where
} from "firebase/firestore";
import { auth,db } from "../firebase-config";

function Market() {
  const [drugsListed, setDrugsListed] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [quantity, setQuantity] = useState('');
  const gridRef = useRef();
  const usersCollectionRef = collection(db, "users")
  useEffect(() => {
    const fetchDrugs = async () => {
      const drugs = await getAllListedDrugs();
      const filteredDrugs = drugs.filter(order => order.manufacturer !== "0x0000000000000000000000000000000000000000");
      const dataa = await getDocs(usersCollectionRef);
     const  users=dataa.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
     console.log(filteredDrugs)
     const finaldrugs=filteredDrugs.map(drug => ({
      ...drug,
      manufacturer: users.find(item => item.wallet.toLowerCase() === drug.manufacturer.toLowerCase())?.name || drug.manufacturer,
      pharmacy: users.find(item => item.wallet.toLowerCase() === drug.ownerId?.toLowerCase())?.name || drug.pharmacy,
     }));
      setDrugsListed(finaldrugs);
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

;
 
  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  return (
<div class="all">
<div class="container">
  <h1 class="title">Market</h1>
  <br/>
  <div class="description-container">
    <p class="description">Please note that you need to have a valid Ethereum account and enough funds in your account to be able to buy drugs from this market. If you're not familiar with Ethereum, you may want to read up on it first and learn how to create an account and fund it with Ether.</p>
    <p class="description">When you click the "Buy" button, a PDF invoice will be generated for each drug you buy, which you can print and use for your records. The invoice will contain information such as the drug name, price, manufacturer, pharmacy, and creation date.</p>
  </div>
  </div>
  <div class="ag-theme-material" style={{margin:'5%', marginTop:'10px' , height: '400px', width: '90%' }}>
    <AgGridReact
      columnDefs={columnDefs}
      rowData={drugsListed}
      rowSelection="multiple"
      frameworkComponents={{ actionsRenderer }}
      onGridReady={onGridReady}
    />
  </div>
</div>


  );
}

export default Market;
