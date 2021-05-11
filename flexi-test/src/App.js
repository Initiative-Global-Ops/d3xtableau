import React from "react";
require("./App.css");

//Needed to use the library
const { tableau } = window;

//Initialize the class and state
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dashboardName: "" };
  }

  //Update the state by passing the dashboard name
  componentDidMount() {
  console.log('Hi!')

    tableau.extensions.initializeAsync().then(() => {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
      this.setState({
        dashboardName
      });
    });
  }

  //Render the Title
  render() {
    return <h1> Hello {this.state.dashboardName}</h1>;
  }
}

export default AppComponent;

// const { tableau } = window;
// function App() {
//   console.log('Hello!')
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
