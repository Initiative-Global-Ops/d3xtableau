import React from "react";
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
require("./App.css");

const App = () => {
  const rowData = [
      {make: "Toyota", model: "Celica", price: 35000},
      {make: "Ford", model: "Mondeo", price: 32000},
      {make: "Porsche", model: "Boxter", price: 72000}
  ];

  return (
      <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
          <AgGridReact
              rowData={rowData}>
              <AgGridColumn field="make"></AgGridColumn>
              <AgGridColumn field="model"></AgGridColumn>
              <AgGridColumn field="price"></AgGridColumn>
          </AgGridReact>
      </div>
  );
};

export default App;

//Needed
// const { tableau } = window;

// class AppComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { dashboardName: "" };
//   }

//   componentDidMount() {
//     tableau.extensions.initializeAsync().then(() => {
//       const dashboardName = tableau.extensions.dashboardContent.dashboard.name;   
//       tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "D3 DATA").getUnderlyingDataAsync().then(dataTable => {
//         console.log('data columns',dataTable.columns)
//         console.log('all data',dataTable.data)

//         let field = dataTable.columns.find(column => column.fieldName === "Impressions");
//         let list = [];
//         for (let row of dataTable.data) {
//           list.push(row[field.index].value);
//         }
//         let values = list.filter((el, i, arr) => arr.indexOf(el) === i);
//         console.log(values)
//       });
      
//       this.setState({
//         dashboardName
//       });
//     });
//   }

//   render() {
//     return <h1> Hello -- {this.state.dashboardName}</h1>;
//   }
// }

// export default AppComponent;
