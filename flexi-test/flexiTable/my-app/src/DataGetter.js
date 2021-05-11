import React from "react";
import { useEffect, useState, useRef } from 'react';
require("./App.css");

const { tableau } = window;

function DataGetter(props){
  const {data, setData, columns, setColumns} = props

  // console.log("columns", columns)
  // console.log("setData", setData)

  useEffect(() => {
  // console.log("useEffect", useEffect)
    tableau.extensions.initializeAsync().then(() => {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;   
      tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "D3 DATA").getUnderlyingDataAsync().then(dataTable => {
        // console.log('data columns',dataTable.columns)
        // console.log('all data',dataTable.data)
    
        var dataJson;
        var dataArr = [];
        var cols = [];
        dataTable.columns.map(d => {
          cols.push(d.fieldName);
       })
    
       dataTable.data.map(d => {
          dataJson = {};
          for (let i = 0; i < cols.length; i++) {   
            if (cols[i].includes("AGG(Conversion Rate)") || cols[i].includes("SUM(Impressions)")) {
              dataJson[cols[i]] = !isNaN(d[i].value) ? d[i].value : 0;
          } else {
              dataJson[cols[i]] = d[i].value;
          }
        }
          
          dataArr.push(dataJson)
      });
      

        let field = dataTable.columns.find(column => column.fieldName === "Impressions");
        let list = [];
        for (let row of dataTable.data) {
          list.push(row[field.index].value);
        }
        let values = list.filter((el, i, arr) => arr.indexOf(el) === i);
        const {data} = dataArr
        const {columns} = dataTable

        setData(dataArr)
        setColumns(columns)

      });
    });
    }, [])

  return <div></div>
}

export default DataGetter;
