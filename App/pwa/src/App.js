import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import MainPage from './view/routes/mainPage.jsx';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
