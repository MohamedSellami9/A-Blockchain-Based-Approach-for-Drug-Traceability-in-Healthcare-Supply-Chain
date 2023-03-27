import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import { getOrdersAvailable, Accept , Decline ,orderStatus,subscribeToAcceptOrder} from '../Web3Client';

function OrderGrid({}) {
  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "Drug Index", field: "drugIndex", sortable: true, filter: true },
      { headerName: "Pharmacy", field: "pharmacy", sortable: true, filter: true },
      { headerName: "Distributor", field: "distributor", sortable: true, filter: true },
      { headerName: "Status", field: "status", sortable: true, filter: true },
      {
        headerName: "Actions",
        cellRenderer: "actionsRenderer",
        cellRendererParams: {
          onAccept: async (row) => {
            console.log("Accepted order:", row);
            const accept = await Accept(row.id);
            console.log(console.log(row.id));
          },
          onDecline: async (row) => {
            console.log("Declined order:", row);
            console.log(console.log(row.id));
            console.log(orderStatus(row.id));
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
      const orders = await getOrdersAvailable();
      setOrdersAvailable(orders);
      const data = orders.map(order => ({
        id: order.id,
        drugIndex: order.drugIndex,
        pharmacy: order.pharmacy,
        distributor: order.distributor,
        status: order.Status
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
    status: order.Status
  }));

  const onGridReady = useCallback(params => {
    gridRef.current = params;
    params.api.sizeColumnsToFit();
  }, []);

  const actionsRenderer = useCallback((props) => {
    return (
    <div style={{ marginBottom:'10px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Button variant="success" size="sm" onClick={() => props.onAccept(props.data)}>Accept</Button>
      <Button variant="danger" size="sm" onClick={() => props.onDecline(props.data)}>Decline</Button>
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

export default OrderGrid;
