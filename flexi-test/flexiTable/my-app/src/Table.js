import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useEffect, useState, useRef } from 'react';

const Table = (props) => {
    const {data, columns} = props

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact rowData={data}>
          <AgGridColumn field="Tactic" sortable={ true } filter={ true }></AgGridColumn>
          <AgGridColumn field="Date" sortable={ true } filter={ true }></AgGridColumn>
          <AgGridColumn field="Advertiser" sortable={ true } filter={ true }></AgGridColumn>
        </AgGridReact>
    </div>
  );
};

export default Table;

