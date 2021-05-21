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
    // console.log("data", props.data)
    // console.log("columns", props.columns)


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
              field: "Date",
              minWidth: 150,
              suppressMenu: true
            },
            {
              field: "Impressions",
              maxWidth: 150,
              suppressMenu: true
            },
            {
              field: "CTR",
              maxWidth: 150,
              suppressMenu: true
            },
            {
              field: "Clicks",
              maxWidth: 150,
              suppressMenu: true
            },
            {
              field: "Conversion Rate",
              minWidth: 150,
              suppressMenu: true
            }
          ],
          defaultColDef: {
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            floatingFilter: true,
          },
          frameworkComponents: {
            btnCellRenderer: BtnCellRenderer
          },
          rowData: []
        };
      }

    //   irelandAndUk = () => {
    //     var countryFilterComponent = this.gridApi.getFilterInstance('Tactic');
    //     countryFilterComponent.setModel({
    //       values: 'In Market',
    //     });
    //     this.gridApi.onFilterChanged();
    //   };





      render() {
        return (
          <div style={{ width: "100vw", height: "100vh" }}>
              <div
          style={{ marginTop:'10px', marginLeft:'20px',height: '10%', display: 'flex', flexDirection: 'column' }}
             >
          <div>
            <span className="button-group">
              <button>
                In Market
              </button>
            </span>
            </div>
        </div>
            <div
              id="myGrid"
              style={{
                height: "100vh",
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

export default Table;

