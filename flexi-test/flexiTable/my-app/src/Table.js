"use strict";

import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import React, { Component } from "react";
import { render } from "react-dom";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.css';
// import 'ag-grid-enterprise';
import { useEffect, useState, useRef } from 'react';
import BtnCellRenderer from "./BtnCellRenderer.jsx";


    const pagination = true;
    const paginationPageSize = 100;
    const rowHeight = 30;
    const suppressRowTransform = true;

    
    
    class Table extends Component {
    constructor(props) {
        super(props);
    // console.log("data", props.data[0])
    // console.log("columns", props.columns)


        this.state = {
          columnDefs: [
            {
              field: "Audience",
              minWidth: 150,
              suppressMenu: true
            },
            {
              field: "Date",
              minWidth: 150,
              suppressMenu: true
            },
            {
              field: "Impressions",
              maxWidth: 150,
              filter: false,
             
            },
            {
              field: "CTR",
              maxWidth: 150,
              filter: false,
          
            },
            {
              field: "Clicks",
              maxWidth: 150,
              filter: false,

              
            },
            {
              field: "Conversion Rate",
              minWidth: 150,
              filter: false,
            }
          ],
          
          defaultColDef: {
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            floatingFilter: true,
          },
          rowData: [],
          frameworkComponents: {
            btnCellRenderer: BtnCellRenderer
          },
        };

      }

      
      onGridReady = (params) => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      };
    
    //   onFirstDataRendered = (params) => {
    //     params.api.getToolPanelInstance('filters').expandFilters();
    //   };
    
      btn1 = () => {
        this.gridApi.setRowData(getRowData(this.props.data, "K-Cafe"));
      };
      btn2 = () => {
        this.gridApi.setRowData(getRowData(this.props.data, "K-Compact"));
      };
      btn3 = () => {
        this.gridApi.setRowData(getRowData(this.props.data, "K-Duo"));
      };

        



      render() {
        return (
          <div style={{ width: "100vw", height: "100vh" }}>
              <div
          style={{ marginTop:'10px', marginLeft:'10px',height: '8%', display: 'flex', flexDirection: 'column' }}
             >
          <div>
            <span className="button-group" onClick={() => this.btn1()}>
              <button>
             K-Cafe
              </button>
            </span>
            <span className="button-group" onClick={() => this.btn2()}>
              <button>
                K-Compact
              </button>
            </span>
            <span className="button-group" onClick={() => this.btn3()}>
              <button>
                K-Duo
              </button>
            </span>

            </div>
        </div>
            <div
              id="myGrid"
              style={{
                height: "90vh",
                width: "100vw"
              }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                floatingFilter={true}
                frameworkComponents={this.state.frameworkComponents}
                onGridReady={this.onGridReady}
                rowData={this.props.data}
                rowHeight={rowHeight}
                pagination={pagination} 
                paginationPageSize={paginationPageSize}
                suppressRowTransform={suppressRowTransform}
              />
            </div>
          </div>
        );
      }
    }

    function getRowData(data, key) {
        var filtered_data = [];
        for ( let i=0; i< data.length; i++){
            if (data[i].Product == key){
                filtered_data.push(data[i])
            }
        }

        return filtered_data
      }

export default Table;

