import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useEffect, useState, useRef } from 'react';
import Table from './Table';
import DataGetter from './DataGetter.js';

const App = () => {
  const [data, setData] = useState(0);
  const [columns, setColumns] = useState(0);


  return (
    <div className="table-container" style={{ height: 400, width: 600 }}>
       <Table data={data} columns={columns}/>
       <DataGetter data={data} setData={setData} columns={columns} setColumns={setColumns}/>
    </div>
  );
};

export default App;

