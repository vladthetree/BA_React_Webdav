import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "../src/client/pages/css/App.css"
import Interface from "./client/pages/Interface.jsx";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Interface />} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
