import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import { assign,verifyDist,subscribeTodistributorAssigned} from '../Web3Client';
import { db } from '../firebase-config';
import {
    collection,
    getDocs,
    where,
     query
  } from "firebase/firestore";

function AssignDistributor({}) {
  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      
      { headerName: "Email", field: "email", sortable: true, filter: true },
      { headerName: "Wallet", field: "wallet", sortable: true, filter: true },
      {
        headerName: "Actions",
        cellRenderer: "actionsRenderer",
        cellRendererParams: {
          onAssign: async (row) => {
            console.log("assign", row);
            const accept = await assign(row.wallet);
            
          }
        },
      },
    ],
    rowData: [],
  });
  const gridRef = useRef();

       useEffect(() => {
        const fetchRoles = async () => {
            const data=[];
            const usersCollectionRef = collection(db, "users");
            const q=query(usersCollectionRef, where("role", "==","distributor"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const row={
                    email:doc.data.email,
                    wallet: doc.data.wallet
                }
                data.push(doc.data());
              });
          
              setGridOptions({ ...gridOptions, rowData: data });
        }
        fetchRoles();
        const unsubscribe = subscribeTodistributorAssigned(() => {
            fetchRoles();
        });

        return unsubscribe;
      }, []);


  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  const actionsRenderer = useCallback((props) => {
    console.log(props.data.wallet)
    if (!verifyDist(props.data.wallet))
 { return (
    <div style={{ marginBottom:'50%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant="success" size="sm" onClick={() => props.onAssign(props.data)}>assign</Button>
    </div>
    );}
    else{return (<p>assigned</p>)

    }
  }, []);

  return (
    <div className="ag-theme-material"
    style={{margin:'23%', marginTop:'10px',marginBottom:'10px' , height: '500px', width: '60%' }}>
      <AgGridReact
        columnDefs={gridOptions.columnDefs}
        rowData={gridOptions.rowData}
        onGridReady={onGridReady}
        frameworkComponents={{ actionsRenderer }}
      />
    </div>
  );
}

export default AssignDistributor;
