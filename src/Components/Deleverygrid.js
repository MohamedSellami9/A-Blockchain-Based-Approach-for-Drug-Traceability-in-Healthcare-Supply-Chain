import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import {  dele , Decline ,orderStatus,subscribeToAcceptOrder, getAllOrdersAcceptedassigned, getAllOrdersAcceptednotassigned, startDeliver, endDeliver, getStatus} from '../Web3Client';

function Deleverygrid({}) {
  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "Drug Index", field: "drugIndex", sortable: true, filter: true },
      { headerName: "Pharmacy", field: "pharmacy", sortable: true, filter: true },
      { headerName: "Distributor", field: "distributor", sortable: true, filter: true },
      { headerName: "Status", field: "status", sortable: true, filter: true },
      { headerName: "Quantity", field: "quantity", sortable: true, filter: true },
      { headerName: "Drug Status", field: "drugStatus", sortable: true, filter: true },
      { headerName: "refresh", field: "refresh", sortable: true, filter: true },
      {
        headerName: "Actions",
        cellRenderer: "actionsRenderer",
        cellRendererParams: {
          // onStart: async (row) => {
          //   console.log("delevering order:", row);
          //   const accept = await startDeliver(row.id).then(()=>{ gridRef.current.api.refreshCells()});
          //   // setGridOptions(prevstate => {const table=prevstate.rowData;
          //   //   table[row.id].refresh=!(table[row.id].refresh);
          //   //   return({...gridOptions,rowData: table});
          //   // })
          // },
          onEnd: async (row) => {
            console.log("delivered order:", row);
            const accept = await endDeliver(row.id);
            console.log(console.log(row.id));
            gridRef.current.api.applyTransaction({ remove: [row] });
          },
        },
      },
    ],
    rowData: [],
  });
  const gridRef = useRef();
  const [ordersAvailable, setOrdersAvailable] = useState([]);


  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrdersAcceptedassigned();
      const statusArray = await getStatus();
      console.log(statusArray)
      const filteredOrders = orders.filter(order => order.pharmacy != "0x0000000000000000000000000000000000000000");
      setOrdersAvailable(filteredOrders);
      const data = filteredOrders.map(order => ({
        id: order.id,
        drugIndex: order.drugIndex,
        pharmacy: order.pharmacy,
        distributor: order.distributor,
        status: order.Status,
        quantity: order.quantity,
        drugStatus:statusArray[order.id],
        refresh:true
      }));
      setGridOptions({ ...gridOptions, rowData: data });
    }
    fetchOrders();
  
  }, []);
  const rowData = ordersAvailable?.map(order => ({
    id: order.id,
    drugIndex: order.drugIndex,
    pharmacy: order.pharmacy,
    distributor: order.distributor,
    status: order.Status,
    
  }));

  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  const actionsRenderer = useCallback((props) => {
    console.log(props.data)
    return (
    <div style={{ marginBottom:'10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {/* <Button variant="success" disabled={props.data.drugStatus==2} size="sm" onClick={() => {props.onStart(props.data);}}>start Delivering</Button> */}
      <Button variant="success"  size="sm" onClick={() => {props.onEnd(props.data);}}>end Delivering</Button>
    </div>
    );
  }, []);

  return (
    <div className="ag-theme-material"
    style={{margin:'10%', marginTop:'1px',marginBottom:'10px' , height: '500px', width: '80%' }}>
      <AgGridReact
        columnDefs={gridOptions.columnDefs}
        rowData={gridOptions.rowData}
        onGridReady={onGridReady}
        frameworkComponents={{ actionsRenderer }}
      />
    </div>
  );
}

export default Deleverygrid;
