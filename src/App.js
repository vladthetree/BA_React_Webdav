import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useContext } from "react";
import PrivateRoute from "./components/utils/pageUtils/PrivateRoute.jsx";

import { ListDir } from "./components/utils/listDir.jsx";
import Login from "../src/routes/login.jsx";
import VideoPage from "./routes/videoPage.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/videos"
              element={<VideoPage listDir={ListDir()} />}
              exact
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
