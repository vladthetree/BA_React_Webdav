import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import VideoPage from './view/routes/videoPage.jsx';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<VideoPage />} exact />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
