"use strict";

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import React, { Component } from "react";
import { render } from "react-dom";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useEffect, useState, useRef } from 'react';
import BtnCellRenderer from "./BtnCellRenderer.jsx";

// const Table = (props) => {
    // const {data, columns} = props
    const pagination = true;
    const paginationPageSize = 10;
    // const rowHeight = 40;
    
    class Table extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          columnDefs: [
            {
              field: "Tactic",
              cellRenderer: "btnCellRenderer",
              cellRendererParams: {
                clicked: function(field) {
                  alert(`${field} was clicked`);
                }
              },
              minWidth: 150
            },
            {
              field: "Advertiser",
              maxWidth: 90
            },
            {
              field: "Date",
              minWidth: 150
            },
            {
              field: "Impressions",
              maxWidth: 90
            },
            {
              field: "Conversion Rate",
              minWidth: 150
            }
          ],
          defaultColDef: {
            flex: 1,
            minWidth: 100
          },
          frameworkComponents: {
            btnCellRenderer: BtnCellRenderer
          },
          rowData: []
        };
      }


      
      onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    
        const updateData = (data) => {
          this.setState({ rowData: data });
        };
    
        // updateData(data);
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
          .then((resp) => resp.json())
          .then((data) => updateData(data));
      };

      render() {
        return (
          <div style={{ width: 600, height: 450 }}>
            <div
              id="myGrid"
              style={{
                height: "100vh",
                width: "95vw"
              }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                frameworkComponents={this.state.frameworkComponents}
                onGridReady={this.onGridReady}
                rowData={this.state.rowData}
                pagination={pagination} 
                paginationPageSize={paginationPageSize}
              />
            </div>
          </div>
        );
      }

    }
    // render(<Table />, document.querySelector("#root"));

// };

export default Table;

