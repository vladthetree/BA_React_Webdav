import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./client/pages/css/App.css"
import Interface from "./client/pages/Interface.jsx";
import { useWindowSize } from "react-use";

function App() {
  const { width, height } = useWindowSize([]);


  return (
    <div className="container" style={{height:height,width:width}}>
      <Router>
        <Routes>
          <Route path="/" element={<Interface />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
