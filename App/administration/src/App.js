import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./client/pages/css/App.css"
import Interface from "./client/pages/Interface.jsx";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Interface />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
