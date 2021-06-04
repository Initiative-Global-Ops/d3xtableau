import React, { Component } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.css';

class DropDowns extends Component({
     getInitialState: function() {
         return {
             value: 'select'
         }
     },
     change: function(event){
         this.setState({value: event.target.value});
     },
     render: function(){
        return(
           <div>
               <select id="lang" onChange={this.change} value={this.state.value}>
                  <option value="select">Select</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
               </select>
               <p></p>
               <p>{this.state.value}</p>
           </div>
        );
     }
});

export default DropDowns;
