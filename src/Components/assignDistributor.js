import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import {  dele , Decline ,orderStatus,subscribeToAcceptOrder, getAllOrdersAcceptedassigned, getAllOrdersAcceptednotassigned, assignDistributor} from '../Web3Client';

function AssignDistributor({}) {
  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "Drug Index", field: "drugIndex", sortable: true, filter: true },
      { headerName: "Pharmacy", field: "pharmacy", sortable: true, filter: true },
      { headerName: "manufacturer", field: "manufacturer", sortable: true, filter: true },
      {
        headerName: "Actions",
        cellRenderer: "actionsRenderer",
        cellRendererParams: {
          onAssign: async (row) => {
            console.log("assign:", row);
            const accept = await assignDistributor(row.id);
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
      const orders = await getAllOrdersAcceptednotassigned();
      const filteredOrders = orders.filter(order => order.pharmacy != "0x0000000000000000000000000000000000000000");
      setOrdersAvailable(filteredOrders);
      const data = orders.map(order => ({
        id: order.id,
        drugIndex: order.drugIndex,
        pharmacy: order.pharmacy,
        distributor: order.distributor,
        manufacturer: order.manufacturer

      }));
      setGridOptions({ ...gridOptions, rowData: data });
    }
    fetchOrders();
    const unsubscribe = subscribeToAcceptOrder(() => {
      fetchOrders();
    });

    return unsubscribe;
  }, []);
  const rowData = ordersAvailable?.map(order => ({
    id: order.id,
    drugIndex: order.drugIndex,
    pharmacy: order.pharmacy,
    distributor: order.distributor,
    manufacturer: order.manufacturer
  }));

  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  const actionsRenderer = useCallback((props) => {
    return (
    <div style={{ marginBottom:'10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant="success" size="sm" onClick={() => props.onAssign(props.data)}>Assign</Button>
    </div>
    );
  }, []);

  return (
    <div className="ag-theme-material"
    style={{margin:'23%', marginTop:'10px',marginBottom:'10px' , height: '500px', width: '60%' }}>
      <AgGridReact
        columnDefs={gridOptions.columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        frameworkComponents={{ actionsRenderer }}
      />
    </div>
  );
}

export default AssignDistributor;
