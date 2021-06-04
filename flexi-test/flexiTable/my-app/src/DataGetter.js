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
      tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "flexiTable").getUnderlyingDataAsync().then(dataTable => {
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
            dataJson[cols[i]] = d[i].value
        
        }  
          dataArr.push(dataJson)
      });

  
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
