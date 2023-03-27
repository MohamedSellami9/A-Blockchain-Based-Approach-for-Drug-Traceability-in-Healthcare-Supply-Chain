import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from 'react-bootstrap/Button';
import { getOrdersAvailable } from '../Web3Client';

function OrderGrid({}) {
const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "Drug Index", field: "drugIndex", sortable: true, filter: true },
      { headerName: "Pharmacy", field: "pharmacy", sortable: true, filter: true },
      { headerName: "Distributor", field: "distributor", sortable: true, filter: true },
      { headerName: "Status", field: "status", sortable: true, filter: true }
    ],
    rowData: []
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
  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
    <AgGridReact
      columnDefs={gridOptions.columnDefs}
      rowData={rowData}
      onGridReady={onGridReady}
    />
  </div>
  );
}

export default OrderGrid;