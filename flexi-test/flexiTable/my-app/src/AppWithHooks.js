import React, { useState, useEffect } from "react";
require("./App.css");

//Needed
const { tableau } = window;

function SetDashboardName() {
  const [dashboardName, setDashboardName] = useState("");

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      const dashboardName = tableau.extensions.dashboardContent.dashboard.name;

      setDashboardName(dashboardName);
    });
  });

  return <h1> Hello {dashboardName}</h1>;
}

export default SetDashboardName;
