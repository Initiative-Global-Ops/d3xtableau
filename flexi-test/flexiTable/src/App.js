import React from "react";
require("./App.css");

//Needed
const { tableau } = window;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dashboardName: "" };
  }

  componentDidMount() {
    tableau.extensions.initializeAsync().then(() => {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;   
      tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === "D3 DATA").getUnderlyingDataAsync().then(dataTable => {
        console.log('data columns',dataTable.columns)
        console.log('all data',dataTable.data)

        let field = dataTable.columns.find(column => column.fieldName === "Impressions");
        let list = [];
        for (let row of dataTable.data) {
          list.push(row[field.index].value);
        }
        let values = list.filter((el, i, arr) => arr.indexOf(el) === i);
        console.log(values)
      });
      
      this.setState({
        dashboardName
      });
    });
  }

  render() {
    return <h1> Hello -- {this.state.dashboardName}</h1>;
  }
}

export default AppComponent;
